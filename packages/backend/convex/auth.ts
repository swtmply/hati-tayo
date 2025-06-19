import { query } from "./_generated/server";
import { getUserByEmail } from "./users";

export const get = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new Error("Unauthorized");
		}

		const user = await getUserByEmail(ctx, identity.email ?? "");

		return user;
	},
});
