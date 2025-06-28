import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { Link, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { z } from "zod";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";

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

	return (
		<Container>
			<ScrollView className="flex-1 p-6">
				<View className="gap-4 py-8">
					<Text className="mb-2 font-geist-bold text-3xl text-foreground">
						Sign in
					</Text>
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
						<Text>Sign in</Text>
					</Button>

					<Text>
						Don't have an account yet?{" "}
						<Link href={"/(auth)/sign-up"}>
							<Text className="text-primary">Sign up here</Text>
						</Link>
					</Text>
				</View>
			</ScrollView>
		</Container>
	);
};

export default SignInPage;
