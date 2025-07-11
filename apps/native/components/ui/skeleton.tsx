import type * as React from "react";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useIsomorphicLayoutEffect } from "~/app/_layout";
import { cn } from "~/lib/utils";

const duration = 1000;

function Skeleton({
	className,
	...props
}: Omit<React.ComponentPropsWithoutRef<typeof Animated.View>, "style">) {
	const sv = useSharedValue(1);

	useIsomorphicLayoutEffect(() => {
		sv.value = withRepeat(
			withSequence(withTiming(0.5, { duration }), withTiming(1, { duration })),
			-1,
		);
	}, []);

	const style = useAnimatedStyle(() => ({
		opacity: sv.value,
	}));

	return (
		<Animated.View
			style={style}
			className={cn("rounded-md bg-secondary dark:bg-muted", className)}
			{...props}
		/>
	);
}

export { Skeleton };
