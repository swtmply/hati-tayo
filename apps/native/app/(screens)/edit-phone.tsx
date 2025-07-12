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
import { useAppForm } from "~/hooks/useAppForm";

const phoneSchema = z.object({
	phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"), // Basic validation
});

export default function EditPhoneScreen() {
	const user = useQuery(api.users.get);
	const updatePhoneNumberMutation = useMutation(api.users.updatePhoneNumber);

	const { Field, handleSubmit, Subscribe, reset } = useAppForm({
		defaultValues: {
			phoneNumber: user?.phoneNumber ?? "",
		},
		schema: phoneSchema,
	});

	React.useEffect(() => {
		if (user) {
			reset({ phoneNumber: user.phoneNumber ?? "" });
		}
	}, [user, reset]);

	const onSubmit = async (values: z.infer<typeof phoneSchema>) => {
		try {
			await updatePhoneNumberMutation({ phoneNumber: values.phoneNumber });
			router.back();
		} catch (error) {
			console.error("Failed to update phone number:", error);
			// TODO: Show user-friendly error message
		}
	};

	return (
		<Container>
			<Text className="mb-4 font-geist-bold text-3xl text-foreground tracking-tighter">
				Edit Phone Number
			</Text>
			<View className="gap-4">
				<Field
					name="phoneNumber"
					children={(field) => (
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
