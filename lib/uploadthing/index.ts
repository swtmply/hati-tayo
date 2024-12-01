import { generateReactNativeHelpers } from "@uploadthing/expo";

export const { useImageUploader } = generateReactNativeHelpers({
  url: "http://192.168.1.11:3000/api/uploadthing",
});
