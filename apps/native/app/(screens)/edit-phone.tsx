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

const phoneSchema = z.object({
	phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"), // Basic validation
});

export default function EditPhoneScreen() {
	const user = useQuery(api.users.get);
	const updatePhoneNumberMutation = useMutation(api.users.updatePhoneNumber);

	const { Field, handleSubmit } = useAppForm({
		defaultValues: {
			phoneNumber: user?.phoneNumber ?? "",
		},
		validators: {
			onSubmit: phoneSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await updatePhoneNumberMutation({ phoneNumber: value.phoneNumber });

				Toast.show({
					type: "success",
					text1: "Phone number updated successfully",
				});

				router.back();
			} catch (error) {
				console.error("Failed to update phone number:", error);
				Toast.show({
					type: "error",
					text1: "Failed to update phone number",
				});
			}
		},
	});

	return (
		<Container>
			<Text className="mb-4 font-geist-bold text-3xl text-foreground tracking-tighter">
				Edit Phone Number
			</Text>
			<View className="gap-4">
				<Field name="phoneNumber">
					{(field) => (
						<View className="gap-1.5">
							<Label nativeID={`label-for-${field.name}`}>Phone Number</Label>
							<Input
								placeholder="Enter your new phone number"
								value={field.state.value}
								onChangeText={(text) => field.handleChange(text)}
								onBlur={field.handleBlur}
								nativeID={`input-for-${field.name}`}
								keyboardType="phone-pad"
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
