import { useStore } from "@tanstack/react-form";
import { TouchableOpacity, View } from "react-native";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { CircleCheck, Plus } from "~/components/ui/icons";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { withForm } from "~/hooks/useAppForm";
import { createTransactionFormOpts } from "~/lib/form/schemas/transactions-schema";
import { cn } from "~/lib/utils";
import useMemberIndexStore from "~/store/add-member";

const MemberSelectList = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		const selectedMembers = useStore(
			form.store,
			(state) => state.values.selectedMembers,
		);

		const setMemberIndex = useMemberIndexStore((state) => state.setMemberIndex);

		return (
			<form.Subscribe selector={(state) => state.values.members}>
				{(members) => {
					return (
						<>
							<View className="flex-row items-center justify-between">
								<Label>Members</Label>
								<Button
									onPress={() => {
										setMemberIndex(1);
									}}
									className="flex-row items-center gap-2 border-2 border-sidebar-foreground bg-sidebar"
								>
									<Plus className="text-sidebar-foreground" />
									<Text className="font-geist-semibold text-sidebar-foreground">
										Add Member
									</Text>
								</Button>
							</View>
							{members.map((member) => {
								return (
									<TouchableOpacity
										key={`member-${member._id}`}
										onPress={() => {
											const index = selectedMembers.findIndex(
												(selectedMember) => selectedMember._id === member._id,
											);
											if (index > -1) {
												form.removeFieldValue("selectedMembers", index);
												form.removeFieldValue("percentages", index);
												form.removeFieldValue("fixedAmounts", index);
											} else {
												form.pushFieldValue("selectedMembers", member);
												form.pushFieldValue("percentages", {
													userId: member._id,
													percentage: 0,
												});
												form.pushFieldValue("fixedAmounts", {
													userId: member._id,
													amount: 0,
												});
											}
										}}
										className="flex-row items-center justify-between"
									>
										<View className="flex-row items-center gap-2">
											<Avatar alt={member.name}>
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
											<Text className=" font-geist-semibold">
												{member.name}
											</Text>
										</View>
										<CircleCheck
											className={cn(
												"rounded-full text-foreground",
												selectedMembers.includes(member) &&
													"bg-secondary text-primary",
											)}
										/>
									</TouchableOpacity>
								);
							})}
						</>
					);
				}}
			</form.Subscribe>
		);
	},
});

export default MemberSelectList;
