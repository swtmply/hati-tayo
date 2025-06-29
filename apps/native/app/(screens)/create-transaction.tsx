import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Doc, Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import * as SelectPrimitive from "@rn-primitives/select";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import AddMemberFormSheet from "~/components/add-member-form-sheet";
import { Container } from "~/components/container";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { ChevronLeft, CircleCheck, Plus } from "~/components/ui/icons";
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
	const user = useQuery(api.users.get);
	const createTransaction = useMutation(api.transactions.createTransaction);

	// MARK: Form
	const Form = useAppForm({
		defaultValues: {
			groupName: "",
			groupId: "",
			transactionName: "",
			amount: "",
			payer: "",
			members: [{ _id: "", name: "", image: "" }],
			selectedMembers: [{ _id: "", name: "", image: "" }],
			splitDetails: [] as Array<{ userId:string; value: string }>,
			splitType: "EQUAL",
		},
		validators: {
			onSubmit: z.object({
				groupName: z.string().min(1, "Group name is required."),
				groupId: z.string(), // Not directly validated with message, linked to groupName
				transactionName: z.string().min(1, "Transaction name is required."),
				splitType: z.string(),
				amount: z
					.string()
					.min(1, "Amount is required.")
					.refine(
						(val) =>
							!Number.isNaN(Number.parseFloat(val)) &&
							Number.parseFloat(val) > 0,
						{
							message: "Amount must be a positive number.",
						},
					),
				payer: z.string().min(1, "A payer must be selected."),
				members: z.array(
					z.object({
						_id: z.string(),
						name: z.string(),
						image: z.string(),
						email: z.string().optional(),
						phoneNumber: z.string().optional(),
					}),
				),
				selectedMembers: z
					.array(
						z.object({
							_id: z.string(),
							name: z.string(),
							image: z.string(),
							email: z.string().optional(),
							phoneNumber: z.string().optional(),
						}),
					)
					.min(1, "At least one member must be involved in the transaction."),
				splitDetails: z.array(
					z.object({
						userId: z.string(),
						value: z.string(),
					}),
				),
			})
			.superRefine((data, ctx) => {
				// Validation for PERCENTAGE
				if (data.splitType === "PERCENTAGE") { // Use data.splitType
					if (data.splitDetails.length !== data.selectedMembers.length) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Percentage must be specified for all selected members.",
							path: ["splitDetails"],
						});
						return;
					}
					const totalPercentage = data.splitDetails.reduce((sum, detail) => {
						const percentage = Number.parseFloat(detail.value);
						return sum + (Number.isNaN(percentage) ? 0 : percentage);
					}, 0);
					if (totalPercentage !== 100) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Total percentage must be 100%. Current: ${totalPercentage}%`,
							path: ["splitDetails"],
						});
					}
					data.splitDetails.forEach((detail, index) => {
						if (Number.parseFloat(detail.value) <=0) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "Percentage must be greater than 0.",
								path: [`splitDetails`, index.toString(), "value"],
							});
						}
					});
				}
				// Validation for FIXED
				if (data.splitType === "FIXED") { // Use data.splitType
					if (data.splitDetails.length !== data.selectedMembers.length) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Fixed amount must be specified for all selected members.",
							path: ["splitDetails"],
						});
						return;
					}
					const totalFixedAmount = data.splitDetails.reduce((sum, detail) => {
						const amount = Number.parseFloat(detail.value);
						return sum + (Number.isNaN(amount) ? 0 : amount);
					},0);
					const transactionAmount = Number.parseFloat(data.amount);
					if (totalFixedAmount !== transactionAmount) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `Total fixed amounts must equal transaction amount (${transactionAmount}). Current: ${totalFixedAmount}`,
							path: ["splitDetails"],
						});
					}
					data.splitDetails.forEach((detail, index) => {
						if (Number.parseFloat(detail.value) <=0) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "Fixed amount must be greater than 0.",
								path: [`splitDetails`, index.toString(), "value"],
							});
						}
					});
				}
				// Validation for SHARES
				if (data.splitType === "SHARES") { // Use data.splitType
					if (data.splitDetails.length !== data.selectedMembers.length) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Shares must be specified for all selected members.",
							path: ["splitDetails"],
						});
						return;
					}
					const totalShares = data.splitDetails.reduce((sum, detail) => {
						const shares = Number.parseFloat(detail.value);
						return sum + (Number.isNaN(shares) ? 0 : shares);
					}, 0);
					if (totalShares <= 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Total shares must be greater than 0.",
							path: ["splitDetails"],
						});
					}
					data.splitDetails.forEach((detail, index) => {
						if (Number.parseFloat(detail.value) <=0) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: "Shares must be greater than 0.",
								path: [`splitDetails`, index.toString(), "value"],
							});
						}
					});
				}
			}),
		},
		// MARK: onSubmit
		onSubmit: ({ value }) => {
			const participants = [] as Doc<"users">[];
			for (const member of value.selectedMembers) {
				if (member._id === "") continue;

				participants.push(member as Doc<"users">);
			}

			let finalSplitDetails;
			if (value.splitType === "PERCENTAGE") { // Use value.splitType
				finalSplitDetails = value.splitDetails.map(detail => ({
					userId: detail.userId as Id<"users">,
					percentage: Number.parseFloat(detail.value),
				}));
			} else if (value.splitType === "FIXED") { // Use value.splitType
				finalSplitDetails = value.splitDetails.map(detail => ({
					userId: detail.userId as Id<"users">,
					amount: Number.parseFloat(detail.value),
				}));
			} else if (value.splitType === "SHARES") { // Use value.splitType
				finalSplitDetails = value.splitDetails.map(detail => ({
					userId: detail.userId as Id<"users">,
					shares: Number.parseFloat(detail.value),
				}));
			}


			createTransaction({
				name: value.transactionName,
				groupName: value.groupName === "" ? undefined : value.groupName,
				groupId:
					value.groupId === "" ? undefined : (value.groupId as Id<"groups">),
				payerId: value.payer as Id<"users">,
				participants: participants.map((user) => ({
					_id: user._id,
					name: user.name,
					email: user.email,
					phoneNumber: user.phoneNumber,
				})),
				amount: Number(value.amount),
				splitType: value.splitType, // Use value.splitType
				splitDetails: finalSplitDetails,
			});
			Form.reset(); // This will reset splitType to "EQUAL" as defined in defaultValues
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
			<Form.Field name="groupName">
				{(field) => (
					<>
						<Label>Group Name</Label>
						<Input
							placeholder="Select Group or Create New"
							onFocus={openSelect}
							onBlur={closeSelect}
							onChangeText={(text) => {
								field.handleChange(text);
								Form.setFieldValue("groupId", "");
							}}
							value={field.state.value}
							clearButtonMode="while-editing"
						/>
						{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
							<Text className="text-destructive text-sm">
								{field.state.meta.errors
									.map((error) => error?.message)
									.join(", ")}
							</Text>
						) : null}
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
						{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
							<Text className="text-destructive text-sm">
								{field.state.meta.errors
									.map((error) => error?.message)
									.join(", ")}
							</Text>
						) : null}
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
						{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
							<Text className="text-destructive text-sm">
								{field.state.meta.errors
									.map((error) => error?.message)
									.join(", ")}
							</Text>
						) : null}
					</>
				)}
			</Form.Field>

			{/* MARK: Split Type Selection
			 */}
			<View className="my-4">
				<Label className="mb-2">Split Type</Label>
				<Form.Subscribe selector={(state) => state.values.splitType}>
					{(currentSplitType) => (
						<View className="flex-row justify-around rounded-lg bg-muted p-1">
							{(["EQUAL", "PERCENTAGE", "FIXED", "SHARES"] as const).map(
								(type) => (
									<Pressable
										key={type}
										onPress={() => Form.setFieldValue("splitType", type)}
										className={cn(
											"flex-1 items-center rounded-md py-2",
											currentSplitType === type && "bg-background shadow-sm",
										)}
									>
										<Text
											className={cn(
												"font-geist-medium",
												currentSplitType === type
													? "text-foreground"
													: "text-muted-foreground",
											)}
										>
											{type.charAt(0) + type.slice(1).toLowerCase()}
										</Text>
									</Pressable>
								),
							)}
						</View>
					)}
				</Form.Subscribe>
			</View>

			{/* MARK: Select Member List
			 */}
			<View className="flex flex-col gap-4">
				<Form.Field name="selectedMembers">
					{(field) => (
						<>
							<Label>Members</Label>
							{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
								<Text className="mb-2 text-destructive text-sm">
									{field.state.meta.errors
										.map((error) => error?.message)
										.join(", ")}
								</Text>
							) : null}
						</>
					)}
				</Form.Field>
				<Form.Subscribe selector={(state) => state.values.groupId}>
					{(groupId) => {
						return (
							<Form.Subscribe
								selector={(state) => state.values.selectedMembers}
							>
								{(selectedMembers) => {
									const userIsSelected = selectedMembers.some(
										(selectedMember) => selectedMember._id === user?._id,
									);

									return (
										<Form.Subscribe selector={(state) => state.values.members}>
											{(members) => {
												const groupMembers = groups?.find(
													(group) => group._id === groupId,
												)?.members;

												const newMembers = members.concat(groupMembers ?? []);

												const userInGroup = newMembers.some(
													(member) => member._id === user?._id,
												);

												return (
													<View className="flex-col gap-2">
														{/* User
														 */}
														{!userInGroup && (
															<TouchableOpacity
																className="flex-row items-center justify-between"
																onPress={() => {
																	if (userIsSelected) {
																		Form.removeFieldValue(
																			"selectedMembers",
																			selectedMembers.findIndex(
																				(selectedMember) =>
																					selectedMember._id === user?._id,
																			),
																		);
																	} else {
																		Form.pushFieldValue(
																			"selectedMembers",
																			user as Doc<"users">,
																		);
																	}
																}}
															>
																<View className="flex-row items-center gap-2">
																	<Avatar alt={user?.name || ""}>
																		<AvatarImage
																			source={{
																				uri: user?.image,
																			}}
																		/>
																	</Avatar>

																	<Text className=" font-geist-semibold">
																		{user?.name}
																	</Text>
																</View>
																<CircleCheck
																	className={cn(
																		"text-foreground",
																		userIsSelected &&
																			"rounded-full bg-secondary text-primary",
																	)}
																/>
															</TouchableOpacity>
														)}
														{/* MARK: Group/Anonymous Members
														 */}
														{newMembers?.map((member) => {
															if (member._id === "") return null;

															const selected = selectedMembers.some(
																(selectedMember) =>
																	selectedMember._id === member._id,
															);

															return (
																<TouchableOpacity
																	key={member._id}
																	onPress={() => {
																		if (selected) {
																			Form.removeFieldValue(
																				"selectedMembers",
																				selectedMembers.findIndex(
																					(selectedMember) =>
																						selectedMember._id === member._id,
																				),
																			);
																		} else {
																			Form.pushFieldValue(
																				"selectedMembers",
																				member,
																			);
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
																			"text-foreground",
																			selected &&
																				"rounded-full bg-secondary text-primary",
																		)}
																	/>
																</TouchableOpacity>
															);
														})}
														{/* MARK: Add Member Button
														 */}
														<Pressable
															onPress={() => {
																setOpenFormSheet(0);
															}}
															className="h-12 flex-row items-center justify-center rounded-full border border-neutral-400 border-dashed"
														>
															<Plus className="text-neutral-400" />
															<Text className="text-neutral-400">
																Add Member
															</Text>
														</Pressable>
													</View>
												);
											}}
										</Form.Subscribe>
									);
								}}
							</Form.Subscribe>
						);
					}}
				</Form.Subscribe>
			</View>


			{/* MARK: Split Detail Inputs
			 */}
			<Form.Subscribe selector={(state) => state.values.splitType}>
				{(currentSplitType) =>
					currentSplitType !== "EQUAL" && (
						<View className="my-4 flex flex-col gap-2">
							<Label>
								Split by{" "}
								{currentSplitType.charAt(0) +
									currentSplitType.slice(1).toLowerCase()}
							</Label>
							<Form.Field name="splitDetails">
								{(field) => (
							<>
								{field.state.meta.touched && field.state.meta.errors && field.state.meta.errors.length > 0 ? (
									<Text className="mb-2 text-destructive text-sm">
										{/* Only show the first error for general messages, specific errors shown by inputs */}
										{field.state.meta.errors
											.filter(e => !(e?.message.startsWith("Percentage must be greater") || e?.message.startsWith("Fixed amount must be greater") || e?.message.startsWith("Shares must be greater")))
											.map((error) => error?.message)
											.join(", ")}
									</Text>
								) : null}
							</>
						)}
					</Form.Field>
					<Form.Subscribe selector={(state) => state.values.selectedMembers}>
						{(selectedMembers) => {
							// Update splitDetails whenever selectedMembers or form's splitType change
							React.useEffect(() => {
								const currentSplitTypeFromForm = Form.getFieldValue("splitType");
								const newSplitDetails = selectedMembers
									.filter(member => member._id !== "") // Filter out placeholder member
									.map(member => ({
										userId: member._id,
										value: "", // Always reset to empty for simplicity when members or type change
									}));
								Form.setFieldValue("splitDetails", newSplitDetails);
								Form.validateField("splitDetails");
							}, [selectedMembers, Form.state.values.splitType]); // Depend on form's splitType

							if (selectedMembers.length === 0 || (selectedMembers.length === 1 && selectedMembers[0]._id === "")) {
								return (
									<Text className="text-center text-neutral-400">
										Please select members to split with.
									</Text>
								);
							}

							return selectedMembers.map((member, index) => {
								if (member._id === "") return null;
								return (
									<Form.Field key={member._id} name={`splitDetails[${index}].value`}>
										{(field) => (
											<View className="flex-row items-center gap-2">
												<Avatar alt={member.name} className="h-8 w-8">
													<AvatarImage source={{ uri: member.image }} />
												</Avatar>
												<Text className="w-1/3 flex-shrink font-geist-medium" numberOfLines={1} ellipsizeMode="tail">
													{member.name}
												</Text>
												<Input
													placeholder={
														selectedSplitType === "PERCENTAGE"
															? "%"
															: selectedSplitType === "FIXED"
																? "Amount"
																: "Shares"
													}
													onChangeText={(text) => {
														const numericValue = text.replace(/[^0-9.]/g, "");
														// Ensure the specific item in splitDetails is updated
														const updatedDetails = Form.state.values.splitDetails.map((detail, i) =>
															i === index ? { ...detail, value: numericValue } : detail
														);
														Form.setFieldValue("splitDetails", updatedDetails);
													}}
													value={field.state.value} // Use field.state.value directly
													keyboardType="numeric"
													className="flex-1"
												/>
												{field.state.meta.touched && field.state.meta.errors && field.state.meta.errors.length > 0 ? (
													<Text className="text-destructive text-xs w-full">
														{field.state.meta.errors.join(", ")}
													</Text>
												) : null}
											</View>
										)}
									</Form.Field>
								);
							});
						}}
					</Form.Subscribe>
				</View>
			)}
			</Form.Subscribe>

			{/* MARK: Payer
			 */}
			<View className="flex flex-col gap-4">
				<Form.Field name="payer">
					{(field) => (
						<>
							<Label>Payer</Label>
							{field.state.meta.errors && field.state.meta.errors.length > 0 ? (
								<Text className="mb-2 text-destructive text-sm">
									{field.state.meta.errors
										.map((error) => error?.message)
										.join(", ")}
								</Text>
							) : null}
						</>
					)}
				</Form.Field>
				<Form.Subscribe selector={(state) => state.values.selectedMembers}>
					{(selectedMembers) => {
						if (selectedMembers.length === 1 && selectedMembers[0]._id === "") {
							return (
								<Text className="text-center text-neutral-400">
									Please select a member first
								</Text>
							);
						}

						return (
							<View className="flex-row gap-2">
								<Form.Subscribe selector={(state) => state.values.payer}>
									{(payerId) => {
										return (
											<>
												{/* MARK: Members
												 */}
												{selectedMembers?.map((member) => {
													if (member._id === "") return null;

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
			<Form.Subscribe selector={(state) => state.values.payer}>
				{(payerId) => {
					return (
						<Form.Button
							className="mt-4"
							disabled={payerId === ""}
							onPress={() => {
								Form.handleSubmit();
							}}
						>
							<Text className="font-geist-semibold">Create</Text>
						</Form.Button>
					);
				}}
			</Form.Subscribe>

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
							email: user.email,
							phoneNumber: user.phoneNumber,
						})),
					);
				}}
			/>
		</Container>
	);
};

export default CreateTransactionForm;
