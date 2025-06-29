import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const groupsOfCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		const user = userId !== null ? await ctx.db.get(userId) : null;

		if (user === null) {
			return [];
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

type GroupParticipant = {
	_id: Id<"users">;
	_creationTime: number;
	email?: string | undefined;
	phoneNumber?: string | undefined;
	name: string;
	image: string;
	createdAt: number;
	updatedAt: number;
	shares: {
		_id: Id<"transactionShares">;
		_creationTime: number;
		createdAt: number;
		updatedAt: number;
		amount: number;
		transactionId: Id<"transactions">;
		userId: Id<"users">;
		status: string;
	}[];
};
export const getGroupDetailsById = query({
	args: {
		id: v.id("groups"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		const user = userId !== null ? await ctx.db.get(userId) : null;

		if (user === null) {
			return null;
		}

		const group = await ctx.db.get(args.id);
		if (group === null) {
			return null;
		}

		const participants: GroupParticipant[] = [];

		for await (const memberId of group.members) {
			const member = await ctx.db.get(memberId);
			if (member === null) {
				continue;
			}

			participants.push({ ...member, shares: [] });
		}

		const transactions = [];
		const userPaidTransactions = [];

		for await (const transaction of ctx.db
			.query("transactions")
			.withIndex("by_groupId", (q) => q.eq("groupId", group._id))
			.order("desc")) {
			const payer = await ctx.db.get(transaction.payerId);

			if (payer !== null && payer._id === user._id) {
				userPaidTransactions.push(transaction);
			}

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

				const participantIndex = participants.findIndex(
					(p) => p._id === member._id,
				);

				if (participantIndex !== -1 && share !== null) {
					participants[participantIndex].shares.push(share);
				}

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
			participants,
			userPaidTransactions,
		};
	},
});

export const groupsOfCurrentUserWithMembers = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		const user = userId !== null ? await ctx.db.get(userId) : null;

		if (user === null) {
			return [];
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
		const userId = await getAuthUserId(ctx);
		const user = userId !== null ? await ctx.db.get(userId) : null;

		if (user === null) {
			return null;
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
