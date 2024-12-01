import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Transaction } from "~/types";

import ImageView from "react-native-image-viewing";
import { Download } from "~/components/icons";
import { downloadImage } from "~/lib/utils";

const SettleTransactionPage = () => {
  const { dbUser } = useDBUser();
  const { transactionId } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [visible, setVisible] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions", transactionId, dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/transactions/${dbUser?.id}/${transactionId}`
      );

      return response.data as Transaction;
    },
    enabled: !!dbUser,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return axios.post(
        `/api/transactions/${dbUser?.id}/${transactionId}/settle`,
        {
          paid: transaction?.owed,
        }
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["hatian"],
      });

      router.back();
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="p-4 flex-1 gap-4">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <SafeAreaView className="p-4 flex-1 gap-4 relative">
      <View className="gap-2 flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-center">
          {transaction.name}
        </Text>
        <Text className="font-bold text-7xl leading-normal text-center text-primary">
          {Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(transaction.owed)}
        </Text>
        <Text className="text-center uppercase text-muted-foreground font-extrabold tracking-widest">
          Paid by:
        </Text>
        <Text className="text-center text-xl font-bold">
          {transaction.paidBy.name}
        </Text>

        <Text className="text-center uppercase text-muted-foreground font-extrabold tracking-widest">
          QR Codes:
        </Text>

        <View className="w-[75%] flex-row gap-2 flex-wrap justify-center items-center">
          <ImageView
            images={transaction.paidBy.qrCodes.map((qrCode) => ({
              uri: qrCode.url,
            }))}
            imageIndex={imageIndex}
            visible={visible}
            onRequestClose={() => setVisible(false)}
            FooterComponent={({ imageIndex }) => {
              return (
                <View className="p-6 justify-center items-center">
                  <TouchableOpacity
                    onPress={() => {
                      downloadImage(transaction.paidBy.qrCodes[imageIndex].url);
                    }}
                    className="flex-row gap-2 items-center"
                  >
                    <Download className="size-8 text-white" />
                    <Text className="text-white font-bold">Download Image</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          {transaction.paidBy.qrCodes.map((qrCode, index) => (
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
                setImageIndex(index);
              }}
              key={qrCode.id}
              className="gap-2 max-w-32"
            >
              <Image
                source={{
                  uri: qrCode.url,
                }}
                className="size-32 rounded-xl"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="flex-row gap-2">
        <Button
          onPress={() => {
            router.back();
          }}
          variant={"secondary"}
          className="w-1/2"
        >
          <Text>Go Back</Text>
        </Button>
        <Button
          onPress={() => mutate()}
          disabled={isPending || transaction.paidBy.id === dbUser?.id}
          className="w-1/2"
        >
          <Text>Settle Transaction</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SettleTransactionPage;
