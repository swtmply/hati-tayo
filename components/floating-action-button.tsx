import React, { useCallback, useMemo, useRef } from "react";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "~/lib/useColorScheme";
import { LINKS } from "~/lib/constants";
import { RelativePathString, usePathname, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { cn } from "~/lib/utils";
import { View } from "@rn-primitives/slot";

import { Plus } from "~/components/icons";

const FloatingActionButton = () => {
  const { isDarkColorScheme } = useColorScheme();

  const bottomSheetModalRef = useRef<BottomSheet>(null);

  // MARK: callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.expand();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
    ),
    []
  );

  const snapPoints = useMemo(() => ["25%"], []);

  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <Button
        onPress={handlePresentModalPress}
        variant={"default"}
        size={"icon"}
        className="absolute right-5 bottom-20 rounded-full size-16"
      >
        <Plus size={36} className="text-white" />
      </Button>
      <BottomSheet
        enablePanDownToClose
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
        index={-1}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: isDarkColorScheme ? "white" : "black",
        }}
      >
        <BottomSheetView className="flex-1 p-6">
          {LINKS.map((link, index) => {
            if (link.href === pathname) return null;

            return (
              <Pressable
                key={`link-${index}`}
                className={cn("flex-row items-center gap-2 p-2 rounded-lg")}
                onPress={() => {
                  bottomSheetModalRef.current?.close();
                  router.push(link.href as RelativePathString);
                }}
              >
                <View className="p-3 rounded-full">{link.icon}</View>
                <Text>{link.title}</Text>
              </Pressable>
            );
          })}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default FloatingActionButton;
