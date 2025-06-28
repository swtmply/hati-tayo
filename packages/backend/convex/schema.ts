import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
	transactions: defineTable({
		groupId: v.id("groups"),
		payerId: v.id("users"),
		participants: v.array(v.id("users")),

		amount: v.number(),
		date: v.number(),
		name: v.string(),
		splitType: v.string(),
		image: v.optional(v.string()),

		createdAt: v.number(),
		updatedAt: v.number(),
	})
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
