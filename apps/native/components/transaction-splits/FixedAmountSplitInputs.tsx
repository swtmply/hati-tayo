import React from "react";
import { View } from "react-native";
import type { SplitInputComponentProps } from "./types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

const FixedAmountSplitInputs: React.FC<SplitInputComponentProps> = ({
	form,
	selectedMembers,
	detailsArrayPath,
}) => {
	const { Form } = form;

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
									placeholder="Amount"
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
									value={field.state.value}
									keyboardType="numeric"
									className="flex-1"
								/>
								{field.state.meta.touched &&
								field.state.meta.errors &&
								field.state.meta.errors.length > 0 ? (
									<Text className="text-destructive text-xs w-full pl-[calc(33%+1rem)]">
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

export default FixedAmountSplitInputs;
