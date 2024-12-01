import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import useDBUser from "~/hooks/use-db-user";
import { Button } from "~/components/ui/button";

import ImageView from "react-native-image-viewing";

import { Trash } from "~/components/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "~/lib/axios";
import LogOutButton from "~/components/log-out-button";

const ProfilePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { dbUser, dbUserRefetch } = useDBUser();
  const queryClient = useQueryClient();

  const [visible, setVisible] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);

  const { mutate } = useMutation({
    mutationFn: async ({ id, link }: { id: string; link: string }) => {
      await axios.post(`/api/qr-code/${id}/${link.split("/").pop()}`);

      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["db-user", user?.id] });
      dbUserRefetch();
      setVisible(false);
    },
  });

  if (!user && !dbUser) router.back();

  return (
    <SafeAreaView className="flex-1">
      <View className="h-1/3 w-full bg-green-200 mb-10">
        <ImageBackground
          source={require("~/assets/images/patterns/pattern-1.png")}
          className="flex-1"
          resizeMode="repeat"
        />
        <Image
          source={{
            uri: user?.imageUrl,
          }}
          className="size-48 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 border-8 border-background"
        />
        <LogOutButton />
      </View>

      <View>
        <Text className="text-2xl font-bold text-center mt-8">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-center text-lg">
          User Code: {dbUser?.user_code}
        </Text>
      </View>

      <View className="mt-4 p-4 flex-row justify-between items-center">
        <Text className="text-lg font-bold flex-shrink">QR Codes:</Text>

        <Button
          variant={"secondary"}
          onPress={() => {
            router.push("/(forms)/qr-code-form");
          }}
        >
          <Text>Add QR Code</Text>
        </Button>
      </View>

      <ImageView
        images={
          dbUser?.qrCodes.map((qrCode) => ({
            uri: qrCode.url,
          })) || []
        }
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        FooterComponent={({ imageIndex }) => {
          return (
            <View className="p-6 justify-center items-center">
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Are you sure you want to delete this image?",
                    "Doing so will remove the image from your profile.",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => {
                          mutate({
                            id: dbUser?.qrCodes[imageIndex].id || "",
                            link: dbUser?.qrCodes[imageIndex].url || "",
                          });
                        },
                      },
                    ]
                  );
                }}
                className="flex-row gap-2 items-center"
              >
                <Trash className="size-8 text-white" />
                <Text className="text-white font-bold">Delete Image</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <ScrollView contentContainerClassName="pb-20">
        <View className="flex-row gap-6 px-4 flex-wrap">
          {dbUser?.qrCodes.map((qrCode, index) => (
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
                setImageIndex(index);
              }}
              key={qrCode.id}
              className="bg-background-light flex-row justify-between items-center"
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
