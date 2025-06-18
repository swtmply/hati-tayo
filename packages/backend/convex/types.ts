import type { FunctionReturnType } from "convex/server";
import type { api } from "./_generated/api";

type ArrayElementType<T> = T extends readonly (infer E)[] ? E : never;

export type TransactionOfCurrentUser = FunctionReturnType<
	typeof api.transactions.transactionsOfCurrentUser
>;

export type Transaction = ArrayElementType<TransactionOfCurrentUser>;
