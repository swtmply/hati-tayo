import type { Transaction } from "@hati-tayo/backend/convex/types";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { cn } from "~/lib/utils";
import CurrencyFormat from "./currency-format";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ChevronRight } from "./ui/icons";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./ui/text";

interface TransactionCardProps {
	transaction: Transaction;
	inGroupView?: boolean;
}

const TransactionCard = ({
	transaction,
	inGroupView,
}: TransactionCardProps) => {
	return (
		<TouchableOpacity
			onPress={() => {
				router.push(`/transaction/${transaction._id}`);
			}}
			className={cn(
				"flex-row justify-between rounded-xl border border-sidebar-border bg-sidebar p-4",
			)}
		>
			<View className={cn(inGroupView ? "gap-4" : "gap-1.5")}>
				<View className="flex-col">
					{!inGroupView && (
						<Text className="font-geist-bold text-muted-foreground tracking-tighter">
							{transaction.group?.name}
						</Text>
					)}
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						className="-mt-1 font-geist-bold text-xl tracking-tighter"
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
			<View className="flex-col justify-between">
				<ChevronRight className="self-end text-muted-foreground" />
				<View className="items-end">
					<Text className="-mb-1 font-sans">
						{transaction.share?.status === "PENDING"
							? `You owe ${transaction.payer.name}`
							: "You are owed"}
					</Text>
					<CurrencyFormat
						amount={transaction.share?.amount ?? 0}
						className={cn(
							"font-geist-bold text-2xl tracking-tighter",
							transaction.share?.status === "PENDING"
								? "text-destructive"
								: "text-primary",
						)}
					/>
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
