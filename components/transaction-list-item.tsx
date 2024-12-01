import { TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "./ui/text";
import { Transaction } from "~/types";
import { useRouter } from "expo-router";
import { cn } from "~/lib/utils";
import useDBUser from "~/hooks/use-db-user";

type TransactionListItemProps = {
  transaction: Transaction;
};

const TransactionListItem = ({ transaction }: TransactionListItemProps) => {
  const router = useRouter();
  const { dbUser } = useDBUser();

  const userExpenses = transaction.userExpenses.reduce((acc, expenses) => {
    return acc + parseFloat(expenses.owed.toString());
  }, 0);

  return (
    <TouchableOpacity
      onPress={() => {
        if (dbUser?.id === transaction.paidBy.id) {
          router.push(`/(details)/transactions/${transaction.id}`);
          return;
        }

        router.push(`/(details)/transactions/${transaction.id}/settle`);
      }}
      key={transaction.id}
      className="bg-background"
    >
      <View className="border border-border rounded-md p-4 flex-row items-center justify-between">
        <View className="gap-1 flex-1">
          <Text className="text-2xl font-bold">{transaction.name}</Text>
          <Text>
            Paid by:{" "}
            <Text className="font-medium">{transaction.paidBy.name}</Text>
          </Text>
        </View>
        <View>
          <Text
            className={cn(
              "text-2xl font-extrabold text-right",
              userExpenses === 0
                ? "text-foreground line-through"
                : transaction.paidBy.id === dbUser?.id
                ? "text-primary"
                : "text-destructive",
              transaction.settled && "line-through"
            )}
          >
            {Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(userExpenses)}
          </Text>
          <Text className="text-right">
            {Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(transaction.amount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionListItem;
