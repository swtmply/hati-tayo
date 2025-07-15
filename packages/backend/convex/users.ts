import { getAuthUserId } from "@convex-dev/auth/server";
import { filter } from "convex-helpers/server/filter";
import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

export const searchUser = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const authUser = userId !== null ? await ctx.db.get(userId) : null;

    if (authUser === null) {
      return null;
    }

    return await filter(
      ctx.db
        .query("users")
        .withSearchIndex("search_email", (q) => q.search("email", args.query)),
      (user) => user.email !== authUser.email
    ).collect();
  },
});

export const getUserByEmail = async (ctx: QueryCtx, email: string) => {
  return await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
};

export const deleteUser = mutation({
  args: {}, // No arguments needed, user is derived from session
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const user = userId !== null ? await ctx.db.get(userId) : null;

    if (user === null) {
      return null;
    }

    // 1. Delete transactionShares for the user
    const shares = await ctx.db
      .query("transactionShares")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
    for (const share of shares) {
      await ctx.db.delete(share._id);
    }

    // 2, Delete auth accounts
    const authAccounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
    for (const authAccount of authAccounts) {
      await ctx.db.delete(authAccount._id);
    }

    // 3. Remove user from transaction participants
    // And nullify if they are a payer (as discussed, not deleting/reassigning payer for now)
    const userTransactions = await ctx.db
      .query("transactions")
      .filter((q) =>
        q.or(
          q.eq(q.field("payerId"), userId),
          q.eq(q.field("participants"), [userId]) // This might need adjustment if participants is an array
        )
      )
      .collect();

    // A more robust way to check participation
    const allTransactions = await ctx.db.query("transactions").collect();
    const transactionsInvolvingUser = allTransactions.filter((tx) => {
      return tx.payerId === userId;
    });

    for (const transaction of transactionsInvolvingUser) {
      if (transaction.payerId === userId) {
        // User is the payer, delete this transaction and its shares
        const sharesForThisTransaction = await ctx.db
          .query("transactionShares")
          .withIndex("by_transactionId", (q) =>
            q.eq("transactionId", transaction._id)
          )
          .collect();
        for (const share of sharesForThisTransaction) {
          await ctx.db.delete(share._id);
        }
        await ctx.db.delete(transaction._id);
      } else {
        // User is only a participant, remove them from participants list
        const newParticipants = transaction.participants.filter(
          (participantId) => participantId !== userId
        );
        if (newParticipants.length !== transaction.participants.length) {
          // This check is important to only patch if there's a change
          await ctx.db.patch(transaction._id, {
            participants: newParticipants,
          });
        }
      }
    }

    // 4. Delete the user document
    await ctx.db.delete(user._id);

    return { success: true, userId };
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});

export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    await ctx.db.patch(userId, { name: args.name, updatedAt: Date.now() });
    return { success: true };
  },
});

export const updateEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    // Check if email is already in use by another user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.neq(q.field("_id"), userId)) // Exclude current user
      .unique();

    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    await ctx.db.patch(userId, { email: args.email, updatedAt: Date.now() });
    // Note: If email is used for login, additional steps might be needed
    // with the auth provider (e.g., updating email in Auth0/Clerk and Convex's auth tables)
    // This will be handled in step 7 if necessary.
    return { success: true };
  },
});

export const updatePhoneNumber = mutation({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    await ctx.db.patch(userId, {
      phoneNumber: args.phoneNumber,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// Placeholder for password update.
// Actual implementation will depend on the auth provider and will be detailed in Step 7.
export const updatePassword = mutation({
  args: { currentPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // The default "convex" auth provider does not support password changes.
    // A more advanced provider like Clerk or Auth0 would be needed for this functionality.
    throw new Error(
      "Password updates are not supported with the current authentication setup."
    );
  },
});
