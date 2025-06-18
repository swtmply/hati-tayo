import { filter } from "convex-helpers/server/filter";
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
