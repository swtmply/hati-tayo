import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByEmail } from "./users";

export const groupsOfCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Unauthorized");
		}

		const user = await getUserByEmail(ctx, identity.email ?? "");

		if (user === null) {
			throw new Error("User not found");
		}

		const groups = [];

		for await (const group of ctx.db.query("groups")) {
			if (group.members.includes(user._id)) {
				let totalOwed = 0;
				let totalPaid = 0;

				const members = [];

				for await (const memberId of group.members) {
					const member = await ctx.db.get(memberId);
					if (member === null) {
						continue;
					}
					members.push(member);
				}

				// Get all transactions of group
				const transactions = await ctx.db
					.query("transactions")
					.withIndex("by_groupId", (q) => q.eq("groupId", group._id))
					.collect();

				for (const transaction of transactions) {
					const share = await ctx.db
						.query("transactionShares")
						.withIndex("by_transactionId", (q) =>
							q.eq("transactionId", transaction._id),
						)
						.filter((q) => q.eq(q.field("userId"), user._id))
						.unique();

					if (share === null) {
						continue;
					}

					if (share.status === "PAID") {
						totalPaid += share.amount;
					} else {
						totalOwed += share.amount;
					}
				}

				groups.push({
					...group,
					totalOwed,
					totalPaid,
					transactionCount: transactions.length,
					members,
				});
			}
		}

		return groups;
	},
});

export const getGroupDetailsById = query({
	args: {
		id: v.id("groups"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Unathorized");
		}

		const user = await getUserByEmail(ctx, identity.email ?? "");
		if (user === null) {
			throw new Error("User not found");
		}

		const group = await ctx.db.get(args.id);
		if (group === null) {
			throw new Error("Group not found");
		}

		const transactions = [];

		for await (const transaction of ctx.db
			.query("transactions")
			.withIndex("by_groupId", (q) => q.eq("groupId", group._id))
			.order("desc")) {
			const payer = await ctx.db.get(transaction.payerId);
			const members = [];
			const share = await ctx.db
				.query("transactionShares")
				.withIndex("by_transactionId", (q) =>
					q.eq("transactionId", transaction._id),
				)
				.filter((q) => q.eq(q.field("userId"), user._id))
				.unique();

			for await (const memberId of transaction.participants) {
				const member = await ctx.db.get(memberId);
				if (member === null) {
					continue;
				}
				const share = await ctx.db
					.query("transactionShares")
					.withIndex("by_transactionId", (q) =>
						q.eq("transactionId", transaction._id),
					)
					.filter((q) => q.eq(q.field("userId"), member._id))
					.unique();
				members.push({
					...member,
					share,
				});
			}

			if (payer === null) {
				continue;
			}

			transactions.push({
				...transaction,
				payer,
				participants: members,
				share,
				isSettled: members.every((member) => member.share?.status === "PAID"),
			});
		}

		return {
			...group,
			transactions,
		};
	},
});

export const groupsOfCurrentUserWithMembers = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Unauthorized");
		}

		const user = await getUserByEmail(ctx, identity.email ?? "");

		if (user === null) {
			throw new Error("User not found");
		}

		const groups = [];

		for await (const group of ctx.db.query("groups")) {
			if (group.members.includes(user._id)) {
				const members = [];

				for await (const memberId of group.members) {
					const member = await ctx.db.get(memberId);
					if (member === null) {
						continue;
					}
					members.push(member);
				}

				groups.push({
					...group,
					members,
				});
			}
		}

		return groups;
	},
});

export const createGroup = mutation({
	args: {
		name: v.string(),
		members: v.array(v.id("users")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Unauthorized");
		}

		const user = await getUserByEmail(ctx, identity.email ?? "");

		if (user === null) {
			throw new Error("User not found");
		}

		const group = await ctx.db.insert("groups", {
			name: args.name,
			members: [...args.members, user._id],
			transactions: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		return group;
	},
});
