import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import * as SelectPrimitive from "@rn-primitives/select";
import { formOptions, useStore } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import AddMemberFormSheet from "~/components/add-member-form-sheet";
import AddMemberToShareFormSheet from "~/components/add-member-to-share-form-sheet";
import { Container } from "~/components/container";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ChevronLeft, CircleCheck, Plus, Trash } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem } from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";
import { useKeyboard } from "~/hooks/useKeyboard";
import { cn } from "~/lib/utils";
import useSelectedShareFieldStore from "~/store/share-split";

const SPLIT_TYPES = [
	{ value: "EQUAL", label: "Equal" },
	{ value: "PERCENTAGE", label: "Percentage" },
	{ value: "FIXED", label: "Fixed" },
	{ value: "SHARED", label: "Shared" },
];

const baseSplitSchema = z.object({
	groupName: z.string().min(1, "Group name is required."),
	groupId: z.string(),
	transactionName: z.string().min(1, "Transaction name is required."),
	amount: z
		.string()
		.min(1, "Amount is required.")
		.refine(
			(val) =>
				!Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
			{
				message: "Amount must be a positive number.",
			},
		),
	members: z.array(
		z.object({
			_id: z.string(),
			name: z.string(),
			image: z.string(),
			email: z.string().optional(),
			phoneNumber: z.string().optional(),
		}),
	),
	selectedMembers: z.array(
		z.object({
			_id: z.string(),
			name: z.string(),
			image: z.string(),
			email: z.string().optional(),
			phoneNumber: z.string().optional(),
		}),
	),
});

const equalSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("EQUAL"),
	payer: z.string().min(1, "A payer must be selected."),
});

const percentageSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("PERCENTAGE"),
	percentages: z
		.array(
			z.object({
				userId: z.string(),
				percentage: z
					.number()
					.min(1, "Percentage must be at least 1.")
					.max(100, "Percentage must be at most 100."),
			}),
		)
		.superRefine((data, ctx) => {
			if (data.reduce((acc, curr) => acc + curr.percentage, 0) !== 100) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Percentages must sum to 100.",
				});
			}
		}),
});

const fixedSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("FIXED"),
	fixedAmounts: z.array(
		z.object({
			userId: z.string(),
			amount: z.number().min(1, "Amount must be at least 1."),
		}),
	),
});

const sharedSplitSchema = baseSplitSchema.extend({
	splitType: z.literal("SHARED"),
	items: z.array(
		z.object({
			participantIds: z.array(z.string()),
			name: z.string(),
			amount: z.number().min(1, "Amount must be at least 1."),
		}),
	),
});

export type SplitMember = z.infer<typeof baseSplitSchema>["members"][number];
const splitSchema = z
	.discriminatedUnion("splitType", [
		equalSplitSchema,
		percentageSplitSchema,
		fixedSplitSchema,
		sharedSplitSchema,
	])
	.superRefine((data, ctx) => {
		if (
			data.splitType === "FIXED" &&
			data.fixedAmounts.reduce((acc, curr) => acc + curr.amount, 0) !==
				Number.parseFloat(data.amount)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Amounts must sum to the total amount.",
			});
		}
	});

export type SplitForm = z.infer<typeof splitSchema>;

export const createTransactionFormOpts = formOptions({
	defaultValues: {
		groupName: "",
		groupId: "",
		transactionName: "",
		amount: "",
		members: [] as SplitMember[],
		selectedMembers: [] as SplitMember[],
		splitType: "EQUAL",
		payer: "",
		percentages: [] as { userId: string; percentage: number }[],
		fixedAmounts: [] as { userId: string; amount: number }[],
		items: [{ amount: 0, name: "", participantIds: [] }] as {
			participantIds: string[];
			name: string;
			amount: number;
		}[],
	},
});

const CreateTransactionForm = () => {
	const triggerRef = React.useRef<SelectPrimitive.TriggerRef>(null);
	const { dismissKeyboard } = useKeyboard();

	const [openFormSheet, setOpenFormSheet] = React.useState<number>(-1);

	const groups = useQuery(api.groups.groupsOfCurrentUserWithMembers);
	const user = useQuery(api.users.get);
	const createTransaction = useMutation(api.transactions.createTransaction);

	const setSelectedShareField = useSelectedShareFieldStore(
		(state) => state.setSelectedShareField,
	);

	// MARK: Form
	const form = useAppForm({
		defaultValues: {
			groupName: "",
			groupId: "",
			transactionName: "",
			amount: "",
			members: [
				{
					_id: user?._id,
					name: user?.name,
					image: user?.image,
					email: user?.email,
					phoneNumber: user?.phoneNumber,
				},
			] as SplitMember[],
			selectedMembers: [] as SplitMember[],
			splitType: "EQUAL",
			payer: "",
			percentages: [] as { userId: string; percentage: number }[],
			fixedAmounts: [] as { userId: string; amount: number }[],
			items: [{ amount: 0, name: "", participantIds: [] }] as {
				participantIds: string[];
				name: string;
				amount: number;
			}[],
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = splitSchema.safeParse(value);
				console.log("result", result);
				return result.success ? undefined : result.error.format();
			},
		},
		// MARK: onSubmit
		onSubmit: ({ value }) => {
			if (value.splitType === "EQUAL") {
				createTransaction({
					data: {
						amount: Number.parseFloat(value.amount),
						name: value.transactionName,
						splitType: value.splitType,
						payerId: value.payer,
						groupId:
							value.groupId === ""
								? undefined
								: (value.groupId as Id<"groups">),
						groupName: value.groupName,
						participants: value.selectedMembers.map((member) => ({
							_id: member._id,
							name: member.name,
							email: member.email,
							phoneNumber: member.phoneNumber,
						})),
					},
				});
			}

			if (value.splitType === "PERCENTAGE") {
				createTransaction({
					data: {
						amount: Number.parseFloat(value.amount),
						name: value.transactionName,
						splitType: value.splitType,
						groupId:
							value.groupId === ""
								? undefined
								: (value.groupId as Id<"groups">),
						groupName: value.groupName,
						participants: value.selectedMembers.map((member) => ({
							_id: member._id,
							name: member.name,
							email: member.email,
							phoneNumber: member.phoneNumber,
						})),
						percentages: value.percentages,
					},
				});
			}

			if (value.splitType === "FIXED") {
				createTransaction({
					data: {
						amount: Number.parseFloat(value.amount),
						name: value.transactionName,
						splitType: value.splitType,
						groupId:
							value.groupId === ""
								? undefined
								: (value.groupId as Id<"groups">),
						groupName: value.groupName,
						participants: value.selectedMembers.map((member) => ({
							_id: member._id,
							name: member.name,
							email: member.email,
							phoneNumber: member.phoneNumber,
						})),
						fixedAmounts: value.fixedAmounts,
					},
				});
			}

			if (value.splitType === "SHARED") {
				const memberTotals = new Map<string, number>();

				for (const item of value.items) {
					if (item.participantIds.length > 0) {
						const share = item.amount / item.participantIds.length;
						for (const participantId of item.participantIds) {
							const currentTotal = memberTotals.get(participantId) ?? 0;
							memberTotals.set(participantId, currentTotal + share);
						}
					}
				}

				const sharedAmounts = Array.from(memberTotals.entries()).map(
					([userId, amount]) => ({ userId, amount }),
				);

				createTransaction({
					data: {
						amount: Number.parseFloat(value.amount),
						name: value.transactionName,
						splitType: value.splitType,
						groupId:
							value.groupId === ""
								? undefined
								: (value.groupId as Id<"groups">),
						groupName: value.groupName,
						participants: value.selectedMembers.map((member) => ({
							_id: member._id,
							name: member.name,
							email: member.email,
							phoneNumber: member.phoneNumber,
						})),
						items: value.items,
						sharedAmounts,
					},
				});
			}

			form.reset();
			router.back();
		},
	});

	const openSelect = () => {
		triggerRef.current?.open();
	};

	const closeSelect = () => {
		triggerRef.current?.close();
	};

	const selectedMembers = useStore(
		form.store,
		(state) => state.values.selectedMembers,
	);

	const payer = useStore(form.store, (state) => state.values.payer);
	const splitType = useStore(form.store, (state) => state.values.splitType);

	return (
		<Container>
			<ScrollView>
				<View className="gap-4 pb-8">
					<View className="flex-row items-center justify-between pb-4">
						<TouchableOpacity
							onPress={() => {
								router.replace("/(tabs)");
							}}
						>
							<ChevronLeft className="text-primary" />
						</TouchableOpacity>
						<Text className="font-geist-bold text-2xl tracking-tighter">
							Create Transaction
						</Text>
						<ChevronLeft className="invisible" />
					</View>

					{/* MARK: Group Name
					 */}
					<form.Field name="groupName">
						{(field) => {
							return (
								<>
									<Label>Group Name</Label>
									<Input
										placeholder="Select Group or Create New"
										onFocus={openSelect}
										onBlur={closeSelect}
										onChangeText={(text) => {
											field.handleChange(text);
											form.setFieldValue("groupId", "");
										}}
										value={field.state.value}
									/>
									{/* MARK: Group Select
									 */}
									<Select
										className="-mt-4"
										defaultValue={{
											value: form.state.values.groupId,
											label: form.state.values.groupName,
										}}
										onValueChange={(option) => {
											form.setFieldValue("groupId", option?.value ?? "");
											const group = groups?.find(
												(group) => group._id === option?.value,
											);

											if (!group) return;

											form.setFieldValue("members", group.members);

											form.setFieldValue("groupName", group.name);
										}}
										onOpenChange={(open) => {
											if (!open) {
												dismissKeyboard();
											}
										}}
									>
										<SelectPrimitive.Trigger ref={triggerRef} />
										<SelectContent
											className="w-full"
											insets={{ left: 20, right: 20 }}
										>
											<form.Subscribe
												selector={(state) => state.values.groupName}
											>
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
											</form.Subscribe>
										</SelectContent>
									</Select>
								</>
							);
						}}
					</form.Field>
					{/* MARK: Transaction Name
					 */}
					<form.Field name="transactionName">
						{(field) => {
							return (
								<>
									<Label>Transaction Name</Label>
									<Input
										placeholder="Transaction Name"
										onChangeText={field.handleChange}
										value={field.state.value}
										clearButtonMode="while-editing"
									/>
								</>
							);
						}}
					</form.Field>
					{/* MARK: Amount
					 */}
					<form.Field name="amount">
						{(field) => {
							return (
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
							);
						}}
					</form.Field>

					{/* MARK: Members
					 */}
					<form.Subscribe selector={(state) => state.values.members}>
						{(members) => {
							return (
								<>
									<View className="flex-row items-center justify-between">
										<Label>Members</Label>
										<Button
											onPress={() => {
												setOpenFormSheet(0);
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
														(selectedMember) =>
															selectedMember._id === member._id,
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

					{/* MARK: Split Type
					 */}
					<form.Subscribe selector={(state) => state.values.splitType}>
						{(splitType) => {
							return (
								<>
									<Label>Split Type</Label>
									<View className="flex-row items-center rounded-full bg-sidebar p-1">
										{SPLIT_TYPES.map((type) => {
											return (
												<TouchableOpacity
													key={type.value}
													onPress={() => {
														form.setFieldValue("splitType", type.value);
													}}
													className={cn(
														"flex-1 items-center justify-center rounded-full py-2 shadow-inherit",
														splitType === type.value && "bg-background",
													)}
												>
													<Text>{type.label}</Text>
												</TouchableOpacity>
											);
										})}
									</View>

									{/* MARK: EQUAL
									 */}

									{splitType === "EQUAL" && (
										<>
											<Label>Payer</Label>
											<View className="flex-row items-center gap-2">
												{selectedMembers.map((member) => {
													const selected = payer === member._id;

													return (
														<TouchableOpacity
															key={`selectedMember-${member._id}`}
															onPress={() => {
																form.setFieldValue("payer", member._id);
															}}
														>
															<Avatar
																alt={member.name}
																className={cn(
																	selected && "border-4 border-primary",
																)}
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
										</>
									)}

									{/* MARK: PERCENTAGE
									 */}

									{splitType === "PERCENTAGE" && (
										<>
											<Label>Percentage</Label>
											<form.Field name="percentages" mode="array">
												{(field) =>
													selectedMembers.map((member, i) => {
														return (
															<View
																className="flex-row items-center justify-between"
																key={`selectedMember-${member._id}`}
															>
																<View className="flex-1 flex-row items-center gap-3">
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
																	<Text
																		className="max-w-32 font-geist-semibold"
																		ellipsizeMode="tail"
																		numberOfLines={1}
																	>
																		{member.name}
																	</Text>
																</View>
																<form.Field
																	name={`percentages[${i}].percentage`}
																>
																	{(field) => {
																		return (
																			<Input
																				placeholder="%"
																				className="flex-1"
																				keyboardType="numeric"
																				value={field.state.value?.toString()}
																				onChangeText={(value) => {
																					field.handleChange(Number(value));
																				}}
																				clearButtonMode="while-editing"
																			/>
																		);
																	}}
																</form.Field>
															</View>
														);
													})
												}
											</form.Field>
											{selectedMembers.length === 0 && (
												<Text className="text-muted-foreground italic">
													Please select at least one member
												</Text>
											)}
										</>
									)}

									{/* MARK: FIXED
									 */}

									{splitType === "FIXED" && (
										<>
											<Label>Fixed amounts</Label>
											<form.Field name="fixedAmounts" mode="array">
												{(field) =>
													selectedMembers.map((member, i) => {
														return (
															<View
																className="flex-row items-center justify-between"
																key={`selectedMember-${member._id}`}
															>
																<View className="flex-1 flex-row items-center gap-3">
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
																	<Text
																		className="max-w-32 font-geist-semibold"
																		ellipsizeMode="tail"
																		numberOfLines={1}
																	>
																		{member.name}
																	</Text>
																</View>
																<form.Field name={`fixedAmounts[${i}].amount`}>
																	{(field) => {
																		return (
																			<Input
																				placeholder="Enter amount"
																				className="flex-1"
																				keyboardType="numeric"
																				value={field.state.value?.toString()}
																				onChangeText={(value) => {
																					field.handleChange(Number(value));
																				}}
																				clearButtonMode="while-editing"
																			/>
																		);
																	}}
																</form.Field>
															</View>
														);
													})
												}
											</form.Field>
											{selectedMembers.length === 0 && (
												<Text className="text-muted-foreground italic">
													Please select at least one member
												</Text>
											)}
										</>
									)}

									{/* MARK: SHARED
									 */}
									{splitType === "SHARED" && (
										<>
											<View className="flex-row items-center justify-between">
												<Label>Shared amounts</Label>
												<Button
													onPress={() => {
														form.pushFieldValue("items", {
															name: "",
															amount: 0,
															participantIds: [],
														});
													}}
													disabled={selectedMembers.length === 0}
													className="flex-row items-center gap-2 border-2 border-sidebar-foreground bg-sidebar"
												>
													<Plus className="text-sidebar-foreground" />
													<Text className="font-geist-semibold text-sidebar-foreground">
														Add Item
													</Text>
												</Button>
											</View>

											{selectedMembers.length === 0 ? (
												<Text className="text-muted-foreground italic">
													Please select at least one member
												</Text>
											) : (
												<>
													{/* MARK: Item List Header
													 */}
													<View className="flex-row items-center justify-between gap-2">
														<View className="flex-1">
															<Label>Name</Label>
														</View>
														<View className="w-32">
															<Label>Amount</Label>
														</View>
														<Button
															disabled
															className="group invisible aspect-square rounded-full active:bg-destructive/20"
														>
															<Plus />
														</Button>
														<Button
															disabled
															className="group invisible aspect-square rounded-full active:bg-destructive/20"
														>
															<Plus />
														</Button>
													</View>
													{/* MARK: Item List
													 */}
													<form.Field name="items" mode="array">
														{(field) =>
															field.state.value?.map((item, i) => {
																return (
																	<View
																		key={`shared-item-${
																			// biome-ignore lint/suspicious/noArrayIndexKey: Can not generate id for each field
																			i
																		}`}
																		className="gap-1"
																	>
																		<View className="flex-row items-center justify-between gap-2">
																			<form.Field name={`items[${i}].name`}>
																				{(field) => {
																					return (
																						<Input
																							placeholder="Name"
																							className="flex-1"
																							value={field.state.value}
																							onChangeText={(value) => {
																								field.handleChange(value);
																							}}
																							clearButtonMode="while-editing"
																						/>
																					);
																				}}
																			</form.Field>
																			<form.Field name={`items[${i}].amount`}>
																				{(field) => {
																					return (
																						<Input
																							placeholder="Amount"
																							className="w-32"
																							keyboardType="numeric"
																							value={field.state.value?.toString()}
																							onChangeText={(value) => {
																								field.handleChange(
																									Number(value),
																								);
																							}}
																							clearButtonMode="while-editing"
																						/>
																					);
																				}}
																			</form.Field>
																			<Button
																				className="group aspect-square rounded-full"
																				onPress={() => setSelectedShareField(i)}
																			>
																				<Plus className="h-4 w-4 text-primary-foreground" />
																			</Button>
																			<Button
																				variant={"ghost"}
																				className="group aspect-square rounded-full active:bg-destructive/20"
																				onPress={() =>
																					form.removeFieldValue("items", i)
																				}
																			>
																				<Trash className="h-4 w-4 text-foreground group-active:text-destructive" />
																			</Button>
																		</View>
																		<form.Field
																			name={`items[${i}].participantIds`}
																		>
																			{(field) => {
																				return (
																					<Text className="text-muted-foreground text-sm italic">
																						{field.state.value?.length}{" "}
																						participants
																					</Text>
																				);
																			}}
																		</form.Field>
																	</View>
																);
															})
														}
													</form.Field>
												</>
											)}
										</>
									)}
								</>
							);
						}}
					</form.Subscribe>

					{/* MARK: Submit Button
					 */}
					<Button onPress={() => form.handleSubmit()}>
						<Text>Submit</Text>
					</Button>
				</View>
			</ScrollView>
			{/* MARK: Add Member Form Sheet
			 */}
			<AddMemberFormSheet
				index={openFormSheet}
				onClose={() => setOpenFormSheet(-1)}
				onSubmit={(users) => {
					setOpenFormSheet(-1);

					for (const user of users) {
						if (
							form.state.values.members.some(
								(member) => member._id === user._id,
							)
						) {
							continue;
						}

						form.pushFieldValue("members", user);
					}
				}}
			/>

			{splitType === "SHARED" && <AddMemberToShareFormSheet form={form} />}
		</Container>
	);
};

export default CreateTransactionForm;
