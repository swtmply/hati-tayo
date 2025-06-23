import type { Group } from "@hati-tayo/backend/convex/types";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { cn } from "~/lib/utils";
import CurrencyFormat from "./currency-format";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./ui/text";

interface GroupCardProps {
	group: Group;
}

const GroupCard = ({ group }: GroupCardProps) => {
	return (
		<TouchableOpacity
			onPress={() => {
				router.push(`/group/${group._id}`);
			}}
			className="flex-row justify-between rounded-lg border border-border bg-card p-4"
		>
			<View className="gap-4">
				<Text className="font-geist-semibold text-xl tracking-tighter">
					{group.name}
				</Text>
				<View className="-ml-2 flex-row items-center gap-2">
					{group.members.map((member, index) => (
						<Avatar
							key={member._id}
							alt={member.name}
							className={cn(
								"-ml-6 h-12 w-12 rounded-full",
								index === 0 ? "ml-0" : "",
							)}
						>
							<AvatarImage source={{ uri: member.image }} />
						</Avatar>
					))}
				</View>
			</View>
			<View className="justify-end">
				<CurrencyFormat
					amount={group.totalOwed}
					className={cn(
						"text-right font-geist-semibold text-xl tracking-tighter",
						group.totalOwed > 0 ? "text-red-400" : "text-primary",
					)}
				/>
				<Text className="text-muted-foreground text-sm">
					{group.transactionCount} transactions
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export const GroupCardSkeleton = () => {
	return (
		<View className="flex-row justify-between rounded-lg border bg-background p-4">
			<View className="gap-4">
				<Skeleton className="h-8 w-32" />
				<View className="flex-row items-center gap-2">
					<Skeleton className="aspect-square h-12 rounded-full" />
					<Skeleton className="-ml-6 aspect-square h-12 rounded-full" />
					<Skeleton className="-ml-6 aspect-square h-12 rounded-full" />
				</View>
			</View>
			<View className="justify-end">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-6 w-32" />
			</View>
		</View>
	);
};

export default GroupCard;
