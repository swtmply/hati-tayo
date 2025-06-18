import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { z } from "zod";
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
					router.replace("/");
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
		<View>
			<Text>SignInPage</Text>
		</View>
	);
};

export default SignInPage;
