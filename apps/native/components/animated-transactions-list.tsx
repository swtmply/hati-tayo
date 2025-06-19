import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Transaction } from "@hati-tayo/backend/convex/types";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { BubbleLayout } from "./bubble-layout";
import CurrencyFormat from "./currency-format";
import TransactionCard from "./transaction-card";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

const HEADER_HEIGHT = 345;

const AnimatedTransactionList = () => {
	const scrollY = useSharedValue(0);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollY.value = event.contentOffset.y;
		},
	});

	const headerAnimatedStyle = useAnimatedStyle(() => {
		// We want the image to move up slower than the scroll
		const translateY = interpolate(
			scrollY.value,
			[-HEADER_HEIGHT, 0, HEADER_HEIGHT], // Input scroll values
			[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75], // Output translateY values (adjust as needed)
			Extrapolation.CLAMP, // Clamp the values to prevent overshooting
		);

		// Optional: Scale the image slightly as you scroll down for a subtle effect
		const scale = interpolate(
			scrollY.value,
			[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
			[2, 1, 1],
			Extrapolation.CLAMP,
		);

		return {
			transform: [{ translateY }, { scale }],
		};
	});

	const transactions = useQuery(api.transactions.transactionsOfCurrentUser);
	const shares = useQuery(api.transaction_shares.getTransactionSummary);

	return (
		<Animated.FlatList
			data={transactions}
			renderItem={({ item }) => {
				return (
					<Pressable
						onPress={() => {
							// router.push(`/transaction/${item._id}`);
						}}
					>
						<TransactionCard transaction={item} />
					</Pressable>
				);
			}}
			keyExtractor={(item: Transaction) => item._id}
			ItemSeparatorComponent={() => (
				<Pressable>
					<View className="h-2 bg-background" />
				</Pressable>
			)}
			ListHeaderComponent={() => {
				if (transactions?.length === 0) {
					return null;
				}

				return (
					<Pressable>
						<Animated.View
							className={cn("mb-4", transactions?.length === 1 ? "pt-8" : "")}
							style={headerAnimatedStyle}
						>
							<BubbleLayout
								solo={transactions?.length === 1}
								duo={transactions?.length === 2}
								transactions={transactions}
							/>

							{/* MARK: Transaction Summary
							 */}
							<View className="mb-4 flex-row items-center justify-around">
								{shares && shares?.totalOwed > 0 && (
									<View className="flex-col items-center">
										<Text className="font-sans text-lg">You owe</Text>

										<CurrencyFormat
											amount={shares?.totalOwed ?? 0}
											className="font-geist-bold text-4xl text-red-400 tracking-tighter"
										/>
									</View>
								)}
								{shares && shares?.totalPaid > 0 && (
									<View className="flex-col items-center">
										<Text className="font-sans text-lg">You are owed</Text>

										<CurrencyFormat
											amount={shares?.totalPaid ?? 0}
											className="font-geist-bold text-4xl text-primary tracking-tighter"
										/>
									</View>
								)}
							</View>

							<Text className="font-geist-semibold">Transactions</Text>
						</Animated.View>
					</Pressable>
				);
			}}
			ListFooterComponent={() => {
				return <View className="h-40" />;
			}}
			ListEmptyComponent={() => {
				return (
					<View className="h-72 items-center justify-center">
						<Text className="font-geist-semibold text-lg">
							No transactions yet.
						</Text>
						<Text className="font-sans text-neutral-500">
							Start creating transactions now.
						</Text>

						<Button
							className="mt-4 w-full flex-row items-center justify-center gap-1 rounded-full p-4"
							onPress={() => {
								router.push("/create-transaction");
							}}
						>
							<Text className="text-white">Create Transaction</Text>
						</Button>
					</View>
				);
			}}
			onScroll={scrollHandler}
			scrollEventThrottle={16}
			showsVerticalScrollIndicator={false}
		/>
	);
};

export default AnimatedTransactionList;
