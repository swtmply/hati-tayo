import React from "react";
import { useImageUploader } from "~/lib/uploadthing";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { Alert } from "react-native";
import { openSettings } from "expo-linking";
import { useMutation } from "@tanstack/react-query";
import axios from "~/lib/axios";

type UploadButtonProps = {
  onSuccess: (url: string) => void;
};

const UploadButton = (props: UploadButtonProps) => {
  // const { mutate } = useMutation({
  //   mutationFn: async (data: { name: string; url: string; userId: string }) => {
  //     console.log("Uploading to server", data);

  //     return axios.post("/api/callback/upload", data);
  //   },
  //   onSuccess: () => {
  //     console.log("Uploaded successfully");
  //   },
  // });

  const { isUploading, openImagePicker } = useImageUploader("imageUploader", {
    onClientUploadComplete: (file) => {
      props.onSuccess(file[0].url);
    },
  });

  return (
    <Button
      variant={"secondary"}
      onPress={() => {
        openImagePicker({
          source: "library",
          onInsufficientPermissions: () => {
            Alert.alert(
              "No permissions",
              "You need to give permissions to access the library",
              [
                {
                  text: "Dismiss",
                },
                {
                  text: "Open settings",
                  onPress: () => {
                    openSettings();
                  },
                },
              ]
            );
          },
        });
      }}
    >
      <Text>{isUploading ? "Uploading..." : "Upload a file"}</Text>
    </Button>
  );
};

export default UploadButton;
