import { api } from "@hati-tayo/backend/convex/_generated/api";
import {
	useMutation, // useQuery
} from "convex/react";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { z } from "zod";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm"; // Assuming this hook can be adapted or used

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password cannot be empty"),
		newPassword: z
			.string()
			.min(8, "New password must be at least 8 characters"),
		confirmNewPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "New passwords do not match",
		path: ["confirmNewPassword"], // path to field that gets the error
	});

export default function EditPasswordScreen() {
	// const user = useQuery(api.users.get); // Not strictly needed for password change
	const updatePasswordMutation = useMutation(api.users.updatePassword);

	const { Field, handleSubmit, Subscribe } = useAppForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
		validators: {
			onSubmit: passwordSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await updatePasswordMutation({
					currentPassword: value.currentPassword,
					newPassword: value.newPassword,
				});
				// This part will likely not be reached if the mutation throws an error as expected.
				// If it were to succeed (e.g. if auth provider was changed), then navigate back.
				router.back();
			} catch (error) {
				if (error instanceof Error) {
					console.error("Failed to update password:", error.message);
					// Display an alert to the user
					alert(`Password Update Failed: ${error.message}`);
					// Optionally, you could clear the password fields here or log more detailed error info
				}
			}
		},
	});

	return (
		<Container>
			<Text className="mb-4 font-geist-bold text-3xl text-foreground tracking-tighter">
				Change Password
			</Text>
			<View className="gap-4">
				<Field name="currentPassword">
					{(field) => (
						<View className="gap-1.5">
							<Label nativeID={`label-for-${field.name}`}>
								Current Password
							</Label>
							<Input
								placeholder="Enter your current password"
								value={field.state.value}
								onChangeText={(text) => field.handleChange(text)}
								onBlur={field.handleBlur}
								nativeID={`input-for-${field.name}`}
								secureTextEntry
							/>
							{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
								<Text className="text-destructive text-sm">
									{field.state.meta.errors.map((error) => error).join(", ")}
								</Text>
							) : null}
						</View>
					)}
				</Field>
				<Field name="newPassword">
					{(field) => (
						<View className="gap-1.5">
							<Label nativeID={`label-for-${field.name}`}>New Password</Label>
							<Input
								placeholder="Enter your new password"
								value={field.state.value}
								onChangeText={(text) => field.handleChange(text)}
								onBlur={field.handleBlur}
								nativeID={`input-for-${field.name}`}
								secureTextEntry
							/>
							{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
								<Text className="text-destructive text-sm">
									{field.state.meta.errors.map((error) => error).join(", ")}
								</Text>
							) : null}
						</View>
					)}
				</Field>
				<Field name="confirmNewPassword">
					{(field) => (
						<View className="gap-1.5">
							<Label nativeID={`label-for-${field.name}`}>
								Confirm New Password
							</Label>
							<Input
								placeholder="Confirm your new password"
								value={field.state.value}
								onChangeText={(text) => field.handleChange(text)}
								onBlur={field.handleBlur}
								nativeID={`input-for-${field.name}`}
								secureTextEntry
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
