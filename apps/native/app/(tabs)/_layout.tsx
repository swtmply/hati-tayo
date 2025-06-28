import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "convex/react";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { Home, User2, Users2 } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import { useColorScheme } from "~/lib/use-color-scheme";

export default function TabLayout() {
	const isSignedIn = useQuery(api.auth.isAuthenticated);
	const { colorScheme } = useColorScheme();

	if (!isSignedIn) {
		return <Redirect href={"/(auth)/sign-in"} />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colorScheme === "dark" ? "#4caf50" : "#2e7d32",
				tabBarInactiveTintColor: colorScheme === "dark" ? "#3e4a3d" : undefined,
				tabBarStyle: {
					position: "absolute",
					backgroundColor: "transparent",
					borderTopWidth: 1,
					elevation: 0, // for Android
					shadowOpacity: 0, // for iOS
					height: 90,
				},
				tabBarItemStyle: {
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				},
				tabBarLabelStyle: {
					fontFamily: "Geist_600SemiBold",
				},
				tabBarBackground: () => (
					<BlurView
						intensity={40}
						tint={
							colorScheme === "dark"
								? "systemChromeMaterialDark"
								: "systemChromeMaterialLight"
						}
						style={[StyleSheet.absoluteFill]}
						experimentalBlurMethod="dimezisBlurView"
					/>
				),
				tabBarButton: (props: BottomTabBarButtonProps) => {
					// biome-ignore lint/suspicious/noExplicitAny: This is a necessary workaround for a ref type incompatibility between React Navigation and Pressable.
					return <Pressable {...(props as any)} android_ripple={null} />;
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <Home color={color} />,
				}}
			/>
			<Tabs.Screen
				name="groups"
				options={{
					title: "Groups",
					tabBarIcon: ({ color }) => <Users2 color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => <User2 color={color} />,
				}}
			/>
		</Tabs>
	);
}
