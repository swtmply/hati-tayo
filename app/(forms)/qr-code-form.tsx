import { useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import UploadButton from "~/components/upload-button";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";

export const qrCodeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  userId: z.string(),
});

export type QrCodeFormValues = z.infer<typeof qrCodeSchema>;

const QRCodeForm = () => {
  const { dbUser } = useDBUser();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const methods = useForm<QrCodeFormValues>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      name: "",
      url: "",
      userId: "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: QrCodeFormValues) => {
      const response = await axios.post("/api/qr-code/upload", data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["db-user", user?.id],
      });
      router.navigate("/(tabs)/profile");
    },
  });

  const onSubmit = (data: QrCodeFormValues) => {
    if (!dbUser) return;

    mutate({ ...data, userId: dbUser.id });

    if (isSuccess) methods.reset();
  };

  const imageURL = methods.watch("url");

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      <Text className="text-2xl font-bold">Upload QR Code</Text>

      <FormProvider {...methods}>
        <View className="flex-1 justify-between">
          <View className="gap-4 flex-1">
            <Controller
              control={methods.control}
              name="name"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View className="gap-2">
                  <Label nativeID="qr-code_name">Name</Label>
                  <Input
                    placeholder="Enter QR code name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    aria-labelledby="qr-code_name"
                    aria-errormessage="qr-code_name-error"
                  />
                  {error && (
                    <Text className="text-red-500">{error.message}</Text>
                  )}
                </View>
              )}
            />

            <View className="gap-2">
              <Label nativeID="qr-code_name">Image</Label>
              {imageURL && (
                <Image
                  source={{
                    uri: imageURL,
                  }}
                  className="size-40 rounded-xl"
                />
              )}
              <UploadButton
                onSuccess={(url) => {
                  methods.setValue("url", url);
                }}
              />
            </View>
          </View>

          <Button
            className="justify-self-end"
            onPress={methods.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            <Text>Submit QR Code</Text>
          </Button>
        </View>
      </FormProvider>
    </SafeAreaView>
  );
};

export default QRCodeForm;
