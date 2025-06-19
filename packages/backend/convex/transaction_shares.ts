import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByEmail } from "./users";

export const getTransactionSummary = query({
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

		let totalOwed = 0;
		let totalPaid = 0;

		const transactions = await ctx.db
			.query("transactions")
			.withIndex("by_payerId", (q) => q.eq("payerId", user._id))
			.collect();

		for (const transaction of transactions) {
			const share = await ctx.db
				.query("transactionShares")
				.withIndex("by_transactionId", (q) =>
					q.eq("transactionId", transaction._id),
				)
				.filter((q) => q.eq(q.field("status"), "PENDING"))
				.collect();

			totalPaid += share.reduce((acc, share) => acc + share.amount, 0);
		}

		const shares = await ctx.db
			.query("transactionShares")
			.withIndex("by_userId", (q) => q.eq("userId", user._id))
			.filter((q) => q.eq(q.field("status"), "PENDING"))
			.collect();

		for (const share of shares) {
			totalOwed += share.amount;
		}

		return {
			totalOwed,
			totalPaid,
		};
	},
});

export const updateTransactionShare = mutation({
	args: {
		ids: v.array(v.id("transactionShares")),
	},
	handler: async (ctx, args) => {
		for (const id of args.ids) {
			await ctx.db.patch(id, {
				status: "PAID",
			});
		}
	},
});
