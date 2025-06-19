import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import * as SelectPrimitive from "@rn-primitives/select";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import AddMemberFormSheet from "~/components/add-member-form-sheet";
import { Container } from "~/components/container";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { ChevronLeft, Plus } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem } from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";
import { useKeyboard } from "~/hooks/useKeyboard";
import { cn } from "~/lib/utils";

const CreateTransactionForm = () => {
	const triggerRef = React.useRef<SelectPrimitive.TriggerRef>(null);
	const { dismissKeyboard } = useKeyboard();

	const [openFormSheet, setOpenFormSheet] = React.useState<number>(-1);

	const groups = useQuery(api.groups.groupsOfCurrentUserWithMembers);
	const user = useQuery(api.auth.get);
	const createTransaction = useMutation(api.transactions.createTransaction);

	const Form = useAppForm({
		defaultValues: {
			groupName: "",
			groupId: "",
			transactionName: "",
			amount: "",
			payer: "",
			members: [{ _id: "", name: "", image: "" }],
		},
		validators: {
			onChange: z.object({
				groupName: z.string().min(1),
				groupId: z.string(),
				transactionName: z.string().min(1),
				amount: z.string().min(1),
				payer: z.string(),
				members: z.array(
					z.object({
						_id: z.string(),
						name: z.string(),
						image: z.string(),
					}),
				),
			}),
		},
		onSubmit: ({ value }) => {
			const participants = new Set<Id<"users">>();
			participants.add(user?._id as Id<"users">);

			for (const member of value.members) {
				participants.add(member._id as Id<"users">);
			}

			if (value.groupId !== "") {
				const group = groups?.find((group) => group._id === value.groupId);
				if (group) {
					for (const member of group.members) {
						participants.add(member._id as Id<"users">);
					}
				}
			}

			createTransaction({
				name: value.transactionName,
				groupName: value.groupName === "" ? undefined : value.groupName,
				groupId:
					value.groupId === "" ? undefined : (value.groupId as Id<"groups">),
				payerId: value.payer as Id<"users">,
				participants: Array.from(participants) as Id<"users">[],
				amount: Number(value.amount),
				splitType: "EQUAL",
			});
			Form.reset();
			router.replace("/(tabs)");
		},
	});

	const openSelect = () => {
		triggerRef.current?.open();
	};

	const closeSelect = () => {
		triggerRef.current?.close();
	};

	return (
		<Container>
			<View className="flex-row items-center justify-between pt-12 pb-4">
				<TouchableOpacity
					onPress={() => {
						router.replace("/(tabs)");
					}}
				>
					<ChevronLeft className="text-primary" />
				</TouchableOpacity>
				<Text className="font-semibold text-xl">Create Transaction</Text>
				<ChevronLeft className="invisible" />
			</View>

			{/* MARK: Group Name
			 */}
			<Form.Field name="groupName">
				{(field) => (
					<>
						<Label>Group Name</Label>
						<Input
							placeholder="Select Group"
							onFocus={openSelect}
							onBlur={closeSelect}
							onChangeText={(text) => {
								field.handleChange(text);
								Form.setFieldValue("groupId", "");
							}}
							value={field.state.value}
							clearButtonMode="while-editing"
						/>
					</>
				)}
			</Form.Field>

			{/* MARK: Combo Box
			 */}
			<Select
				className="-mt-4"
				defaultValue={{
					value: Form.state.values.groupId,
					label: Form.state.values.groupName,
				}}
				onValueChange={(option) => {
					Form.setFieldValue("groupId", option?.value ?? "");
					const groupName = groups?.find(
						(group) => group._id === option?.value,
					)?.name;

					Form.setFieldValue("members", []);

					Form.setFieldValue("groupName", groupName ?? "");
				}}
				onOpenChange={(open) => {
					if (!open) {
						dismissKeyboard();
					}
				}}
			>
				<SelectPrimitive.Trigger ref={triggerRef} />
				<SelectContent className="w-full" insets={{ left: 20, right: 20 }}>
					<Form.Subscribe selector={(state) => state.values.groupName}>
						{(groupName) => {
							const filteredGroups = groups?.filter((group) => {
								if (!group) return false;

								return group.name
									.toLowerCase()
									.includes(groupName.toLowerCase());
							});

							if (filteredGroups?.length === 0) {
								return [
									<SelectItem
										disabled
										key="no-group"
										value=""
										label="Creating new group..."
									>
										Creating new group
									</SelectItem>,
								];
							}

							return filteredGroups?.map((group) => {
								if (!group) return null;

								return (
									<SelectItem
										key={group._id}
										value={group._id}
										label={group.name}
									>
										{group.name}
									</SelectItem>
								);
							});
						}}
					</Form.Subscribe>
				</SelectContent>
			</Select>

			{/* MARK: Transaction Name
			 */}
			<Form.Field name="transactionName">
				{(field) => (
					<>
						<Label>Transaction Name</Label>
						<Input
							placeholder="Transaction Name"
							onChangeText={field.handleChange}
							value={field.state.value}
							clearButtonMode="while-editing"
						/>
					</>
				)}
			</Form.Field>

			{/* MARK: Amount
			 */}
			<Form.Field name="amount">
				{(field) => (
					<>
						<Label>Amount</Label>
						<Input
							placeholder="Amount"
							onChangeText={field.handleChange}
							value={field.state.value}
							clearButtonMode="while-editing"
							keyboardType="numeric"
						/>
					</>
				)}
			</Form.Field>

			{/* MARK: Payer
			 */}
			<View className="flex flex-col gap-4">
				<Label>Payer</Label>
				<Form.Subscribe selector={(state) => state.values.groupId}>
					{(groupId) => {
						const members = groups?.find(
							(group) => group._id === groupId,
						)?.members;

						return (
							<View className="flex-row gap-2">
								<Form.Subscribe selector={(state) => state.values.payer}>
									{(payerId) => {
										const defaultUserSelected = payerId === user?._id;

										return (
											<>
												{/* MARK: Members
												 */}
												{members?.map((member) => {
													if (!member) return null;

													const selected = payerId === member._id;

													return (
														<Pressable
															key={member._id}
															onPress={() => {
																Form.setFieldValue("payer", member._id);
															}}
														>
															<Avatar
																alt={member.name}
																className={cn(
																	selected && "border-2 border-primary",
																)}
															>
																<AvatarImage
																	source={{
																		uri: member.image,
																	}}
																/>
															</Avatar>
														</Pressable>
													);
												})}
												{/* MARK: User */}
												{groupId === "" && (
													<Pressable
														onPress={() => {
															Form.setFieldValue("payer", user?._id ?? "");
														}}
													>
														<Avatar
															alt={user?.name || "User"}
															className={cn(
																defaultUserSelected &&
																	"border-2 border-primary",
															)}
														>
															<AvatarImage
																source={{
																	uri: user?.image || "",
																}}
															/>
														</Avatar>
													</Pressable>
												)}
												{/* MARK: Add Member
												 */}
												<Form.Subscribe
													selector={(state) => state.values.members}
												>
													{(values) => {
														if (!values) return null;

														return values?.map((value) => {
															const selected = payerId === value._id;

															if (value._id === "") return null;

															return (
																<Pressable
																	onPress={() => {
																		Form.setFieldValue("payer", value._id);
																	}}
																	key={value._id}
																>
																	<Avatar
																		alt={value.name}
																		className={cn(
																			selected && "border-2 border-primary",
																		)}
																	>
																		<AvatarImage
																			source={{
																				uri: value.image,
																			}}
																		/>
																	</Avatar>
																</Pressable>
															);
														});
													}}
												</Form.Subscribe>
												{/* MARK: Add Member Button
												 */}
												<Pressable
													onPress={() => {
														setOpenFormSheet(0);
													}}
													className="h-10 w-10 items-center justify-center rounded-full border border-neutral-400 border-dashed"
												>
													<Plus className="text-neutral-400" />
												</Pressable>
											</>
										);
									}}
								</Form.Subscribe>
							</View>
						);
					}}
				</Form.Subscribe>
			</View>

			{/* MARK: Submit Button
			 */}
			<Form.Button
				className="mt-4"
				onPress={() => {
					Form.handleSubmit();
				}}
			>
				<Text className="font-semibold">Create</Text>
			</Form.Button>

			<AddMemberFormSheet
				index={openFormSheet}
				onClose={() => setOpenFormSheet(-1)}
				onSubmit={(users) => {
					setOpenFormSheet(-1);

					Form.setFieldValue(
						"members",
						users.map((user) => ({
							_id: user._id,
							name: user.name,
							image: user.image,
						})),
					);
				}}
			/>
		</Container>
	);
};

export default CreateTransactionForm;
