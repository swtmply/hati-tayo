import { TouchableOpacity, View } from "react-native";
import React from "react";
import { Hatian } from "~/types";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Text } from "./ui/text";
import { cn } from "~/lib/utils";
import { useRouter } from "expo-router";

type HatianListItemProps = {
  hatian: Hatian;
  showMembers?: boolean;
};

const HatianListItem = ({
  hatian,
  showMembers = true,
}: HatianListItemProps) => {
  const router = useRouter();

  const userExpense = hatian.transactions.reduce(
    (acc, transaction) => {
      const expense = transaction.userExpenses.reduce(
        (acc, userExpense) => {
          return {
            paid: acc.paid + parseFloat(userExpense.paid.toString()),
            owed: acc.owed + parseFloat(userExpense.owed.toString()),
          };
        },
        { paid: 0, owed: 0 }
      );

      return {
        paid: acc.paid + expense.paid,
        owed: acc.owed + expense.owed,
      };
    },
    { paid: 0, owed: 0 }
  );

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/(details)/hatians/${hatian.id}`);
      }}
      key={hatian.id}
      className="bg-background"
    >
      <View className="border border-border rounded-md p-4 flex-row items-center justify-between">
        <View className="gap-3 flex-1">
          <Text className="text-2xl font-bold">{hatian.name}</Text>
          {showMembers ? (
            <View className="flex-row gap-1">
              {hatian.users.map(({ user }) => (
                <Avatar key={user.id} alt={user.name}>
                  <AvatarImage
                    source={{
                      uri: user.image,
                    }}
                  />
                </Avatar>
              ))}
            </View>
          ) : null}
        </View>

        <Text
          className={cn(
            "text-2xl font-extrabold",
            userExpense.paid - userExpense.owed === 0
              ? "text-foreground"
              : userExpense.paid - userExpense.owed > 0
              ? "text-primary"
              : "text-destructive"
          )}
        >
          {Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(userExpense.paid - userExpense.owed)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HatianListItem;
