import { useStore } from "@tanstack/react-form";
import { TouchableOpacity, View } from "react-native";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { withForm } from "~/hooks/useAppForm";
import { createTransactionFormOpts } from "~/lib/form/schemas/transactions-schema";
import { cn } from "~/lib/utils";

const PayerSelectList = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		const selectedMembers = useStore(
			form.store,
			(state) => state.values.selectedMembers,
		);

		const payer = useStore(form.store, (state) => state.values.payer);

		return (
			<form.Field name="payer">
				{(field) => {
					return (
						<>
							<Label>Payer</Label>
							<View className="flex-row items-center gap-2">
								{selectedMembers.map((member) => {
									const selected = payer === member._id;

									return (
										<TouchableOpacity
											key={`selectedMember-${member._id}`}
											onPress={() => {
												field.handleChange(member._id);
											}}
										>
											<Avatar
												alt={member.name}
												className={cn(selected && "border-4 border-primary")}
											>
												<AvatarImage
													source={{
														uri: member.image,
													}}
												/>
												<AvatarImage
													source={{
														uri: member.image,
													}}
												/>
											</Avatar>
										</TouchableOpacity>
									);
								})}
							</View>
							{selectedMembers.length === 0 && (
								<Text className="text-muted-foreground italic">
									Please select at least one member
								</Text>
							)}
							{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
								<Text className="text-destructive text-sm">
									{field.state.meta.errors.map((error) => error).join(", ")}
								</Text>
							) : null}
						</>
					);
				}}
			</form.Field>
		);
	},
});

export default PayerSelectList;
