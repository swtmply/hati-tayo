import { useAuth } from "@clerk/clerk-expo";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { Home, Users2 } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

export default function TabLayout() {
	const { isSignedIn } = useAuth();

	if (!isSignedIn) {
		return <Redirect href={"/(auth)/sign-in"} />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#10b981",
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
						tint="systemChromeMaterial"
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
		</Tabs>
	);
}
