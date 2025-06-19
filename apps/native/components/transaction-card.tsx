import type { Transaction } from "@hati-tayo/backend/convex/types";
import { formatDistanceToNow } from "date-fns";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { cn } from "~/lib/utils";
import CurrencyFormat from "./currency-format";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./ui/text";

interface TransactionCardProps {
	transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
	return (
		<TouchableOpacity
			onPress={() => {
				router.push(`/transaction/${transaction._id}`);
			}}
			className={cn(
				"flex-row justify-between rounded-lg border bg-background p-4",
				transaction.isSettled ? "border-primary" : "border-red-400",
			)}
		>
			<View className="gap-4">
				<View className="flex-row items-center gap-2">
					<Text className="aspect-square items-center justify-center rounded-full bg-emerald-200 p-2">
						✨
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						className="max-w-40 font-geist-semibold text-xl tracking-tighter"
					>
						{transaction.name}
					</Text>
				</View>

				<View className="flex-row items-center gap-2">
					{transaction.participants.map((member, index) => (
						<Avatar
							alt={member.name}
							key={member._id}
							className={cn(
								"-ml-6 h-12 w-12 rounded-full",
								transaction.payerId === member._id
									? "border-2 border-primary"
									: "",
								index === 0 ? "ml-0" : "",
							)}
						>
							<AvatarImage source={{ uri: member.image }} />
						</Avatar>
					))}
				</View>
			</View>
			<View className="flex-col items-end justify-between">
				<View>
					<View className="flex-row items-center justify-end gap-1">
						<Text>{transaction.payer.name} paid</Text>

						<CurrencyFormat
							amount={transaction.amount}
							className="font-geist-bold text-lg tracking-tighter"
						/>
					</View>
					<View className="flex-row items-center justify-end gap-1">
						<Text>
							{transaction.share?.status === "PENDING" ? "You owe" : "You paid"}
						</Text>
						<CurrencyFormat
							amount={transaction.share?.amount ?? 0}
							className={cn(
								"font-geist-bold text-lg tracking-tighter",
								transaction.share?.status === "PENDING"
									? "text-red-400"
									: "text-primary",
							)}
						/>
					</View>
				</View>
				<View>
					<Text className="text-muted-foreground text-sm">
						{formatDistanceToNow(transaction.createdAt, { addSuffix: true })}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export const TransactionCardSkeleton = () => {
	return (
		<View className="flex-row justify-between rounded-lg border bg-background p-4">
			<View className="gap-4">
				<View className="flex-row items-center gap-2">
					<Skeleton className="h-8 w-32" />
				</View>

				<View className="flex-row items-center gap-2">
					<Skeleton className="aspect-square h-12 rounded-full" />
					<Skeleton className="-ml-6 aspect-square h-12 rounded-full" />
					<Skeleton className="-ml-6 aspect-square h-12 rounded-full" />
				</View>
			</View>
			<View className="flex-col items-end justify-between">
				<View className="gap-2">
					<View className="flex-row items-center justify-end gap-1">
						<Skeleton className="h-6 w-32" />
					</View>
					<View className="flex-row items-center justify-end gap-1">
						<Skeleton className="h-6 w-32" />
					</View>
				</View>
				<View>
					<Skeleton className="h-6 w-32" />
				</View>
			</View>
		</View>
	);
};

export default TransactionCard;
