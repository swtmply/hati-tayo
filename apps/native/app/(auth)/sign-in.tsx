import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { z } from "zod";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";
import { useKeyboard } from "~/hooks/useKeyboard";
import { cn } from "~/lib/utils";
import { useIsomorphicLayoutEffect } from "../_layout";

const SignInPage = () => {
	const { signIn } = useAuthActions();
	const router = useRouter();
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: z.object({
				email: z.string().email({ message: "Invalid email" }),
				password: z.string().min(1, { message: "Password is required" }),
			}),
		},
		onSubmit: async ({ value }) => {
			// Start the sign-in process using the email and password provided
			try {
				await signIn("password", {
					email: value.email,
					password: value.password,
					redirectTo: "/(tabs)",
					flow: "signIn",
				});
			} catch (error) {
				console.error(error);

				if (error instanceof ConvexError && error.data === "INVALID_PASSWORD") {
					form.setErrorMap({
						onChange: {
							fields: {
								password: {
									message: "Invalid password",
								},
							},
						},
					});
				}
			}
		},
	});

	const [assets, error] = useAssets([
		require("~/assets/start-icon-light.png"),
		require("~/assets/start-icon-dark.png"),
	]);

	const { dismissKeyboard, keyboardHeight, isKeyboardVisible } = useKeyboard();

	const rotate = useSharedValue(75);
	const translateX = useSharedValue(-350);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotate: `${rotate.value}deg` },
				{ translateX: translateX.value },
			],
		};
	});

	const headerScale = useSharedValue(1);
	const headerPosition = useSharedValue({ x: 0, y: 0 });

	const animatedHeaderStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: headerScale.value }],
			left: headerPosition.value.x,
			top: headerPosition.value.y,
		};
	});

	useIsomorphicLayoutEffect(() => {
		if (isKeyboardVisible) {
			translateX.value = withTiming(-600, { duration: 500 });
			headerScale.value = withTiming(0.5, { duration: 500 });
			headerPosition.value = withTiming({ x: -90, y: -30 }, { duration: 100 });
		} else {
			translateX.value = withTiming(-350, { duration: 500 });
			headerScale.value = withTiming(1, { duration: 500 });
			headerPosition.value = withTiming({ x: 0, y: 0 }, { duration: 100 });
		}
	}, [isKeyboardVisible]);

	return (
		<TouchableWithoutFeedback onPress={dismissKeyboard}>
			<Container>
				<Animated.View
					style={animatedStyle}
					className={cn("absolute h-[1000px] w-[500px] bg-primary")}
				/>
				<View
					className="flex-1 justify-between"
					style={{ paddingBottom: keyboardHeight }}
				>
					<Animated.View
						style={animatedHeaderStyle}
						className={cn(
							"items-center justify-between",
							isKeyboardVisible ? "flex-row" : "flex-col",
						)}
					>
						<Image
							source={{ uri: assets?.[0].uri }}
							style={{
								width: 150,
								height: 150,
							}}
						/>
						<Text
							className={cn(
								"font-brand text-8xl text-background uppercase",
								isKeyboardVisible ? "" : "self-start",
							)}
						>
							Hati
						</Text>
						<Text
							className={cn(
								"font-brand text-8xl text-background uppercase",
								isKeyboardVisible ? "ml-4" : "self-end",
							)}
						>
							Tayo
						</Text>
					</Animated.View>
					<View className="gap-4 py-8">
						<Text className="mb-2 font-geist-bold text-3xl text-foreground">
							Sign in
						</Text>
						<form.Field name="email">
							{(field) => (
								<View className="gap-2">
									<Text className="font-geist-medium uppercase">email</Text>
									<Input
										placeholder="Enter Email"
										onChangeText={field.handleChange}
										value={field.state.value}
										clearButtonMode="while-editing"
										className="native:h-14 rounded-full px-4"
									/>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 ? (
										<Text className="text-destructive text-sm">
											{field.state.meta.errors
												.map((error) => error?.message)
												.join(", ")}
										</Text>
									) : null}
								</View>
							)}
						</form.Field>
						<form.Field name="password">
							{(field) => (
								<View className="gap-2">
									<Text className="font-geist-medium uppercase">password</Text>
									<Input
										placeholder="Enter Password"
										onChangeText={field.handleChange}
										value={field.state.value}
										clearButtonMode="while-editing"
										className="native:h-14 rounded-full px-4"
										secureTextEntry
									/>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 ? (
										<Text className="text-destructive text-sm">
											{field.state.meta.errors
												.map((error) => error?.message)
												.join(", ")}
										</Text>
									) : null}
								</View>
							)}
						</form.Field>
						<Button
							className="rounded-full"
							onPress={() => {
								form.handleSubmit();
							}}
						>
							<Text>Sign in</Text>
						</Button>

						<Link href={"/(auth)/sign-up"}>
							<Text>
								Don't have an account yet?{" "}
								<Text className="text-primary">Sign up here</Text>
							</Text>
						</Link>
					</View>
				</View>
			</Container>
		</TouchableWithoutFeedback>
	);
};

export default SignInPage;
