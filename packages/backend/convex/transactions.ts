import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getUserByEmail } from "./users";

export const transactionsOfCurrentUser = query({
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

		const transactions = [];

		for await (const transaction of ctx.db
			.query("transactions")
			.order("desc")) {
			if (transaction.participants.includes(user._id)) {
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
		}

		return transactions;
	},
});

export const getTransactionDetailsById = query({
	args: {
		id: v.id("transactions"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Unathorized");
		}

		const user = await getUserByEmail(ctx, identity.email ?? "");
		let totalOwed = 0;

		if (user === null) {
			throw new Error("User not found");
		}

		const transaction = await ctx.db.get(args.id);
		if (transaction === null) {
			throw new Error("Transaction not found");
		}

		const payer = await ctx.db.get(transaction.payerId);
		const group = await ctx.db.get(transaction.groupId);
		const members = [];

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

			if (member._id === user._id && share?.status === "PENDING") {
				totalOwed += share?.amount ?? 0;
			}

			members.push({
				...member,
				share,
			});
		}

		if (payer === null) {
			throw new Error("Payer not found");
		}

		return {
			...transaction,
			payer,
			group,
			participants: members,
			totalOwed,
			isSettled: members.every((member) => member.share?.status === "PAID"),
		};
	},
});

export const createTransaction = mutation({
	args: {
		name: v.string(),
		groupName: v.optional(v.string()),
		groupId: v.optional(v.id("groups")),
		participants: v.array(
			v.object({
				_id: v.string(),
				name: v.string(),
				email: v.optional(v.string()),
				phoneNumber: v.optional(v.string()),
			}),
		),
		amount: v.number(),
		splitType: v.string(),
		payerId: v.string(),
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

		const participantsIds = [] as Id<"users">[];
		let payerId: Id<"users"> = "" as Id<"users">;

		// Insert users if they are not in the database
		for (const participant of args.participants) {
			if (
				participant._id.startsWith("anonymous-user-") ||
				participant._id.startsWith("contact-")
			) {
				const id = await ctx.db.insert("users", {
					name: participant.name,
					email: participant.email,
					image: `https://ui-avatars.com/api/?background=random&name=${participant.name.replace(" ", "+")}`,
					groups: [],
					transactions: [],
					phoneNumber: participant.phoneNumber,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				});

				if (participant._id === args.payerId) {
					payerId = id;
				}

				participantsIds.push(id);
			} else {
				participantsIds.push(participant._id as Id<"users">);

				if (participant._id === args.payerId) {
					payerId = participant._id as Id<"users">;
				}
			}
		}

		// Create group if it doesn't exist
		if (args.groupId === undefined) {
			if (args.groupName === undefined) {
				throw new Error("Cannot create transaction without group name");
			}

			if (args.groupName === "") {
				throw new Error("Group name is required");
			}

			// Create group
			const groupId = await ctx.db.insert("groups", {
				name: args.groupName,
				members: participantsIds,
				transactions: [],
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});

			args.groupId = groupId;
		}

		// Create transaction
		const transaction = await ctx.db.insert("transactions", {
			name: args.name,
			groupId: args.groupId,
			payerId,
			participants: participantsIds,
			amount: args.amount,
			date: Date.now(),
			splitType: args.splitType,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});

		// Create transaction shares
		for (const participant of participantsIds) {
			await ctx.db.insert("transactionShares", {
				transactionId: transaction,
				userId: participant,
				status: payerId === participant ? "PAID" : "PENDING",
				amount: args.amount / participantsIds.length,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		}

		return transaction;
	},
});
