import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import axios from "~/lib/axios";
import { Image, ImageBackground, View } from "react-native";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const LoginPage = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/", { scheme: "hati-tayo" }),
      });

      if (signUp && signUp.createdUserId) {
        await axios.post("/api/auth/create-user", {
          clerk_id: signUp?.createdUserId,
          email: signUp?.emailAddress,
          name: `${signUp?.firstName} ${signUp?.lastName}`,
        });
      }

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <SafeAreaView edges={["bottom"]}>
      <View className="h-screen-safe-offset-1 -mt-32 mb-20">
        <ImageBackground
          source={require("~/assets/images/login-bg.png")}
          className="flex-1"
          resizeMode="stretch"
        />
        <View className="absolute left-1/2 transform -translate-x-1/2 h-4/5 mt-32 justify-evenly items-center gap-4">
          <Image
            source={require("~/assets/images/logo.png")}
            className="w-48 h-48"
          />
          <View>
            <Text className="text-green-100 font-black text-9xl">Hati</Text>
            <Text className="text-green-100 font-black text-9xl -mt-6">
              Tayo
            </Text>
          </View>
        </View>
      </View>
      <View className="items-center">
        <Button size={"lg"} onPress={onPress} className="w-4/5 flex-row gap-4">
          <Image
            source={require("~/assets/images/google-logo.png")}
            className="w-8 h-8"
          />
          <Text>Sign In Google</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
