import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import type { CreateTransactionResponse } from "@hati-tayo/backend/convex/types";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { Container } from "~/components/container";
import AddMemberFormSheet from "~/components/transaction-form-fields/add-member-form-sheet";
import AddMemberToShareFormSheet from "~/components/transaction-form-fields/add-member-to-share-form-sheet";
import GroupComboBox from "~/components/transaction-form-fields/group-combo-box";
import MemberSelectList from "~/components/transaction-form-fields/member-select-list";
import PayerSelectList from "~/components/transaction-form-fields/payer-select-list";
import SplitTypeTabs from "~/components/transaction-form-fields/split-type-tabs";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useAppForm } from "~/hooks/useAppForm";
import { useKeyboard } from "~/hooks/useKeyboard";
import {
	type SplitMember,
	createTransactionFormOpts,
	splitSchema,
} from "~/lib/form/schemas/transactions-schema";

const CreateTransactionForm = () => {
	const user = useQuery(api.users.get);
	const createTransaction = useMutation(api.transactions.createTransaction);

	const form = useAppForm({
		defaultValues: {
			...createTransactionFormOpts.defaultValues,
			members: [
				{
					_id: user?._id,
					name: user?.name,
					image: user?.image,
					email: user?.email,
					phoneNumber: user?.phoneNumber,
				},
			] as SplitMember[],
		},
		validators: {
			onSubmit: ({ value }) => {
				const result = splitSchema.safeParse(value);
				if (result.success) return undefined;

				const errors: Record<string, string> = {};
				for (const issue of result.error.issues) {
					if (issue.path.length === 0 && value.splitType === "FIXED") {
						errors.fixedAmounts = issue.message;
					}

					if (issue.path.length === 0 && value.splitType === "SHARED") {
						errors.items = issue.message;
					}

					if (issue.path.length === 1) {
						errors[issue.path[0] as string] = issue.message;
					} else {
						const finalPath = issue.path.reduce((acc, curr, index) => {
							if (index === 0) {
								return curr;
							}
							if (typeof curr === "number") {
								return `${acc}[${curr}]`;
							}
							return `${acc}.${curr}`;
						}, "");

						errors[finalPath] = issue.message;
					}
				}

				return {
					fields: errors,
				};
			},
		},
		// MARK: onSubmit
		onSubmit: async ({ value }) => {
			let response: CreateTransactionResponse = {
				ok: false,
				message: "",
			};

			if (value.splitType === "EQUAL") {
				response = await createTransaction({
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
				response = await createTransaction({
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
						payerId: value.payer,
					},
				});
			}

			if (value.splitType === "FIXED") {
				response = await createTransaction({
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
						payerId: value.payer,
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

				response = await createTransaction({
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
						payerId: value.payer,
					},
				});
			}

			if (response?.ok) {
				router.back();

				Toast.show({
					type: "success",
					text1: "Success",
					text2: response?.message,
				});
			} else {
				Toast.show({
					type: "error",
					text1: "Error",
					text2: response?.message,
				});
			}
		},
	});

	const { keyboardHeight, isKeyboardVisible } = useKeyboard();

	return (
		<Container>
			<ScrollView
				style={{ marginBottom: isKeyboardVisible ? keyboardHeight : 0 }}
				showsVerticalScrollIndicator={false}
			>
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

					<GroupComboBox form={form} />

					<form.Field name="transactionName">
						{(field) => {
							return (
								<>
									<Label>Transaction Name</Label>
									<Input
										placeholder="Transaction Name"
										onChangeText={field.handleChange}
										value={field.state.value}
									/>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 ? (
										<Text className="text-destructive text-sm">
											{field.state.meta.errors.map((error) => error).join(", ")}
										</Text>
									) : null}
								</>
							);
						}}
					</form.Field>

					<form.Field name="amount">
						{(field) => {
							return (
								<>
									<Label>Amount</Label>
									<Input
										placeholder="Amount"
										onChangeText={field.handleChange}
										value={field.state.value}
										keyboardType="numeric"
									/>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 ? (
										<Text className="text-destructive text-sm">
											{field.state.meta.errors.map((error) => error).join(", ")}
										</Text>
									) : null}
								</>
							);
						}}
					</form.Field>

					<MemberSelectList form={form} />

					<SplitTypeTabs form={form} />

					<PayerSelectList form={form} />

					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => {
							return (
								<Button
									onPress={() => {
										form.handleSubmit();
									}}
									disabled={isSubmitting}
								>
									<Text>Submit </Text>
								</Button>
							);
						}}
					</form.Subscribe>
				</View>
			</ScrollView>

			<AddMemberFormSheet form={form} />

			<AddMemberToShareFormSheet form={form} />
		</Container>
	);
};

export default CreateTransactionForm;
