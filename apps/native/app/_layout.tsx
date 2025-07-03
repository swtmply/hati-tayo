import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { BowlbyOneSC_400Regular } from "@expo-google-fonts/bowlby-one-sc";
import {
	Geist_400Regular,
	Geist_500Medium,
	Geist_600SemiBold,
	Geist_700Bold,
	Geist_800ExtraBold,
	Geist_900Black,
	useFonts,
} from "@expo-google-fonts/geist";
import BottomSheet from "@gorhom/bottom-sheet";
import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { remapProps } from "nativewind";
import React, { useRef } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/use-color-scheme";
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

declare module "@gorhom/bottom-sheet" {
	interface BottomSheetProps {
		className?: string;
		containerClassName?: string;
		backgroundClassName?: string;
		handleClassName?: string;
		handleIndicatorClassName?: string;
	}
}

remapProps(BottomSheet, {
	className: "style",
	containerClassName: "containerStyle",
	backgroundClassName: "backgroundStyle",
	handleClassName: "handleStyle",
	handleIndicatorClassName: "handleIndicatorStyle",
});

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

const secureStorage = {
	getItem: SecureStore.getItemAsync,
	setItem: SecureStore.setItemAsync,
	removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
	const hasMounted = useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	const [fontsLoaded] = useFonts({
		Geist_400Regular,
		Geist_500Medium,
		Geist_600SemiBold,
		Geist_700Bold,
		Geist_800ExtraBold,
		Geist_900Black,
		BowlbyOneSC_400Regular,
	});

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
		SplashScreen.hide();
	}, []);

	if (!isColorSchemeLoaded || !fontsLoaded) {
		return null;
	}

	return (
		<ConvexAuthProvider
			client={convex}
			storage={
				Platform.OS === "android" || Platform.OS === "ios"
					? secureStorage
					: undefined
			}
		>
			<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
				<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
				<GestureHandlerRootView style={{ flex: 1 }}>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "ios_from_right",
						}}
						initialRouteName="(tabs)"
					>
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="(auth)" />
						<Stack.Screen
							name="(screens)/create-transaction"
							options={{ presentation: "modal" }}
						/>
						<Stack.Screen name="(screens)/transaction/[transactionId]" />
					</Stack>
				</GestureHandlerRootView>
				<PortalHost />
			</ThemeProvider>
		</ConvexAuthProvider>
	);
}

export const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;
