import { useAuth } from "@clerk/clerk-expo";
import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { Container } from "~/components/container";
import { ChevronRight } from "~/components/ui/icons";
import { Text } from "~/components/ui/text";

const ProfilePage = () => {
	const user = useQuery(api.auth.get);
	const { signOut } = useAuth();

	const logout = () => {
		signOut();
		router.replace("/");
	};

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

			<Text className="py-2 font-geist-semibold text-muted-foreground text-sm uppercase">
				Personal Information
			</Text>

			<View className="gap-0.5 rounded-lg bg-card shadow">
				<View className="flex-row items-center justify-between border-border border-b px-4 py-2">
					<Text className="font-geist-medium text-card-foreground text-lg">
						Name
					</Text>
					<View className="flex-row items-center gap-2">
						<Text className="text-lg text-muted-foreground">{user?.name}</Text>
						<ChevronRight className="text-muted-foreground" />
					</View>
				</View>
				<View className="flex-row items-center justify-between border-border px-4 py-2">
					<Text className="font-geist-medium text-card-foreground text-lg">
						Email
					</Text>
					<View className="flex-row items-center gap-2">
						<Text className="text-lg text-muted-foreground">{user?.email}</Text>
						<ChevronRight className="text-muted-foreground" />
					</View>
				</View>
			</View>

			<Text className="py-2 font-geist-semibold text-muted-foreground text-sm uppercase">
				Account Settings
			</Text>

			<View className="gap-0.5 rounded-lg bg-card shadow">
				<View className="flex-row items-center justify-between border-border border-b px-4 py-2">
					<Text className="font-geist-medium text-card-foreground text-lg">
						Password
					</Text>
					<View className="flex-row items-center gap-2">
						<Text className="text-lg text-muted-foreground">********</Text>
						<ChevronRight className="text-muted-foreground" />
					</View>
				</View>
				<Pressable
					onPress={logout}
					className="flex-row items-center justify-between border-border px-4 py-2"
				>
					<Text className="font-geist-medium text-destructive text-lg">
						Logout
					</Text>
				</Pressable>
			</View>
		</Container>
	);
};

export default ProfilePage;
