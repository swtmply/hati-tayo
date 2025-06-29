import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import type { Transaction } from "@hati-tayo/backend/convex/types";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { Container } from "~/components/container";
import CurrencyFormat from "~/components/currency-format";
import TransactionCard, {
	TransactionCardSkeleton,
} from "~/components/transaction-card";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { ChevronLeft } from "~/components/ui/icons";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";

const GroupDetails = () => {
	const { groupId } = useLocalSearchParams();
	const group = useQuery(api.groups.getGroupDetailsById, {
		id: groupId as Id<"groups">,
	});

	const user = useQuery(api.users.get);

	const userOwed = group?.participants.reduce((total, participant) => {
		if (participant.shares?.some((share) => share.userId === user?._id)) {
			return (
				total +
				participant.shares.reduce((total, share) => {
					if (share.status === "PAID") {
						return total;
					}
					return total + share.amount;
				}, 0)
			);
		}
		return total;
	}, 0);

	const debtToUser = group?.participants.reduce((total, participant) => {
		const sharesToUser = participant.shares?.filter((share) =>
			group.userPaidTransactions.find(
				(transaction) => transaction._id === share.transactionId,
			),
		);

		let totalDebt = total;

		for (const share of sharesToUser) {
			if (share.status === "PAID") {
				continue;
			}
			totalDebt += share.amount;
		}

		return totalDebt;
	}, 0);

	if (group === undefined || group === null) {
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
			<View className="flex-row items-center justify-between pb-4">
				<TouchableOpacity
					onPress={() => {
						router.back();
					}}
				>
					<ChevronLeft className="text-primary" />
				</TouchableOpacity>
				<Text className="font-geist-bold text-2xl tracking-tighter">
					{group?.name}
				</Text>
				<ChevronLeft className="invisible" />
			</View>

			<ScrollView>
				<View className="flex-row items-center justify-around">
					<View className="flex-col items-center justify-center">
						<Text className="font-geist-semibold text-lg">You owe</Text>
						<CurrencyFormat
							amount={userOwed ?? 0}
							className="font-geist-bold text-4xl text-destructive"
						/>
					</View>

					<View className="flex-col items-center justify-center">
						<Text className="font-geist-semibold text-lg">You are owed</Text>
						<CurrencyFormat
							amount={debtToUser ?? 0}
							className="font-geist-bold text-4xl text-primary"
						/>
					</View>
				</View>
				<Text className="my-4 font-geist-bold tracking-tighter">Members</Text>

				{group.participants.map((member) => {
					const owed = member.shares.reduce((total, share) => {
						if (share.status === "PAID") {
							return total;
						}
						return total + share.amount;
					}, 0);

					const debtToUser = member.shares
						.filter((share) =>
							group.userPaidTransactions.find(
								(transaction) => transaction._id === share.transactionId,
							),
						)
						.reduce((total, share) => {
							if (share.status === "PAID") {
								return total;
							}
							return total + share.amount;
						}, 0);

					return (
						<View
							key={member._id}
							className="mb-2 flex-row items-center justify-between"
						>
							<View className="flex-row items-center gap-2">
								<Avatar alt={member.name}>
									<AvatarImage source={{ uri: member.image }} />
								</Avatar>
								<Text className="font-geist-semibold">{member.name}</Text>
							</View>
							<View>
								{owed === 0 ? (
									<Text className="text-muted-foreground">No debt</Text>
								) : (
									<View className="flex-row items-center justify-end gap-1">
										<Text>Owes</Text>
										<CurrencyFormat
											amount={owed}
											className="font-geist-bold text-destructive"
										/>
									</View>
								)}
								{debtToUser === 0 ? null : (
									<View className="flex-row items-center justify-end gap-1">
										<Text>Owes you</Text>
										<CurrencyFormat
											amount={debtToUser}
											className="font-geist-bold text-primary"
										/>
									</View>
								)}
							</View>
						</View>
					);
				})}

				<Text className="my-4 font-geist-bold tracking-tighter">
					Recent Transactions
				</Text>

				{group.transactions.map((transaction) => (
					<Pressable
						onPress={() => {
							router.push(`/transaction/${transaction._id}`);
						}}
						key={transaction._id}
						className="mb-4"
					>
						<TransactionCard
							transaction={transaction as Transaction}
							inGroupView
						/>
					</Pressable>
				))}
			</ScrollView>
		</Container>
	);
};

export default GroupDetails;
