import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Group } from "~/types";

import HatianListItem from "~/components/hatian-list-item";
import { Skeleton } from "~/components/ui/skeleton";

const GroupPage = () => {
  const { dbUser } = useDBUser();
  const { groupId } = useLocalSearchParams();

  const {
    data: group,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["group", groupId, dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${dbUser?.id}/${groupId}`);

      return response.data as Group;
    },
    enabled: !!dbUser,
  });

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      {isLoading ? (
        <Skeleton className="h-20" />
      ) : (
        group && (
          <Text className="text-4xl font-extrabold tracking-widest mt-4">
            {group.name}
          </Text>
        )
      )}
      <View className="gap-2">
        <Text className="font-bold text-lg">Members:</Text>
        <View className="flex-row gap-2">
          {isLoading ? (
            <>
              <Skeleton className="rounded-full size-12" />
              <Skeleton className="rounded-full size-12" />
              <Skeleton className="rounded-full size-12" />
              <Skeleton className="rounded-full size-12" />
            </>
          ) : (
            group &&
            group.users.map((data) => (
              <Avatar alt={data.user.name} key={data.user.id}>
                <AvatarImage source={{ uri: data.user.image }} />
              </Avatar>
            ))
          )}
        </View>
      </View>

      <View className="gap-2 flex-1 mt-2">
        <Text className="font-bold text-lg">Hatians:</Text>

        {isLoading ? (
          <View className="gap-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </View>
        ) : (
          group && (
            <FlatList
              data={group.hatians}
              renderItem={({ item: hatian }) => (
                <HatianListItem
                  key={hatian.id}
                  showMembers={false}
                  hatian={hatian}
                />
              )}
              keyExtractor={(item) => item.id}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
              ItemSeparatorComponent={() => <View className="h-2" />}
              ListEmptyComponent={() => (
                <View className="h-32 justify-center">
                  <Text className="text-center text-2xl font-bold">
                    No hatians made for this group.
                  </Text>
                </View>
              )}
            />
          )
        )}
      </View>

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

export default GroupPage;
