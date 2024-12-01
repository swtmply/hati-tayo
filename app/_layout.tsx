import "./global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { PortalHost } from "@rn-primitives/portal";

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: {
      fontFamily: "Inter_400Regular",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "Inter_500Medium",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "Inter_600SemiBold",
      fontWeight: "600",
    },
    heavy: {
      fontFamily: "Inter_700Bold",
      fontWeight: "700",
    },
  },
};

const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    regular: {
      fontFamily: "Inter_400Regular",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "Inter_500Medium",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "Inter_600SemiBold",
      fontWeight: "600",
    },
    heavy: {
      fontFamily: "Inter_700Bold",
      fontWeight: "700",
    },
  },
};

export interface TokenCache {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken?: (key: string) => void;
}

const queryClient = new QueryClient();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      if (fontsLoaded) SplashScreen.hideAsync();
    });
  }, [fontsLoaded]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider
            publishableKey={publishableKey}
            tokenCache={tokenCache}
          >
            <ClerkLoaded>
              <ThemeProvider
                value={LIGHT_THEME}
                //  value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
              >
                <StatusBar
                  style="dark"
                  // style={isDarkColorScheme ? "light" : "dark"}
                />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(forms)/group-form" />
                  <Stack.Screen name="(forms)/hatian-form" />
                  <Stack.Screen name="(forms)/transaction-form" />
                  <Stack.Screen name="(forms)/qr-code-form" />
                  <Stack.Screen
                    name="(details)/groups/[groupId]"
                    options={{
                      presentation: "modal",
                    }}
                  />
                  <Stack.Screen
                    name="(details)/hatians/[hatianId]"
                    options={{
                      presentation: "modal",
                    }}
                  />
                </Stack>
              </ThemeProvider>
              <PortalHost />
            </ClerkLoaded>
          </ClerkProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </>
  );
}
