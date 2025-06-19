import { api } from "@hati-tayo/backend/convex/_generated/api";
import type { Doc } from "@hati-tayo/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CircleCheck } from "./ui/icons";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";

interface SearchUserComboBoxProps {
	selectedUsers: Doc<"users">[];
	onUserSelect: React.Dispatch<React.SetStateAction<Doc<"users">[]>>;
}

const SearchUserComboBox = ({
	onUserSelect,
	selectedUsers,
}: SearchUserComboBoxProps) => {
	const [searchQuery, setSearchQuery] = React.useState("");

	const searchUser = useQuery(api.users.searchUser, {
		query: searchQuery,
	});

	return (
		<View className="flex-1 flex-col gap-4">
			<Label>Selected Users:</Label>
			<View className="flex flex-row gap-2">
				{selectedUsers?.map((user) => {
					return (
						<Avatar alt={user.name} key={user._id}>
							<AvatarImage source={{ uri: user.image }} />
							<AvatarFallback>
								<Text className="text-foreground">{user.name}</Text>
							</AvatarFallback>
						</Avatar>
					);
				})}
				{selectedUsers?.length === 0 && (
					<Text className="text-foreground text-lg">No selected users</Text>
				)}
			</View>
			<Label>Search Email</Label>
			<Input placeholder="Search user by email" onChangeText={setSearchQuery} />
			<ScrollView className="flex flex-col gap-2">
				{searchUser?.map((user) => {
					const selected = selectedUsers?.some((u) => u._id === user._id);
					return (
						<TouchableOpacity
							key={user._id}
							className="flex-row items-center justify-between"
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
								<Text className="text-lg">{user.name}</Text>
							</View>

							{selected && (
								<CircleCheck className="rounded-full bg-primary/50 text-primary" />
							)}
						</TouchableOpacity>
					);
				})}
			</ScrollView>
		</View>
	);
};

export default SearchUserComboBox;
