import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const equalSplitValidator = v.object({
	name: v.string(),
	groupId: v.id("groups"),
	participants: v.array(v.id("users")),
	amount: v.number(),
	splitType: v.literal("EQUAL"),
	payerId: v.id("users"),
	date: v.number(),
});

export const percentageSplitValidator = v.object({
	name: v.string(),
	groupId: v.id("groups"),
	participants: v.array(v.id("users")),
	amount: v.number(),
	splitType: v.literal("PERCENTAGE"),
	percentages: v.array(
		v.object({
			userId: v.id("users"),
			percentage: v.number(),
		}),
	),
	date: v.number(),
	payerId: v.id("users"),
});

export const fixedSplitValidator = v.object({
	name: v.string(),
	groupId: v.id("groups"),
	participants: v.array(v.id("users")),
	amount: v.number(),
	splitType: v.literal("FIXED"),
	fixedAmounts: v.array(
		v.object({
			userId: v.id("users"),
			amount: v.number(),
		}),
	),
	date: v.number(),
	payerId: v.id("users"),
});

export const sharedSplitValidator = v.object({
	name: v.string(),
	groupId: v.id("groups"),
	participants: v.array(v.id("users")),
	amount: v.number(),
	splitType: v.literal("SHARED"),
	items: v.array(
		v.object({
			participantIds: v.array(v.id("users")),
			name: v.string(),
			amount: v.number(),
		}),
	),
	sharedAmounts: v.array(
		v.object({
			userId: v.id("users"),
			amount: v.number(),
		}),
	),
	date: v.number(),
	payerId: v.id("users"),
});

export const transactionSchema = v.union(
	equalSplitValidator,
	percentageSplitValidator,
	fixedSplitValidator,
	sharedSplitValidator,
);

export default defineSchema({
	...authTables,
	users: defineTable({
		name: v.string(),
		email: v.optional(v.string()),
		phoneNumber: v.optional(v.string()),
		image: v.string(),
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_email", ["email"])
		.index("by_phoneNumber", ["phoneNumber"])
		.searchIndex("search_email", {
			searchField: "email",
			filterFields: ["email"],
		}),
	groups: defineTable({
		name: v.string(),
		members: v.array(v.id("users")),
		transactions: v.array(v.id("transactions")),
		createdAt: v.number(),
		updatedAt: v.number(),
	}),
	transactions: defineTable(transactionSchema)
		.index("by_payerId", ["payerId"])
		.index("by_groupId", ["groupId"]),
	transactionShares: defineTable({
		transactionId: v.id("transactions"),
		userId: v.id("users"),

		status: v.string(),
		amount: v.number(),

		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_userId", ["userId"])
		.index("by_transactionId", ["transactionId"]),
});
