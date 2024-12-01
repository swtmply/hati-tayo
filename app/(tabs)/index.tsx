import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import useDBUser from "~/hooks/use-db-user";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import { FlatList, ImageBackground, RefreshControl, View } from "react-native";
import Svg from "react-native-svg";
import TransactionListItem from "~/components/transaction-list-item";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import axios from "~/lib/axios";
import { cn } from "~/lib/utils";
import { Transaction } from "~/types";

cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: {
      fill: true,
    },
  },
});

const HomePage = () => {
  const { dbUser } = useDBUser();

  const {
    data: transactions,
    isLoading,
    refetch: refetchTransactions,
    isRefetching: isRefetchingTransactions,
  } = useQuery({
    queryKey: ["transactions", dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/transactions/${dbUser?.id}`);

      return response.data as Transaction[];
    },
    enabled: !!dbUser,
  });

  const {
    data: userTransactionSummary,
    isLoading: userTransactionSummaryLoading,
    refetch: refetchUserTransactionSummary,
    isRefetching: isRefetchingUserTransactionSummary,
  } = useQuery({
    queryKey: ["transactions", dbUser?.id, "summary"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/transactions/${dbUser?.id}/summary`
      );

      return response.data as Transaction;
    },
    enabled: !!dbUser,
  });

  const isRefetching =
    isRefetchingTransactions || isRefetchingUserTransactionSummary;

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      <Text className="text-2xl font-bold">Hello, {dbUser?.name}</Text>

      <View className="h-1/3 bg-green-50 rounded-lg">
        <ImageBackground
          source={require("~/assets/images/patterns/pattern-5.png")}
          className="flex-1"
          resizeMode="repeat"
        />
        <CardHeader className="px-6 pt-6 pb-0">
          {userTransactionSummaryLoading ? (
            <Skeleton className="w-40 h-10" />
          ) : (
            userTransactionSummary && (
              <CardTitle
                className={cn(
                  "text-4xl",
                  userTransactionSummary.paid - userTransactionSummary.owed ===
                    0
                    ? "text-foreground"
                    : userTransactionSummary.paid -
                        userTransactionSummary.owed >
                      0
                    ? "text-primary"
                    : "text-destructive"
                )}
              >
                {Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(
                  Math.abs(
                    userTransactionSummary.paid - userTransactionSummary.owed
                  )
                )}
              </CardTitle>
            )
          )}
        </CardHeader>
        <CardContent className="flex-row gap-1">
          <Text className="text-lg text-muted-foreground">
            Remaining Balance
          </Text>
        </CardContent>
      </View>

      <Text className="font-bold text-lg">Unsettled Transactions:</Text>

      {isLoading ? (
        <View className="gap-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </View>
      ) : (
        transactions && (
          <FlatList
            data={transactions}
            keyExtractor={(item, index: number) =>
              `${item.id}-${index.toString()}`
            }
            renderItem={({ item: transaction }) => (
              <TransactionListItem transaction={transaction} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  refetchTransactions();
                  refetchUserTransactionSummary();
                }}
              />
            }
            ItemSeparatorComponent={() => <View className="h-2" />}
            ListEmptyComponent={() => (
              <View className="h-32 justify-center">
                <Text className="text-center text-2xl font-bold">
                  No unsettled transactions.
                </Text>
              </View>
            )}
          />
        )
      )}
    </SafeAreaView>
  );
};

export default HomePage;
