import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/use-color-scheme";
import "../global.css";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL ?? "", {
	unsavedChangesWarning: false,
});

export default function RootLayout() {
	const hasMounted = useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}

		if (Platform.OS === "web") {
			document.documentElement.classList.add("bg-background");
		}
		setAndroidNavigationBar(colorScheme);
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
	}
	return (
		<ClerkProvider tokenCache={tokenCache}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
					<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
					<GestureHandlerRootView style={{ flex: 1 }}>
						<Stack
							screenOptions={{
								headerShown: false,
							}}
							initialRouteName="(auth)"
						>
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="(auth)" />
							<Stack.Screen name="(screens)/create-transaction" />
						</Stack>
					</GestureHandlerRootView>
				</ThemeProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}

export const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;
