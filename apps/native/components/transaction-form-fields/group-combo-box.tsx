import { api } from "@hati-tayo/backend/convex/_generated/api";
import * as SelectPrimitive from "@rn-primitives/select";
import { useQuery } from "convex/react";
import React from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem } from "~/components/ui/select";
import { withForm } from "~/hooks/useAppForm";
import { useKeyboard } from "~/hooks/useKeyboard";
import { createTransactionFormOpts } from "~/lib/form/schemas/transactions-schema";
import { Text } from "../ui/text";

const GroupComboBox = withForm({
	...createTransactionFormOpts,
	render: ({ form }) => {
		const groups = useQuery(api.groups.groupsOfCurrentUserWithMembers);

		const { dismissKeyboard } = useKeyboard();

		const triggerRef = React.useRef<SelectPrimitive.TriggerRef>(null);

		const openSelect = () => {
			triggerRef.current?.open();
		};

		const closeSelect = () => {
			triggerRef.current?.close();
		};

		return (
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
									<form.Subscribe selector={(state) => state.values.groupName}>
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

export default GroupComboBox;
