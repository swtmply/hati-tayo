import { useStore } from "@tanstack/react-form";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { withForm } from "~/hooks/useAppForm";
import { createTransactionFormOpts } from "~/lib/form/schemas/transactions-schema";
import { cn } from "~/lib/utils";
import useSelectedShareFieldStore from "~/store/share-split";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Plus, Sparkles, Trash } from "../ui/icons";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Text } from "../ui/text";

const SPLIT_TYPES = [
	{ value: "EQUAL", label: "Equal" },
	{ value: "PERCENTAGE", label: "Percent" },
	{ value: "FIXED", label: "Fixed" },
	{ value: "SHARED", label: "Shared" },
];

const SplitTypeTabs = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		return (
			<form.Subscribe selector={(state) => state.values.splitType}>
				{(splitType) => {
					return (
						<>
							<Tabs
								value={splitType}
								onValueChange={(value) =>
									form.setFieldValue("splitType", value)
								}
								className="gap-4"
							>
								<TabsList className="flex-row items-center rounded-full bg-sidebar p-1 dark:bg-secondary">
									{SPLIT_TYPES.map((type) => {
										return (
											<TabsTrigger
												key={type.value}
												value={type.value}
												asChild
												className="flex-1 rounded-full"
											>
												<TouchableOpacity
													onPress={() => {
														form.setFieldValue("splitType", type.value);
													}}
													className={cn(
														"items-center justify-center rounded-full py-2 shadow-inherit",
														splitType === type.value && "bg-background",
													)}
												>
													<Text>{type.label}</Text>
												</TouchableOpacity>
											</TabsTrigger>
										);
									})}
								</TabsList>
								<TabsContent value="PERCENTAGE" className="gap-4">
									<PercentageSplitTab form={form} />
								</TabsContent>
								<TabsContent value="FIXED" className="gap-4">
									<FixedSplitTab form={form} />
								</TabsContent>
								<TabsContent value="SHARED" className="gap-4">
									<SharedSplitTab form={form} />
								</TabsContent>
							</Tabs>
						</>
					);
				}}
			</form.Subscribe>
		);
	},
});

const PercentageSplitTab = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		const selectedMembers = useStore(
			form.store,
			(state) => state.values.selectedMembers,
		);

		return (
			<React.Fragment>
				<Label>Percentage</Label>
				<form.Field name="percentages" mode="array">
					{(field) =>
						selectedMembers.map((member, i) => {
							return (
								<React.Fragment key={`selectedMember-${member._id}`}>
									<View className="flex-row items-center justify-between">
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
										<form.Field name={`percentages[${i}].percentage`}>
											{(field) => {
												return (
													<View className="flex-1 flex-row items-center gap-2">
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
														<Button
															onPress={() => {
																const percentages =
																	form.getFieldValue("percentages") || [];
																const totalPercentage = percentages.reduce(
																	(acc, p, index) => {
																		if (index !== i) {
																			return acc + (p.percentage || 0);
																		}
																		return acc;
																	},
																	0,
																);
																const remainingPercentage =
																	100 - totalPercentage;
																field.handleChange(remainingPercentage);
															}}
															variant="ghost"
															size="icon"
															className="group aspect-square rounded-full active:bg-primary/20"
														>
															<Sparkles className="h-4 w-4 text-foreground group-active:text-primary" />
														</Button>
														{field.state.meta.errors &&
														field.state.meta.errors.length > 0 ? (
															<Text className="text-destructive text-sm">
																{field.state.meta.errors
																	.map((error) => error)
																	.join(", ")}
															</Text>
														) : null}
													</View>
												);
											}}
										</form.Field>
									</View>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 ? (
										<Text className="text-destructive text-sm">
											{field.state.meta.errors.map((error) => error).join(", ")}
										</Text>
									) : null}
								</React.Fragment>
							);
						})
					}
				</form.Field>
				{selectedMembers.length === 0 && (
					<Text className="text-muted-foreground italic">
						Please select at least one member
					</Text>
				)}
			</React.Fragment>
		);
	},
});

const FixedSplitTab = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		const selectedMembers = useStore(
			form.store,
			(state) => state.values.selectedMembers,
		);

		return (
			<React.Fragment>
				<Label>Fixed amounts</Label>
				<form.Field name="fixedAmounts" mode="array">
					{(field) =>
						selectedMembers.map((member, i) => {
							return (
								<React.Fragment key={`selectedMember-${member._id}`}>
									<View className="flex-row items-center justify-between">
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
													<View className="flex-1 flex-row items-center gap-2">
														<Input
															placeholder="Enter amount"
															className="flex-1"
															keyboardType="numeric"
															value={field.state.value?.toString()}
															onChangeText={(value) => {
																field.handleChange(Number(value));
															}}
														/>
														<Button
															onPress={() => {
																const totalAmount =
																	form.getFieldValue("amount") || 0;
																const fixedAmounts =
																	form.getFieldValue("fixedAmounts") || [];
																const totalFixed = fixedAmounts.reduce(
																	(acc, f, index) => {
																		if (index !== i) {
																			return acc + (f.amount || 0);
																		}
																		return acc;
																	},
																	0,
																);
																const remainingAmount =
																	Number(totalAmount) - totalFixed;
																field.handleChange(remainingAmount);
															}}
															variant="ghost"
															size="icon"
															className="group aspect-square rounded-full active:bg-primary/20"
														>
															<Sparkles className="h-4 w-4 text-foreground group-active:text-primary" />
														</Button>
														{field.state.meta.errors &&
														field.state.meta.errors.length > 0 ? (
															<Text className="text-destructive text-sm">
																{field.state.meta.errors
																	.map((error) => error)
																	.join(", ")}
															</Text>
														) : null}
													</View>
												);
											}}
										</form.Field>
									</View>
									{field.state.meta.errors &&
									field.state.meta.errors.length > 0 ? (
										<Text className="text-destructive text-sm">
											{field.state.meta.errors.map((error) => error).join(", ")}
										</Text>
									) : null}
								</React.Fragment>
							);
						})
					}
				</form.Field>
				{selectedMembers.length === 0 && (
					<Text className="text-muted-foreground italic">
						Please select at least one member
					</Text>
				)}
			</React.Fragment>
		);
	},
});

const SharedSplitTab = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		const selectedMembers = useStore(
			form.store,
			(state) => state.values.selectedMembers,
		);

		const setSelectedShareField = useSelectedShareFieldStore(
			(state) => state.setSelectedShareField,
		);

		return (
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
						<View className="-mb-4 flex-row items-center justify-between gap-2">
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
										<React.Fragment
											key={`shared-item-${
												// biome-ignore lint/suspicious/noArrayIndexKey: Can not generate id for each field
												i
											}`}
										>
											<View className="gap-1">
												<View className="flex-row items-center justify-between gap-2">
													<form.Field name={`items[${i}].name`}>
														{(field) => {
															return (
																<Input
																	placeholder="Name"
																	className={cn(
																		"flex-1",
																		field.state.meta.errors &&
																			field.state.meta.errors.length > 0
																			? "border-destructive"
																			: "",
																	)}
																	value={field.state.value}
																	onChangeText={(value) => {
																		field.handleChange(value);
																	}}
																/>
															);
														}}
													</form.Field>
													<form.Field name={`items[${i}].amount`}>
														{(field) => {
															return (
																<Input
																	placeholder="Amount"
																	className={cn(
																		"w-32",
																		field.state.meta.errors &&
																			field.state.meta.errors.length > 0
																			? "border-destructive"
																			: "",
																	)}
																	keyboardType="numeric"
																	value={field.state.value?.toString()}
																	onChangeText={(value) => {
																		field.handleChange(Number(value));
																	}}
																/>
															);
														}}
													</form.Field>
													<Button
														className="group aspect-square rounded-full"
														onPress={() => {
															setSelectedShareField(i);
														}}
													>
														<Plus className="h-4 w-4 text-primary-foreground" />
													</Button>
													<Button
														variant={"ghost"}
														className="group aspect-square rounded-full active:bg-destructive/20"
														onPress={() => form.removeFieldValue("items", i)}
													>
														<Trash className="h-4 w-4 text-foreground group-active:text-destructive" />
													</Button>
												</View>
												<form.Field name={`items[${i}].participantIds`}>
													{(field) => {
														return (
															<View className="flex-row items-center gap-2">
																<Text className="text-muted-foreground text-sm italic">
																	{field.state.value?.length} participants
																</Text>
																{field.state.meta.errors &&
																field.state.meta.errors.length > 0 ? (
																	<Text className="text-destructive text-sm italic">
																		{field.state.meta.errors
																			.map((error) => error)
																			.join(", ")}
																	</Text>
																) : null}
															</View>
														);
													}}
												</form.Field>
											</View>
											{field.state.meta.errors &&
											field.state.meta.errors.length > 0 ? (
												<Text className="text-destructive text-sm">
													{field.state.meta.errors
														.map((error) => error)
														.join(", ")}
												</Text>
											) : null}
										</React.Fragment>
									);
								})
							}
						</form.Field>
					</>
				)}
			</>
		);
	},
});

export default SplitTypeTabs;
