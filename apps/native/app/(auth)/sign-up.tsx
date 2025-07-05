import { useAuthActions } from "@convex-dev/auth/react";
import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { z } from "zod";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";
import { useKeyboard } from "~/hooks/useKeyboard";
import { cn } from "~/lib/utils";

const SignUpPage = () => {
	const { signIn } = useAuthActions();

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			phoneNumber: "",
			password: "",
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(1, { message: "Name is required" }),
				email: z.string().email({ message: "Invalid email" }),
				phoneNumber: z.string().min(1, { message: "Phone number is required" }),
				password: z.string().min(1, { message: "Password is required" }),
			}),
		},
		onSubmit: async ({ value }) => {
			// Start sign-up process using email and password provided
			try {
				await signIn("password", {
					name: value.name,
					email: value.email,
					password: value.password,
					phoneNumber: value.phoneNumber,
					image: `https://ui-avatars.com/api/?background=random&name=${value.name.replace(" ", "+")}`,
					redirectTo: "/(tabs)",
					flow: "signUp",
				});
			} catch (err) {
				console.error(JSON.stringify(err, null, 2));
			}
		},
	});

	const [assets, error] = useAssets([
		require("~/assets/start-icon-light.png"),
		require("~/assets/start-icon-dark.png"),
	]);

	const { keyboardHeight, isKeyboardVisible } = useKeyboard();

	return (
		<Container>
			<View className="-top-0 absolute right-0 left-0 h-[200px] bg-primary" />
			<ScrollView
				className="flex-1"
				style={{ marginBottom: isKeyboardVisible ? keyboardHeight : 0 }}
			>
				<View className="h-[150px] flex-row items-center">
					<Image
						source={{ uri: assets?.[0].uri }}
						style={{
							width: 75,
							height: 75,
						}}
					/>
					<Text className={cn("font-brand text-5xl text-background uppercase")}>
						Hati Tayo
					</Text>
				</View>

				<View className="gap-4 py-8">
					<Text className="mb-2 font-geist-bold text-3xl text-foreground">
						Sign up
					</Text>
					<form.Field name="name">
						{(field) => (
							<View className="gap-2">
								<Text className="font-geist-medium">Account name</Text>
								<Input
									placeholder="Enter Name"
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
					<form.Field name="email">
						{(field) => (
							<View className="gap-2">
								<Text className="font-geist-medium">Account email</Text>
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
					<form.Field name="phoneNumber">
						{(field) => (
							<View className="gap-2">
								<Text className="font-geist-medium">Account phone number</Text>
								<Input
									placeholder="Enter Phone Number"
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
								<Text className="font-geist-medium">Account password</Text>
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
						<Text>Sign up</Text>
					</Button>

					<Text>
						Already have an account yet?{" "}
						<Link href={"/(auth)/sign-in"} push>
							<Text className="text-primary">Sign in here</Text>
						</Link>
					</Text>
				</View>
			</ScrollView>
		</Container>
	);
};

export default SignUpPage;
