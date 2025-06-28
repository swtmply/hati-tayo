import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "./_generated/dataModel.js";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
	providers: [
		Password<DataModel>({
			id: "password",
			profile(params, ctx) {
				return {
					name: params.name as string,
					email: params.email as string,
					image: params.image as string,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				};
			},
		}),
	],
});
