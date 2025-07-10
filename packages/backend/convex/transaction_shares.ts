import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTransactionSummary = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		const user = userId !== null ? await ctx.db.get(userId) : null;

		if (user === null) {
			return {
				totalOwed: 0,
				totalPaid: 0,
			};
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
		try {
			for (const id of args.ids) {
				await ctx.db.patch(id, {
					status: "PAID",
				});
			}

			return {
				ok: true,
				message: "Transaction share updated successfully",
			};
		} catch (error) {
			return {
				ok: false,
				message: "Failed to update transaction share",
			};
		}
	},
});
