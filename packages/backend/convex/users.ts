import { getAuthUserId } from "@convex-dev/auth/server";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

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
		const userId = await getAuthUserId(ctx);
		const authUser = userId !== null ? await ctx.db.get(userId) : null;

		if (authUser === null) {
			return null;
		}

		return await filter(
			ctx.db
				.query("users")
				.withSearchIndex("search_email", (q) => q.search("email", args.query)),
			(user) => user.email !== authUser.email,
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
		const userId = await getAuthUserId(ctx);
		const user = userId !== null ? await ctx.db.get(userId) : null;

		if (user === null) {
			return null;
		}

		// 1. Delete transactionShares for the user
		const shares = await ctx.db
			.query("transactionShares")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.collect();
		for (const share of shares) {
			await ctx.db.delete(share._id);
		}

		// 2, Delete auth accounts
		const authAccounts = await ctx.db
			.query("authAccounts")
			.filter((q) => q.eq(q.field("userId"), user._id))
			.collect();
		for (const authAccount of authAccounts) {
			await ctx.db.delete(authAccount._id);
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
		const transactionsInvolvingUser = allTransactions.filter(
			(tx) =>
				tx.payerId === userId || tx.participants.some((pId) => pId === userId),
		);

		for (const transaction of transactionsInvolvingUser) {
			if (transaction.payerId === userId) {
				// User is the payer, delete this transaction and its shares
				const sharesForThisTransaction = await ctx.db
					.query("transactionShares")
					.withIndex("by_transactionId", (q) =>
						q.eq("transactionId", transaction._id),
					)
					.collect();
				for (const share of sharesForThisTransaction) {
					await ctx.db.delete(share._id);
				}
				await ctx.db.delete(transaction._id);
			} else {
				// User is only a participant, remove them from participants list
				const newParticipants = transaction.participants.filter(
					(participantId) => participantId !== userId,
				);
				if (newParticipants.length !== transaction.participants.length) {
					// This check is important to only patch if there's a change
					await ctx.db.patch(transaction._id, {
						participants: newParticipants,
					});
				}
			}
		}

		// 4. Delete the user document
		await ctx.db.delete(user._id);

		// Note: This function does not interact with Clerk's user database.
		// Clerk user deletion might need to be handled separately if you want to remove them from Clerk's system.
		// For instance, by calling Clerk's Backend API from here or on the client-side.
		// For now, this only deletes the user from the Convex database.

		return { success: true, userId };
	},
});

export const get = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		return userId !== null ? ctx.db.get(userId) : null;
	},
});
