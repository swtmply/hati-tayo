import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Container } from "~/components/container";
import { Text } from "~/components/ui/text";

const ProfilePage = () => {
	const user = useQuery(api.auth.get);

	return (
		<Container>
			<Text className="mb-2 font-geist-bold text-3xl text-foreground">
				Profile
			</Text>

			<View className="items-center justify-center gap-2">
				<Image
					style={{
						aspectRatio: 1,
						width: 100,
						height: 100,
						borderRadius: 100,
					}}
					source={user?.image}
					transition={1000}
				/>
			</View>

			<Text className="justify-center ">{user?.name}</Text>
		</Container>
	);
};

export default ProfilePage;
