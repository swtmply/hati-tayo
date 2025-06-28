import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
	const isSignedIn = useQuery(api.auth.isAuthenticated);

	if (isSignedIn) {
		return <Redirect href={"/(tabs)"} />;
	}

	return (
		<Stack
			initialRouteName="sign-in"
			screenOptions={{ headerShown: false, animation: "ios_from_right" }}
		>
			<Stack.Screen name="sign-in" />
			<Stack.Screen name="sign-up" />
		</Stack>
	);
}
