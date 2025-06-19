import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Container } from "~/components/container";
import SettleTransactionFormSheet from "~/components/settle-transaction-form-sheet";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/components/ui/icons";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const TransactionDetails = () => {
	const { transactionId } = useLocalSearchParams();
	const transaction = useQuery(api.transactions.getTransactionDetailsById, {
		id: transactionId as Id<"transactions">,
	});
	const user = useQuery(api.auth.get);

	const [openIndex, setOpenIndex] = React.useState(-1);

	if (transaction === undefined) {
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

				<View className="items-center justify-center gap-2">
					<Skeleton className="h-24 w-24 rounded-full" />
				</View>

				<View className="mb-4 flex-row items-center justify-around">
					<View className="flex-col items-center gap-2">
						<Skeleton className="h-8 w-32" />
						<Skeleton className="h-10 w-48" />
					</View>
					<View className="flex-col items-center gap-2">
						<Skeleton className="h-8 w-32" />
						<Skeleton className="h-10 w-48" />
					</View>
				</View>

				<Text className="font-semibold text-xl">Members</Text>

				<View>
					{[1, 2, 3, 4, 5].map((_) => (
						<View
							key={_}
							className="flex-row items-center justify-between gap-2"
						>
							<View className="flex-row items-center gap-2">
								<Skeleton className="aspect-square h-14 rounded-full" />
								<Skeleton className="h-8 w-32" />
							</View>
							<Skeleton className="h-8 w-32" />
						</View>
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
				<Text className="font-semibold text-xl">
					{transaction.group?.name} - {transaction.name}
				</Text>
				<ChevronLeft className="invisible" />
			</View>

			<View className="items-center justify-center gap-2">
				<Image
					style={{
						aspectRatio: 1,
						width: 100,
						height: 100,
						borderRadius: 100,
					}}
					source={transaction.payer.image}
					placeholder={{ blurhash }}
					transition={1000}
				/>
			</View>

			{/* MARK: Transaction Summary
			 */}
			<View className="mb-4 flex-row items-center justify-around">
				<View className="flex-col items-center">
					<Text className="font-sans text-lg">
						{transaction.payer.name} paid
					</Text>

					<Text className="font-geist-extrabold text-4xl text-primary tracking-tighter">
						{Intl.NumberFormat("en-PH", {
							style: "currency",
							currency: "PHP",
						}).format(transaction.amount ?? 0)}
					</Text>
				</View>
				<View className="flex-col items-center">
					<Text className="font-sans text-lg">You owe</Text>

					<Text className="font-geist-extrabold text-4xl text-red-400 tracking-tighter">
						{Intl.NumberFormat("en-PH", {
							style: "currency",
							currency: "PHP",
						}).format(transaction.totalOwed)}
					</Text>
				</View>
			</View>

			<View>
				<Text className="font-semibold text-xl">Members</Text>
			</View>

			<View className="flex-col gap-2">
				{transaction.participants.map((participant) => (
					<View key={participant._id} className="flex-row items-center gap-2">
						<Avatar alt={participant.name} className="h-14 w-14">
							<AvatarImage
								source={{
									uri: participant.image,
								}}
							/>
						</Avatar>

						<View className="flex-1 flex-row items-center justify-between">
							<Text className="font-semibold text-lg">{participant.name}</Text>
							<Text className="font-sans">
								{participant.share?.status === "PAID" ? "Paid " : "Owed "}
								<Text
									className={cn(
										"font-geist-extrabold",
										participant.share?.status === "PAID"
											? "text-primary"
											: "text-red-400",
									)}
								>
									{Intl.NumberFormat("en-PH", {
										style: "currency",
										currency: "PHP",
									}).format(participant.share?.amount ?? 0)}
								</Text>
							</Text>
						</View>
					</View>
				))}
			</View>

			{transaction.payer._id === user?._id && !transaction.isSettled && (
				<Button
					onPress={() => {
						setOpenIndex(0);
					}}
				>
					<Text>Settle Debts</Text>
				</Button>
			)}

			<SettleTransactionFormSheet
				index={openIndex}
				members={transaction.participants.filter(
					(participant) => participant._id !== transaction.payer._id,
				)}
				onClose={() => {
					setOpenIndex(-1);
				}}
				onSubmit={(users) => {
					console.log(users);
				}}
			/>
		</Container>
	);
};

export default TransactionDetails;
