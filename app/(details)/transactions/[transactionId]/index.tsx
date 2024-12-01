import { FlatList, RefreshControl, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Transaction } from "~/types";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

const TransactionPage = () => {
  const { dbUser } = useDBUser();
  const { transactionId } = useLocalSearchParams();

  const {
    data: transaction,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["transactions", transactionId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/transactions/${transactionId}/details`
      );

      return response.data as Transaction;
    },
    enabled: !!dbUser,
  });

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      {isLoading ? (
        <Skeleton className="h-16 w-1/2" />
      ) : (
        transaction && (
          <Text className="text-4xl font-extrabold tracking-widest mt-4">
            {transaction.name}
          </Text>
        )
      )}

      {isLoading ? (
        <View className="gap-2">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </View>
      ) : (
        transaction && (
          <FlatList
            data={transaction.users}
            keyExtractor={(item) => item.user.id}
            renderItem={({ item: { user: user } }) => {
              const userExpense = transaction.userExpenses.find(
                (userExpense) => userExpense.user_id === user.id
              );

              return (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row gap-2 items-center">
                    <Avatar alt={user.name}>
                      <AvatarImage source={{ uri: user.image }} />
                    </Avatar>
                    <Text className="text-lg font-bold">{user.name}</Text>
                  </View>
                  <Text
                    className={cn(
                      "text-2xl font-extrabold text-right",
                      parseFloat(userExpense!.owed.toString()) === 0
                        ? "text-foreground line-through"
                        : "text-primary",
                      userExpense!.settled && "line-through"
                    )}
                  >
                    {Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(userExpense!.owed)}
                  </Text>
                </View>
              );
            }}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            ItemSeparatorComponent={() => <View className="h-4" />}
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
    </SafeAreaView>
  );
};

export default TransactionPage;
