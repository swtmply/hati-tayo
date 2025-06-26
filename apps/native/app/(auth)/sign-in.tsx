import { useSignIn } from "@clerk/clerk-expo";
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
	const { signIn, setActive, isLoaded } = useSignIn();
	const router = useRouter();
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: z.object({
				email: z.string().email(),
				password: z.string().min(1),
			}),
		},
		onSubmit: async ({ value }) => {
			if (!isLoaded) return;

			// Start the sign-in process using the email and password provided
			try {
				const signInAttempt = await signIn.create({
					identifier: value.email,
					password: value.password,
				});

				// If sign-in process is complete, set the created session as active
				// and redirect the user

				if (signInAttempt.status === "complete") {
					await setActive({ session: signInAttempt.createdSessionId });
					router.replace("/(tabs)");
				} else {
					// If the status isn't complete, check why. User might need to
					// complete further steps.
					console.error(JSON.stringify(signInAttempt, null, 2));
				}
			} catch (err) {
				// See https://clerk.com/docs/custom-flows/error-handling
				// for more info on error handling
				console.error(JSON.stringify(err, null, 2));
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
								{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
									<Text className="text-sm text-destructive">
										{field.state.meta.errors.join(", ")}
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
								{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
									<Text className="text-sm text-destructive">
										{field.state.meta.errors.join(", ")}
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
