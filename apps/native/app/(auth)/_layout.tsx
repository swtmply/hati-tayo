import { Stack } from "expo-router";

export default function AuthLayout() {
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
