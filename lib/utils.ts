import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadImage = async (url: string) => {
  let date = new Date().toISOString().split("T")[0];
  let fileUri = FileSystem.documentDirectory + `${date}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(url, fileUri);

    try {
      const asset = await MediaLibrary.createAssetAsync(res.uri);
      const album = await MediaLibrary.getAlbumAsync("Download");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      alert("Image downloaded successfully");
    } catch (err) {
      console.log("Save err: ", err);
    }
  } catch (err) {
    console.log("FS Err: ", err);
  }
};
