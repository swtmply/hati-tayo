import React from "react";
import { Button } from "./ui/button";
import { Text } from "./ui/text";
import { useClerk } from "@clerk/clerk-expo";
import { LogOut } from "./icons";
import { useRouter } from "expo-router";

const LogOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <Button
      onPress={() => {
        signOut();

        router.replace("/(auth)");
      }}
      variant={"secondary"}
      className="rounded-full absolute top-4 right-4 flex-row gap-2"
    >
      <LogOut className="text-foreground" />
      <Text>Logout</Text>
    </Button>
  );
};

export default LogOutButton;
