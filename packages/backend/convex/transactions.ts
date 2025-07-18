import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const transactionsOfCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const user = userId !== null ? await ctx.db.get(userId) : null;

    if (user === null) {
      return [];
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
            q.eq("transactionId", transaction._id)
          )
          .filter((q) => q.eq(q.field("userId"), user._id))
          .unique();

        if (share !== null) {
          let pendingShares = [];

          if (transaction.payerId === user._id) {
            pendingShares = await ctx.db
              .query("transactionShares")
              .withIndex("by_transactionId", (q) =>
                q.eq("transactionId", transaction._id)
              )
              .filter((q) => q.eq(q.field("status"), "PENDING"))
              .collect();
          } else {
            pendingShares = await ctx.db
              .query("transactionShares")
              .withIndex("by_transactionId", (q) =>
                q.eq("transactionId", transaction._id)
              )
              .filter((q) => q.eq(q.field("userId"), user._id))
              .collect();
          }

          share.amount = pendingShares.reduce(
            (acc, share) => acc + share.amount,
            0
          );
        }

        const group = await ctx.db.get(transaction.groupId);

        for await (const memberId of transaction.participants) {
          const member = await ctx.db.get(memberId);
          if (member === null) {
            continue;
          }
          const share = await ctx.db
            .query("transactionShares")
            .withIndex("by_transactionId", (q) =>
              q.eq("transactionId", transaction._id)
            )
            .filter((q) => q.eq(q.field("userId"), member._id))
            .unique();
          members.push({
            ...member,
            share,
          });
        }

        transactions.push({
          ...transaction,
          payer,
          participants: members,
          share,
          isSettled: members.every((member) => member.share?.status === "PAID"),
          group,
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
    const userId = await getAuthUserId(ctx);
    const user = userId !== null ? await ctx.db.get(userId) : null;

    if (user === null) {
      return null;
    }
    let totalOwed = 0;

    const transaction = await ctx.db.get(args.id);
    if (transaction === null) {
      return null;
    }

    const payer = await ctx.db.get(transaction.payerId);
    const group = await ctx.db.get(transaction.groupId);
    const participants = [];

    for await (const memberId of transaction.participants) {
      const member = await ctx.db.get(memberId);
      if (member === null) {
        continue;
      }
      const share = await ctx.db
        .query("transactionShares")
        .withIndex("by_transactionId", (q) =>
          q.eq("transactionId", transaction._id)
        )
        .filter((q) => q.eq(q.field("userId"), member._id))
        .unique();

      if (member._id === user._id && share?.status === "PENDING") {
        totalOwed += share?.amount ?? 0;
      }

      participants.push({
        ...member,
        share,
      });
    }

    return {
      ...transaction,
      payer,
      group,
      participants,
      totalOwed,
      isSettled: participants.every(
        (participant) => participant.share?.status === "PAID"
      ),
    };
  },
});

const equalSplitValidator = v.object({
  name: v.string(),
  groupName: v.optional(v.string()),
  groupId: v.optional(v.id("groups")),
  participants: v.array(
    v.object({
      _id: v.string(),
      name: v.string(),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    })
  ),
  amount: v.number(),
  splitType: v.literal("EQUAL"),
  payerId: v.string(),
});

const percentageSplitValidator = v.object({
  name: v.string(),
  groupName: v.optional(v.string()),
  groupId: v.optional(v.id("groups")),
  participants: v.array(
    v.object({
      _id: v.string(),
      name: v.string(),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    })
  ),
  amount: v.number(),
  splitType: v.literal("PERCENTAGE"),
  percentages: v.array(
    v.object({
      userId: v.string(),
      percentage: v.number(),
    })
  ),
  payerId: v.string(),
});

const fixedSplitValidator = v.object({
  name: v.string(),
  groupName: v.optional(v.string()),
  groupId: v.optional(v.id("groups")),
  participants: v.array(
    v.object({
      _id: v.string(),
      name: v.string(),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    })
  ),
  amount: v.number(),
  splitType: v.literal("FIXED"),
  fixedAmounts: v.array(
    v.object({
      userId: v.string(),
      amount: v.number(),
    })
  ),
  payerId: v.string(),
});

const sharedSplitValidator = v.object({
  name: v.string(),
  groupName: v.optional(v.string()),
  groupId: v.optional(v.id("groups")),
  participants: v.array(
    v.object({
      _id: v.string(),
      name: v.string(),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    })
  ),
  amount: v.number(),
  splitType: v.literal("SHARED"),
  items: v.array(
    v.object({
      participantIds: v.array(v.string()),
      name: v.string(),
      amount: v.number(),
    })
  ),
  sharedAmounts: v.array(
    v.object({
      userId: v.string(),
      amount: v.number(),
    })
  ),
  payerId: v.string(),
});

export const createTransaction = mutation({
  args: {
    data: v.union(
      equalSplitValidator,
      percentageSplitValidator,
      fixedSplitValidator,
      sharedSplitValidator
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const user = userId !== null ? await ctx.db.get(userId) : null;

    if (user === null) {
      return {
        ok: false,
        message: "User not found.",
      };
    }

    const participantsIds = [] as Id<"users">[];
    let payerId: Id<"users"> = "" as Id<"users">;
    const percentages: { userId: Id<"users">; percentage: number }[] = [];
    const fixedAmounts: { userId: Id<"users">; amount: number }[] = [];
    const sharedAmounts: { userId: Id<"users">; amount: number }[] = [];

    try {
      // Insert users if they are not in the database
      for (const participant of args.data.participants) {
        if (
          participant._id.startsWith("anonymous-user-") ||
          participant._id.startsWith("contact-")
        ) {
          let id = "" as Id<"users">;
          let existingUser = null;

          if (participant.phoneNumber !== "") {
            existingUser = await ctx.db
              .query("users")
              .withIndex("by_phoneNumber", (q) =>
                q.eq(
                  "phoneNumber",
                  participant.phoneNumber?.startsWith("+")
                    ? participant.phoneNumber.replace("+63", "0")
                    : participant.phoneNumber
                )
              )
              .unique();
          }

          if (existingUser !== null) {
            // Check if user is already in the participantsIds array
            if (participantsIds.includes(existingUser._id)) {
              continue;
            }

            id = existingUser._id;
          } else {
            id = await ctx.db.insert("users", {
              name: participant.name,
              email: participant.email,
              image: generateImage(),
              phoneNumber: participant.phoneNumber?.startsWith("+")
                ? participant.phoneNumber.replace("+63", "0")
                : participant.phoneNumber,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }

          if (args.data.payerId === participant._id) {
            payerId = id;
          }

          if (args.data.splitType === "PERCENTAGE") {
            const percentage = args.data.percentages.find(
              (p) => p.userId === participant._id
            );
            percentages.push({
              userId: id,
              percentage: percentage?.percentage ?? 0,
            });
          }

          if (args.data.splitType === "FIXED") {
            const fixedAmount = args.data.fixedAmounts.find(
              (p) => p.userId === participant._id
            );
            fixedAmounts.push({
              userId: id,
              amount: fixedAmount?.amount ?? 0,
            });
          }

          if (args.data.splitType === "SHARED") {
            const sharedAmount = args.data.sharedAmounts.find(
              (p) => p.userId === participant._id
            );
            sharedAmounts.push({
              userId: id,
              amount: sharedAmount?.amount ?? 0,
            });
          }

          participantsIds.push(id);
        } else {
          if (args.data.payerId === participant._id) {
            payerId = participant._id as Id<"users">;
          }

          if (args.data.splitType === "PERCENTAGE") {
            const percentage = args.data.percentages.find(
              (p) => p.userId === participant._id
            );
            percentages.push({
              userId: participant._id as Id<"users">,
              percentage: percentage?.percentage ?? 0,
            });
          }

          if (args.data.splitType === "FIXED") {
            const fixedAmount = args.data.fixedAmounts.find(
              (p) => p.userId === participant._id
            );
            fixedAmounts.push({
              userId: participant._id as Id<"users">,
              amount: fixedAmount?.amount ?? 0,
            });
          }

          if (args.data.splitType === "SHARED") {
            const sharedAmount = args.data.sharedAmounts.find(
              (p) => p.userId === participant._id
            );
            sharedAmounts.push({
              userId: participant._id as Id<"users">,
              amount: sharedAmount?.amount ?? 0,
            });
          }

          participantsIds.push(participant._id as Id<"users">);
        }
      }

      if (args.data.groupId === undefined) {
        // Create group if it doesn't exist
        if (args.data.groupName === undefined) {
          return null;
        }

        if (args.data.groupName === "") {
          return null;
        }

        // Create group
        const groupId = await ctx.db.insert("groups", {
          name: args.data.groupName,
          members: participantsIds,
          transactions: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        args.data.groupId = groupId;
      }

      let transactionId: Id<"transactions">;

      // Create transaction for different split types
      if (args.data.splitType === "EQUAL") {
        transactionId = await ctx.db.insert("transactions", {
          name: args.data.name,
          groupId: args.data.groupId,
          participants: participantsIds,
          amount: args.data.amount,
          splitType: args.data.splitType,
          payerId,
          date: Date.now(),
        });

        for (const participantId of participantsIds) {
          await ctx.db.insert("transactionShares", {
            transactionId,
            userId: participantId,
            status: participantId === payerId ? "PAID" : "PENDING",
            amount: args.data.amount / participantsIds.length,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }

      if (args.data.splitType === "PERCENTAGE") {
        transactionId = await ctx.db.insert("transactions", {
          name: args.data.name,
          groupId: args.data.groupId,
          participants: participantsIds,
          amount: args.data.amount,
          splitType: args.data.splitType,
          date: Date.now(),
          percentages,
          payerId,
        });

        for (const participantId of participantsIds) {
          const share = percentages.find((p) => p.userId === participantId);

          if (share === undefined) {
            continue;
          }

          await ctx.db.insert("transactionShares", {
            transactionId,
            userId: participantId,
            status: share.userId === payerId ? "PAID" : "PENDING",
            amount: (share.percentage / 100) * args.data.amount,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }

      if (args.data.splitType === "FIXED") {
        transactionId = await ctx.db.insert("transactions", {
          name: args.data.name,
          groupId: args.data.groupId,
          participants: participantsIds,
          amount: args.data.amount,
          splitType: args.data.splitType,
          date: Date.now(),
          fixedAmounts,
          payerId,
        });

        for (const participantId of participantsIds) {
          const share = fixedAmounts.find((p) => p.userId === participantId);

          if (share === undefined) {
            continue;
          }

          await ctx.db.insert("transactionShares", {
            transactionId,
            userId: participantId,
            status: share.userId === payerId ? "PAID" : "PENDING",
            amount: share.amount,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }

      if (args.data.splitType === "SHARED") {
        transactionId = await ctx.db.insert("transactions", {
          name: args.data.name,
          groupId: args.data.groupId,
          participants: participantsIds,
          amount: args.data.amount,
          splitType: args.data.splitType,
          date: Date.now(),
          items: args.data.items.map((item) => ({
            ...item,
            participantIds: item.participantIds.map((id) => id as Id<"users">),
          })),
          sharedAmounts,
          payerId,
        });

        for (const participantId of participantsIds) {
          const share = sharedAmounts.find((p) => p.userId === participantId);

          if (share === undefined) {
            continue;
          }

          await ctx.db.insert("transactionShares", {
            transactionId,
            userId: participantId,
            status: share.userId === payerId ? "PAID" : "PENDING",
            amount: share.amount,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }

      return {
        ok: true,
        message: "Transaction created successfully.",
      };
    } catch (error) {
      return {
        ok: false,
        message: "Failed to create transaction.",
      };
    }
  },
});

function generateImage() {
  const maxPartCounts = {
    accessory: 18,
    eye: 6,
    face: 8,
    hair: 32,
    mouth: 10,
    outfit: 25,
  };

  const randomAccessory =
    Math.floor(Math.random() * maxPartCounts.accessory) + 1;
  const randomEye = Math.floor(Math.random() * maxPartCounts.eye) + 1;
  const randomFace = Math.floor(Math.random() * maxPartCounts.face) + 1;
  const randomHair = Math.floor(Math.random() * maxPartCounts.hair) + 1;
  const randomMouth = Math.floor(Math.random() * maxPartCounts.mouth) + 1;
  const randomOutfit = Math.floor(Math.random() * maxPartCounts.outfit) + 1;

  const randomAccessoryFormatted = Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(randomAccessory);

  const randomEyeFormatted = Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(randomEye);

  const randomFaceFormatted = Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(randomFace);

  const randomHairFormatted = Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(randomHair);

  const randomMouthFormatted = Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(randomMouth);

  const randomOutfitFormatted = Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(randomOutfit);

  return `https://avartation-api.vercel.app/api?hair=${randomHairFormatted}&bg=rgb(56,%20141,%2061)&eyes=${randomEyeFormatted}&mouth=${randomMouthFormatted}&head=${randomFaceFormatted}&outfit=${randomOutfitFormatted}&accessory=${randomAccessoryFormatted}`;
}
