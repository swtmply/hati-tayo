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

const emailSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export default function EditEmailScreen() {
	const user = useQuery(api.users.get);
	const updateEmailMutation = useMutation(api.users.updateEmail);

	const { Field, handleSubmit, Subscribe, reset } = useAppForm({
		defaultValues: {
			email: user?.email ?? "",
		},
		schema: emailSchema,
	});

	React.useEffect(() => {
		if (user) {
			reset({ email: user.email ?? "" });
		}
	}, [user, reset]);

	const onSubmit = async (values: z.infer<typeof emailSchema>) => {
		try {
			await updateEmailMutation({ email: values.email });
			router.back();
		} catch (error) {
			console.error("Failed to update email:", error);
			// TODO: Show user-friendly error message (e.g., using a toast for "Email already in use")
		}
	};

	return (
		<Container>
			<Text className="mb-4 font-geist-bold text-3xl text-foreground tracking-tighter">
				Edit Email
			</Text>
			<View className="gap-4">
				<Field
					name="email"
					children={(field) => (
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
