import type { FunctionReturnType } from "convex/server";
import type { Infer } from "convex/values";
import type { api } from "./_generated/api";
import type {
	equalSplitValidator,
	fixedSplitValidator,
	percentageSplitValidator,
	sharedSplitValidator,
} from "./schema";

type ArrayElementType<T> = T extends readonly (infer E)[] ? E : never;

export type TransactionsOfCurrentUser = FunctionReturnType<
	typeof api.transactions.transactionsOfCurrentUser
>;
export type Transaction = ArrayElementType<TransactionsOfCurrentUser>;
export type TransactionShare = FunctionReturnType<
	typeof api.transactions.getTransactionDetailsById
>;
export type TransactionShareMembers = Transaction["participants"];

export type GroupsOfCurrentUser = FunctionReturnType<
	typeof api.groups.groupsOfCurrentUser
>;
export type Group = ArrayElementType<GroupsOfCurrentUser>;

export type GroupMembers = Group["members"];

export interface EqualTransactionShare
	extends Omit<Infer<typeof equalSplitValidator>, "participants"> {
	participants: TransactionShareMembers;
}
export interface PercentageTransactionShare
	extends Omit<Infer<typeof percentageSplitValidator>, "participants"> {
	participants: TransactionShareMembers;
}

export interface FixedTransactionShare
	extends Omit<Infer<typeof fixedSplitValidator>, "participants"> {
	participants: TransactionShareMembers;
}
export interface SharedTransactionShare
	extends Omit<Infer<typeof sharedSplitValidator>, "participants"> {
	participants: TransactionShareMembers;
}

export type CreateTransactionResponse = FunctionReturnType<
	typeof api.transactions.createTransaction
>;
