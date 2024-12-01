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
import TransactionListItem from "~/components/transaction-list-item";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Hatian } from "~/types";

const HatianPage = () => {
  const { dbUser } = useDBUser();
  const { hatianId } = useLocalSearchParams();

  const {
    data: hatian,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["hatian", hatianId, dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/hatians/${dbUser?.id}/${hatianId}`
      );

      return response.data as Hatian;
    },
    enabled: !!hatianId,
  });

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      {isLoading ? (
        <Skeleton className="h-20" />
      ) : (
        hatian && (
          <Text className="text-4xl font-extrabold tracking-widest mt-4">
            {hatian.name}
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
            hatian &&
            hatian.users.map((data) => (
              <Avatar alt={data.user.name} key={data.user.id}>
                <AvatarImage source={{ uri: data.user.image }} />
              </Avatar>
            ))
          )}
        </View>
      </View>

      <View className="gap-2 flex-1 mt-2">
        <Text className="font-bold text-lg">Transactions:</Text>
        {isLoading ? (
          <View className="gap-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </View>
        ) : (
          hatian && (
            <FlatList
              data={hatian.transactions}
              renderItem={({ item: transaction }) => (
                <TransactionListItem transaction={transaction} />
              )}
              keyExtractor={(transaction) => transaction.id}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
              ItemSeparatorComponent={() => <View className="h-2" />}
              ListEmptyComponent={() => (
                <View className="h-32 justify-center">
                  <Text className="text-center text-2xl font-bold">
                    No transactions made for this hatian.
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
          source={require("~/assets/images/patterns/pattern-4.png")}
          className="flex-1"
          resizeMode="repeat"
        />
      </View>
    </SafeAreaView>
  );
};

export default HatianPage;
