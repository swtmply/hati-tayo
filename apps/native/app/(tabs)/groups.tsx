import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { ScrollView, View } from "react-native";
import { Container } from "~/components/container";
import GroupCard, { GroupCardSkeleton } from "~/components/group-card";
import { Text } from "~/components/ui/text";

const GroupsPage = () => {
	const groups = useQuery(api.groups.groupsOfCurrentUser);

	return (
		<Container>
			<Text className="mb-2 font-geist-bold text-3xl text-foreground">
				Home
			</Text>

			<ScrollView className="flex-1">
				<View className="gap-2">
					{groups === undefined
						? [1, 2, 3, 4, 5].map((_, index) => <GroupCardSkeleton key={_} />)
						: groups.map((group) => (
								<GroupCard group={group} key={group._id} />
							))}
				</View>
			</ScrollView>
		</Container>
	);
};

export default GroupsPage;
