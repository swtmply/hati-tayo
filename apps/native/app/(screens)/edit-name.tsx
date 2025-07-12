import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@tanstack/react-form";
import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
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

const nameSchema = z.object({
	name: z.string().min(1, "Name cannot be empty"),
});

export default function EditNameScreen() {
	const user = useQuery(api.users.get);
	const updateNameMutation = useMutation(api.users.updateName);

	const { Field, handleSubmit, Subscribe, reset } = useAppForm({
		defaultValues: {
			name: user?.name ?? "",
		},
		schema: nameSchema,
	});

	React.useEffect(() => {
		if (user) {
			reset({ name: user.name ?? "" });
		}
	}, [user, reset]);

	const onSubmit = async (values: z.infer<typeof nameSchema>) => {
		try {
			await updateNameMutation({ name: values.name });
			router.back();
		} catch (error) {
			console.error("Failed to update name:", error);
			// TODO: Show user-friendly error message (e.g., using a toast)
		}
	};

	return (
		<Container>
			<Text className="mb-4 font-geist-bold text-3xl text-foreground tracking-tighter">
				Edit Name
			</Text>
			<View className="gap-4">
				<Field
					name="name"
					children={(field) => (
						<View className="gap-1.5">
							<Label nativeID={`label-for-${field.name}`}>Name</Label>
							<Input
								placeholder="Enter your new name"
								value={field.state.value}
								onChangeText={(text) => field.handleChange(text)}
								onBlur={field.handleBlur}
								nativeID={`input-for-${field.name}`}
							/>
							<Subscribe
								selector={(state) => state.fieldMeta.errorMap[field.name]}
								children={(error) =>
									error ? <Text className="text-sm text-destructive">{error}</Text> : null
								}
							/>
						</View>
					)}
				/>
				<Button onPress={() => handleSubmit(onSubmit)()}>
					<Text>Save Changes</Text>
				</Button>
			</View>
		</Container>
	);
}
