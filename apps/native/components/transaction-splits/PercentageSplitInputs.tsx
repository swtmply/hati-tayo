import React from "react";
import { View } from "react-native";
import type { SelectedMember, SplitInputComponentProps } from "./types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

const PercentageSplitInputs: React.FC<SplitInputComponentProps> = ({
	form,
	selectedMembers,
	detailsArrayPath,
}) => {
	const { Form } = form; // Assuming useAppForm returns an object with Form property

	if (
		selectedMembers.length === 0 ||
		(selectedMembers.length === 1 && selectedMembers[0]._id === "")
	) {
		return (
			<Text className="text-center text-neutral-400">
				Please select members to split with.
			</Text>
		);
	}

	return (
		<>
			{selectedMembers.map((member, index) => {
				if (member._id === "") return null;

				const fieldName = `${detailsArrayPath}[${index}].value`;
				// Find the corresponding detail for this member to get existing value
				// This assumes splitDetails in form state is an array of objects {userId: string, value: string}
				// and its order matches selectedMembers, or it's updated accordingly.
				const currentDetailValue =
					form.state.values[detailsArrayPath]?.[index]?.value || "";

				return (
					<Form.Field key={member._id} name={fieldName}>
						{(field) => (
							<View className="mb-2 flex-row items-center gap-2">
								<Avatar alt={member.name} className="h-8 w-8">
									<AvatarImage source={{ uri: member.image }} />
								</Avatar>
								<Text
									className="w-1/3 flex-shrink font-geist-medium"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{member.name}
								</Text>
								<Input
									placeholder="%"
									onChangeText={(text) => {
										const numericValue = text.replace(/[^0-9.]/g, "");
										const currentDetails =
											form.getFieldValue(detailsArrayPath) || [];
										const updatedDetails = currentDetails.map(
											(detail: { userId: string }, i: number) =>
												i === index
													? { ...detail, value: numericValue }
													: detail,
										);
										form.setFieldValue(detailsArrayPath, updatedDetails);
									}}
									value={field.state.value} // Field state should have the correct value
									keyboardType="numeric"
									className="flex-1"
								/>
								{field.state.meta.touched &&
								field.state.meta.errors &&
								field.state.meta.errors.length > 0 ? (
									<Text className="text-destructive text-xs w-full pl-[calc(33%+1rem)]">
										{/* Display specific error for this input */}
										{field.state.meta.errors.join(", ")}
									</Text>
								) : null}
							</View>
						)}
					</Form.Field>
				);
			})}
		</>
	);
};

export default PercentageSplitInputs;
