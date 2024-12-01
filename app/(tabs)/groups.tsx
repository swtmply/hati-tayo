import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Group } from "~/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { useRouter } from "expo-router";
import { Skeleton } from "~/components/ui/skeleton";

const GroupsPage = () => {
  const { dbUser } = useDBUser();
  const router = useRouter();

  const {
    data: groups,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["groups", dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${dbUser?.id}`);

      return response.data as Group[];
    },
  });

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      <Text className="text-4xl font-extrabold mt-4">Groups</Text>

      {isLoading ? (
        <View className="gap-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </View>
      ) : (
        groups && (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item: group }) => (
              <TouchableOpacity
                onPress={() => {
                  router.push(`/(details)/groups/${group.id}`);
                }}
                key={group.id}
                className="bg-background"
              >
                <View className="border border-border rounded-md p-4 flex-row items-center justify-between">
                  <View className="gap-3 flex-1">
                    <Text className="text-2xl font-bold">{group.name}</Text>
                    <View className="flex-row gap-1">
                      {group.users.map(({ user }) => (
                        <Avatar key={user.id} alt={user.name}>
                          <AvatarImage
                            source={{
                              uri: user.image,
                            }}
                          />
                        </Avatar>
                      ))}
                    </View>
                  </View>
                  <View>
                    <Text className="text-2xl font-bold text-right">
                      {group.hatianCount}
                    </Text>
                    <Text className="text-sm text-gray-500">Hatians</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListEmptyComponent={() => (
              <View className="h-32 justify-center">
                <Text className="text-center text-2xl font-bold">
                  No hatians for this user.
                </Text>
              </View>
            )}
          />
        )
      )}

      <View
        className="w-full"
        style={{
          transform: "translateX(150%)",
          zIndex: -999,
          opacity: 0.1,
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <ImageBackground
          source={require("~/assets/images/patterns/pattern-6.png")}
          className="flex-1"
          resizeMode="repeat"
        />
      </View>
    </SafeAreaView>
  );
};

export default GroupsPage;
