import type { FunctionReturnType } from "convex/server";
import type { api } from "./_generated/api";

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
