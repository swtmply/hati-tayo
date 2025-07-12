import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";

const emailSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export default function EditEmailScreen() {
	const user = useQuery(api.users.get);
	const updateEmailMutation = useMutation(api.users.updateEmail);

	const { Field, handleSubmit } = useAppForm({
		defaultValues: {
			email: user?.email ?? "",
		},
		validators: {
			onSubmit: emailSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await updateEmailMutation({ email: value.email });

				Toast.show({
					type: "success",
					text1: "Email updated successfully",
				});

				router.back();
			} catch (error) {
				console.error("Failed to update email:", error);
				Toast.show({
					type: "error",
					text1: "Failed to update email",
				});
			}
		},
	});

	return (
		<Container>
			<Text className="mb-4 font-geist-bold text-3xl text-foreground tracking-tighter">
				Edit Email
			</Text>
			<View className="gap-4">
				<Field name="email">
					{(field) => (
						<View className="gap-1.5">
							<Label nativeID={`label-for-${field.name}`}>Email</Label>
							<Input
								placeholder="Enter your new email"
								value={field.state.value}
								onChangeText={(text) => field.handleChange(text)}
								onBlur={field.handleBlur}
								nativeID={`input-for-${field.name}`}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
							{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
								<Text className="text-destructive text-sm">
									{field.state.meta.errors.map((error) => error).join(", ")}
								</Text>
							) : null}
						</View>
					)}
				</Field>
				<Button onPress={() => handleSubmit()}>
					<Text>Save Changes</Text>
				</Button>
			</View>
		</Container>
	);
}
