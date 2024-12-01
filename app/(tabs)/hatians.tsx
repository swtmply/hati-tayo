import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Hatian } from "~/types";

import { useRouter } from "expo-router";
import HatianListItem from "~/components/hatian-list-item";
import { Skeleton } from "~/components/ui/skeleton";

const HatianPage = () => {
  const { dbUser } = useDBUser();
  const router = useRouter();

  const {
    data: hatians,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["hatian", dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/hatians/${dbUser?.id}`);

      return response.data as Hatian[];
    },
  });

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      <Text className="text-4xl font-extrabold mt-4">Hatians</Text>

      {isLoading ? (
        <View className="gap-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </View>
      ) : (
        hatians && (
          <FlatList
            data={hatians}
            keyExtractor={(item) => item.id}
            renderItem={({ item: hatian }) => (
              <HatianListItem hatian={hatian} />
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
          source={require("~/assets/images/patterns/pattern-4.png")}
          className="flex-1"
          resizeMode="repeat"
        />
      </View>
    </SafeAreaView>
  );
};

export default HatianPage;
