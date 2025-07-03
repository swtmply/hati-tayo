import { useConvexAuth } from "convex/react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { useIsomorphicLayoutEffect } from "~/app/_layout";

const AppStack = () => {
	const { isLoading, isAuthenticated } = useConvexAuth();

	useIsomorphicLayoutEffect(() => {
		if (!isLoading) {
			SplashScreen.hide();
		}
	}, [isLoading]);

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "ios_from_right",
			}}
		>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="(auth)" />
			</Stack.Protected>

			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="(tabs)" />
				<Stack.Screen
					name="(screens)/create-transaction"
					options={{ presentation: "modal" }}
				/>
				<Stack.Screen name="(screens)/transaction/[transactionId]" />
				<Stack.Screen name="(screens)/group/[groupId]" />
			</Stack.Protected>
		</Stack>
	);
};

export default AppStack;
