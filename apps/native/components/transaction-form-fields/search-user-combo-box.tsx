import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Id } from "@hati-tayo/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import useContacts from "~/hooks/useContacts";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CircleCheck } from "../ui/icons";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import type { CreateUser } from "./add-member-form-sheet";

interface SearchUserComboBoxProps {
	selectedUsers: CreateUser[];
	onUserSelect: React.Dispatch<React.SetStateAction<CreateUser[]>>;
}

const SearchUserComboBox = ({
	onUserSelect,
	selectedUsers,
}: SearchUserComboBoxProps) => {
	const [searchQuery, setSearchQuery] = React.useState("");
	const { contacts, status } = useContacts();

	const searchUser = useQuery(api.users.searchUser, {
		query: searchQuery,
	});

	const filteredContacts = contacts?.filter((contact) => {
		return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
	});

	return (
		<View className="flex-1 flex-col gap-4 bg-background pb-24">
			<Label>Selected Users:</Label>
			<View className="flex flex-row gap-2">
				{selectedUsers?.map((user) => {
					return (
						<Pressable
							key={user._id}
							onPress={() => {
								onUserSelect((prev) => prev.filter((u) => u._id !== user._id));
							}}
						>
							<Avatar alt={user.name}>
								<AvatarImage source={{ uri: user.image }} />
								<AvatarFallback>
									<Text className="text-foreground">{user.name}</Text>
								</AvatarFallback>
							</Avatar>
						</Pressable>
					);
				})}
				{selectedUsers?.length === 0 && (
					<Text className="text-foreground text-lg">No selected users</Text>
				)}
			</View>
			<Label>Search User or Contact</Label>
			<Input
				placeholder="Search for user or contact"
				onChangeText={setSearchQuery}
			/>
			<View className="flex-1 flex-col">
				{searchUser?.map((user) => {
					const selected = selectedUsers?.some((u) => u._id === user._id);
					return (
						<TouchableOpacity
							key={user._id}
							className="mb-4 flex-row items-center justify-between"
							onPress={() => {
								if (selected) {
									onUserSelect((prev) =>
										prev.filter((u) => u._id !== user._id),
									);
									return;
								}
								onUserSelect((prev) => [...prev, user]);
							}}
						>
							<View className="flex-row items-center gap-2">
								<Avatar alt={user.name}>
									<AvatarImage source={{ uri: user.image }} />
									<AvatarFallback>
										<Text className="text-foreground">{user.name}</Text>
									</AvatarFallback>
								</Avatar>
								<View className="flex-col">
									<Text className="font-geist-semibold text-lg leading-none">
										{user.name}
									</Text>
									<Text className="text-muted-foreground text-sm">
										{user.email || user.phoneNumber?.toString() || ""}
									</Text>
								</View>
							</View>

							{selected && (
								<CircleCheck className="rounded-full bg-secondary text-primary" />
							)}
						</TouchableOpacity>
					);
				})}
				{filteredContacts?.map((contact) => {
					const selected = selectedUsers?.some(
						(u) => u.phoneNumber === contact.phoneNumbers?.[0].number,
					);
					const email = contact.emails?.[0].email;
					const phoneNumber = contact.phoneNumbers?.[0].number;
					const image = `https://ui-avatars.com/api/?background=random&name=${contact.name.replace(" ", "+")}`;

					return (
						<TouchableOpacity
							key={contact.id}
							className="mb-4 flex-row items-center justify-between"
							onPress={() => {
								if (selected) {
									onUserSelect((prev) =>
										prev.filter((u) => u._id !== contact.id),
									);
									return;
								}
								onUserSelect((prev) => [
									...prev,
									{
										_id: `contact-${contact.id}` as Id<"users">,
										name: contact.name,
										image,
										email,
										phoneNumber,
										groups: [],
										transactions: [],
										createdAt: new Date().getTime(),
										updatedAt: new Date().getTime(),
									},
								]);
							}}
						>
							<View className="flex-row items-center gap-2">
								<Avatar alt={contact.name}>
									<AvatarImage source={{ uri: image }} />
									<AvatarFallback>
										<Text className="text-foreground">{contact.name}</Text>
									</AvatarFallback>
								</Avatar>
								<View className="flex-col">
									<Text className="font-geist-semibold text-lg leading-none">
										{contact.name}
									</Text>
									<Text className="text-muted-foreground text-sm">
										{email || phoneNumber || ""}
									</Text>
								</View>
							</View>

							{selected && (
								<CircleCheck className="rounded-full bg-secondary text-primary" />
							)}
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};

export default SearchUserComboBox;
