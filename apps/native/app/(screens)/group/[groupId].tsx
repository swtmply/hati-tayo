import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Container } from "~/components/container";
import TransactionCard, {
	TransactionCardSkeleton,
} from "~/components/transaction-card";
import { ChevronLeft } from "~/components/ui/icons";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";

const GroupDetails = () => {
	const { groupId } = useLocalSearchParams();
	const group = useQuery(api.groups.getGroupDetailsById, {
		id: groupId as Id<"groups">,
	});

	if (group === undefined) {
		return (
			<Container>
				<View className="flex-row items-center justify-between pt-12 pb-4">
					<TouchableOpacity
						onPress={() => {
							router.back();
						}}
					>
						<ChevronLeft className="text-primary" />
					</TouchableOpacity>
					<Skeleton className="h-10 w-32" />
					<ChevronLeft className="invisible" />
				</View>

				<Text className="font-geist-semibold text-xl">Transactions</Text>

				<View className="gap-2">
					{[1, 2, 3, 4, 5].map((_) => (
						<TransactionCardSkeleton key={_} />
					))}
				</View>
			</Container>
		);
	}

	return (
		<Container>
			<View className="flex-row items-center justify-between pt-12 pb-4">
				<TouchableOpacity
					onPress={() => {
						router.back();
					}}
				>
					<ChevronLeft className="text-primary" />
				</TouchableOpacity>
				<Text className="font-geist-semibold text-xl">{group?.name}</Text>
				<ChevronLeft className="invisible" />
			</View>

			<Text className="font-geist-semibold text-xl">Transactions</Text>

			<View className="gap-2">
				{group.transactions.map((transaction) => (
					<Pressable
						onPress={() => {
							router.push(`/transaction/${transaction._id}`);
						}}
						key={transaction._id}
					>
						<TransactionCard transaction={transaction} />
					</Pressable>
				))}
			</View>
		</Container>
	);
};

export default GroupDetails;
