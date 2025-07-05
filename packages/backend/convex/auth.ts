import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel.js";
import type { MutationCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		Password<DataModel>({
			id: "password",
			profile(params, ctx) {
				return {
					name: params.name as string,
					email: params.email as string,
					image: params.image as string,
					phoneNumber: params.phoneNumber as string,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				};
			},
		}),
	],
	callbacks: {
		async createOrUpdateUser(ctx: MutationCtx, args) {
			if (args.existingUserId) {
				return args.existingUserId;
			}

			const existingUser = await ctx.db
				.query("users")
				.withIndex("by_phoneNumber", (q) =>
					q.eq("phoneNumber", args.profile.phoneNumber as string),
				)
				.unique();

			if (existingUser !== null) {
				ctx.db.patch(existingUser._id, {
					name: args.profile.name as string,
					email: args.profile.email as string,
					image: args.profile.image as string,
					phoneNumber: args.profile.phoneNumber as string,
					updatedAt: Date.now(),
				});

				return existingUser._id;
			}

			return ctx.db.insert("users", {
				name: args.profile.name as string,
				email: args.profile.email as string,
				image: args.profile.image as string,
				phoneNumber: args.profile.phoneNumber as string,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		},
	},
});
