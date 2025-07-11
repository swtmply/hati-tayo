import type { Transaction } from "@hati-tayo/backend/convex/types";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import Animated, {
	ReduceMotion,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useIsomorphicLayoutEffect } from "~/app/_layout";
import CurrencyFormat from "./currency-format";
import { Text } from "./ui/text";

interface BubbleLayoutProps {
	solo?: boolean;
	duo?: boolean;
	transactions: Transaction[] | undefined;
}

export const BubbleLayout = React.memo(
	({ solo, duo, transactions }: BubbleLayoutProps) => {
		const firstTransaction = transactions?.[0];
		const secondTransaction = transactions?.[1];
		const thirdTransaction = transactions?.[2];

		return (
			<View className="relative h-72 w-full">
				<FirstBubble solo={solo} duo={duo} transaction={firstTransaction} />
				<SecondBubble duo={duo} transaction={secondTransaction} />
				<ThirdBubble transaction={thirdTransaction} />
			</View>
		);
	},
);
BubbleLayout.displayName = "BubbleLayout";

interface FirstBubbleProps {
	solo?: boolean;
	duo?: boolean;
	transaction: Transaction | undefined;
}

export const FirstBubble = React.memo(
	({ solo, duo, transaction }: FirstBubbleProps) => {
		const scale = useSharedValue(0.5);
		const position = useSharedValue({ x: 0, y: 0 });

		const size = solo ? 1.5 : duo ? 1.1 : 1;
		const dimensions = {
			x: solo ? 40 : duo ? 10 : 20,
			y: solo ? 10 : duo ? 10 : 20,
		};

		const animate = () => {
			scale.value = withTiming(size, { duration: 1000 });
			position.value = withRepeat(
				withSequence(
					withTiming({ x: dimensions.x, y: dimensions.y }, { duration: 800 }),
					withTiming(
						{ x: dimensions.x + 2, y: dimensions.y },
						{ duration: 800 },
					),
					withTiming(
						{ x: dimensions.x, y: dimensions.y + 2 },
						{ duration: 800 },
					),
				),
				-1,
				true,
				() => {},
				ReduceMotion.System,
			);
		};

		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [
					{ scale: scale.value },
					{ translateX: position.value.x },
					{ translateY: position.value.y },
				],
				left: position.value.x,
				top: position.value.y,
			};
		});

		useIsomorphicLayoutEffect(() => {
			animate();
		}, []);

		if (!transaction) {
			return null;
		}

		return (
			<Animated.View
				style={animatedStyle}
				className="absolute top-12 left-12 aspect-square w-44 items-center justify-center gap-0.5 rounded-full bg-accent"
			>
				{transaction.payer ? (
					<Image
						source={{
							uri: transaction.payer?.image,
						}}
						style={{
							height: 48,
							width: 48,
							borderRadius: 50,
						}}
					/>
				) : (
					<Text className="text-5xl">✨</Text>
				)}
				<Text className="-mb-1 text-muted-foreground text-xs">
					{transaction.name}
				</Text>
				<CurrencyFormat
					amount={transaction.amount ?? 0}
					className="font-geist-medium text-lg"
				/>
			</Animated.View>
		);
	},
);
FirstBubble.displayName = "FirstBubble";

interface SecondBubbleProps {
	duo?: boolean;
	transaction: Transaction | undefined;
}

const SecondBubble = React.memo(({ duo, transaction }: SecondBubbleProps) => {
	const scale = useSharedValue(0);
	const position = useSharedValue({ x: 70, y: 0 });

	const size = duo ? 1.2 : 1;
	const dimensions = {
		x: duo ? 90 : 100,
		y: duo ? 10 : 10,
	};

	const animate = () => {
		scale.value = withTiming(size, { duration: 1000 });
		position.value = withRepeat(
			withSequence(
				withTiming({ x: dimensions.x, y: dimensions.y }, { duration: 800 }),
				withTiming({ x: dimensions.x + 2, y: dimensions.y }, { duration: 800 }),
				withTiming({ x: dimensions.x, y: dimensions.y + 2 }, { duration: 800 }),
			),
			-1,
			true,
			() => {},
			ReduceMotion.System,
		);
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ scale: scale.value },
				{ translateX: position.value.x },
				{ translateY: position.value.y },
			],
			left: position.value.x,
			top: position.value.y,
		};
	});

	useIsomorphicLayoutEffect(() => {
		animate();
	}, []);

	if (!transaction) {
		return null;
	}

	return (
		<Animated.View
			style={animatedStyle}
			className="absolute top-4 right-12 aspect-square w-32 items-center justify-center rounded-full bg-accent"
		>
			{transaction.payer ? (
				<Image
					source={{
						uri: transaction.payer?.image,
					}}
					style={{
						height: 48,
						width: 48,
						borderRadius: 50,
					}}
				/>
			) : (
				<Text className="text-5xl">✨</Text>
			)}

			<Text className="-mb-1 text-muted-foreground text-xs">
				{transaction.name}
			</Text>
			<CurrencyFormat
				amount={transaction.amount ?? 0}
				className="font-geist-medium text-lg"
			/>
		</Animated.View>
	);
});
SecondBubble.displayName = "SecondBubble";

const ThirdBubble = React.memo(
	({ transaction }: { transaction: Transaction | undefined }) => {
		const scale = useSharedValue(0);
		const position = useSharedValue({ x: 90, y: 0 });

		const animate = () => {
			scale.value = withTiming(1, { duration: 1000 });
			position.value = withRepeat(
				withSequence(
					withTiming({ x: 95, y: 70 }, { duration: 800 }),
					withTiming({ x: 95, y: 72 }, { duration: 800 }),
					withTiming({ x: 97, y: 70 }, { duration: 800 }),
				),
				-1,
				true,
				() => {},
				ReduceMotion.System,
			);
		};

		const animatedStyle = useAnimatedStyle(() => {
			return {
				transform: [
					{ scale: scale.value },
					{ translateX: position.value.x },
					{ translateY: position.value.y },
				],
				left: position.value.x,
				top: position.value.y,
			};
		});

		useIsomorphicLayoutEffect(() => {
			animate();
		}, []);

		if (!transaction) {
			return null;
		}

		return (
			<Animated.View
				style={animatedStyle}
				className="absolute h-full max-h-28 w-28 items-center justify-center rounded-full bg-accent"
			>
				{transaction.payer ? (
					<Image
						source={{
							uri: transaction.payer?.image,
						}}
						style={{
							height: 48,
							width: 48,
							borderRadius: 50,
						}}
					/>
				) : (
					<Text className="text-5xl">✨</Text>
				)}
				<Text className="-mb-1 text-muted-foreground text-xs">
					{transaction.name}
				</Text>
				<CurrencyFormat
					amount={transaction.amount ?? 0}
					className="font-geist-medium text-sm"
				/>
			</Animated.View>
		);
	},
);
ThirdBubble.displayName = "ThirdBubble";
