import { useAuth, useSignUp } from "@clerk/clerk-expo";
import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useMutation } from "convex/react";
import { Link, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { z } from "zod";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";

const SignUpPage = () => {
	const { isLoaded, signUp } = useSignUp(); // Removed setActive as it's not used
	const { signOut } = useAuth();
	const router = useRouter();

	const createUser = useMutation(api.users.createUser);

	const [pendingVerification, setPendingVerification] = React.useState(false);
	const [code, setCode] = React.useState("");

	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		validators: {
			onChange: z.object({
				name: z.string().min(1),
				email: z.string().email(),
				password: z.string().min(1),
			}),
		},
		onSubmit: async ({ value }) => {
			if (!isLoaded) return;

			// Start sign-up process using email and password provided
			try {
				await signUp.create({
					firstName: value.name,
					emailAddress: value.email,
					password: value.password,
				});

				// Send user an email with verification code
				await signUp.prepareEmailAddressVerification({
					strategy: "email_code",
				});

				// Set 'pendingVerification' to true to display second form
				// and capture OTP code
				setPendingVerification(true);
			} catch (err) {
				// See https://clerk.com/docs/custom-flows/error-handling
				// for more info on error handling
				console.error(JSON.stringify(err, null, 2));
			}
		},
	});

	const onVerifyPress = async () => {
		if (!isLoaded) return;

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === "complete") {
				createUser({
					email: form.getFieldValue("email"),
					name: form.getFieldValue("name"),
				});
				// Ensure any implicit session/state from sign-up is cleared
				await signOut();
				router.push("/sign-in");
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signUpAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	if (pendingVerification) {
		return (
			<Container>
				<ScrollView className="flex-1 p-6">
					<View className="gap-4 py-8">
						<Text className="mb-2 font-geist-bold text-3xl text-foreground">
							Account Verificatiion
						</Text>

						<View className="gap-2">
							<Text className="font-geist-medium">Verification Code</Text>
							<Input
								placeholder="Enter verification code"
								onChangeText={setCode}
								value={code}
								clearButtonMode="while-editing"
								className="native:h-14 rounded-full px-4"
							/>
						</View>

						<Button className="rounded-full" onPress={onVerifyPress}>
							<Text>Verify</Text>
						</Button>
					</View>
				</ScrollView>
			</Container>
		);
	}

	return (
		<Container>
			<ScrollView className="flex-1 p-6">
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
						<Link href={"/(auth)/sign-in"}>
							<Text className="text-primary">Sign in here</Text>
						</Link>
					</Text>
				</View>
			</ScrollView>
		</Container>
	);
};

export default SignUpPage;
