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

const nameSchema = z.object({
	name: z.string().min(1, "Name cannot be empty"),
});

export default function EditNameScreen() {
	const user = useQuery(api.users.get);
	const updateNameMutation = useMutation(api.users.updateName);

	const { Field, handleSubmit } = useAppForm({
		defaultValues: {
			name: user?.name ?? "",
		},
		validators: {
			onSubmit: nameSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await updateNameMutation({ name: value.name });

				Toast.show({
					type: "success",
					text1: "Name updated successfully",
				});

				router.back();
			} catch (error) {
				console.error("Failed to update name:", error);
				Toast.show({
					type: "error",
					text1: "Failed to update name",
				});
			}
		},
	});

	return (
		<Container>
			<Text className="mb-4 font-geist-bold text-3xl text-foreground tracking-tighter">
				Edit Name
			</Text>
			<View className="gap-4">
				<Field name="name">
					{(field) => (
						<View className="gap-1.5">
							<Label nativeID={`label-for-${field.name}`}>Name</Label>
							<Input
								placeholder="Enter your new name"
								value={field.state.value}
								onChangeText={(text) => field.handleChange(text)}
								onBlur={field.handleBlur}
								nativeID={`input-for-${field.name}`}
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
