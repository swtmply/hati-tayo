import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

export const createUser = mutation({
	args: {
		email: v.string(),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await ctx.db.insert("users", {
			name: args.name,
			email: args.email,
			image: `https://ui-avatars.com/api/?background=random&name=${args.name.replace(" ", "+")}`,
			groups: [],
			transactions: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		return userId;
	},
});

export const searchUser = query({
	args: {
		query: v.string(),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Unauthorized");
		}

		return await filter(
			ctx.db
				.query("users")
				.withSearchIndex("search_email", (q) => q.search("email", args.query)),
			(user) => user.email !== identity.email,
		).collect();
	},
});

export const getUserByEmail = async (ctx: QueryCtx, email: string) => {
	return await ctx.db
		.query("users")
		.withIndex("by_email", (q) => q.eq("email", email))
		.unique();
};

export const deleteUser = mutation({
	args: {}, // No arguments needed, user is derived from session
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthorized: No user is signed in.");
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", identity.email!))
			.unique();

		if (!user) {
			throw new Error("User not found.");
		}

		const userId = user._id;

		// 1. Delete transactionShares for the user
		const shares = await ctx.db
			.query("transactionShares")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.collect();
		for (const share of shares) {
			await ctx.db.delete(share._id);
		}

		// 2. Remove user from groups
		if (user.groups && user.groups.length > 0) {
			for (const groupId of user.groups) {
				const group = await ctx.db.get(groupId);
				if (group) {
					const updatedMembers = group.members.filter((id) => !id.equals(userId));
					await ctx.db.patch(groupId, { members: updatedMembers });
				}
			}
		}

		// 3. Remove user from transaction participants
		// And nullify if they are a payer (as discussed, not deleting/reassigning payer for now)
		const userTransactions = await ctx.db
			.query("transactions")
			.filter((q) =>
				q.or(
					q.eq(q.field("payerId"), userId),
					q.eq(q.field("participants"), [userId]), // This might need adjustment if participants is an array
				),
			)
			.collect();

		// A more robust way to check participation
		const allTransactions = await ctx.db.query("transactions").collect();
		const transactionsInvolvingUser = allTransactions.filter(tx =>
			tx.payerId.equals(userId) || tx.participants.some(pId => pId.equals(userId))
		);

		for (const transaction of transactionsInvolvingUser) {
			const newParticipants = transaction.participants.filter(
				(participantId) => !participantId.equals(userId),
			);
			if (newParticipants.length !== transaction.participants.length) {
				await ctx.db.patch(transaction._id, {
					participants: newParticipants,
				});
			}
			// If payerId is the user, we are currently leaving it as is.
			// If specific handling is needed like setting to null, it would be:
			// if (transaction.payerId.equals(userId)) {
			//  await ctx.db.patch(transaction._id, { payerId: null }); // Requires schema change for payerId to be v.optional(v.id("users"))
			// }
		}

		// 4. Delete the user document
		await ctx.db.delete(userId);

		// Note: This function does not interact with Clerk's user database.
		// Clerk user deletion might need to be handled separately if you want to remove them from Clerk's system.
		// For instance, by calling Clerk's Backend API from here or on the client-side.
		// For now, this only deletes the user from the Convex database.

		return { success: true, userId };
	},
});
