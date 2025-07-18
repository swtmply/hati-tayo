import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@hati-tayo/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Container } from "~/components/container";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";

const ProfilePage = () => {
  const user = useQuery(api.users.get);
  const { signOut } = useAuthActions();
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const deleteUserMutation = useMutation(api.users.deleteUser);
  const [isDeleting, setIsDeleting] = useState(false);

  const logout = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDeleteAccountPress = () => {
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      signOut();

      await deleteUserMutation();

      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container>
      <Text className="mb-2 font-geist-bold text-3xl text-foreground tracking-tighter">
        Profile
      </Text>

      <View className="items-center justify-center gap-2">
        <Image
          style={{
            aspectRatio: 1,
            width: 100,
            height: 100,
            borderRadius: 100,
          }}
          source={user?.image}
          transition={1000}
        />
      </View>

      <Text className="py-2 font-geist-semibold text-muted-foreground text-sm uppercase">
        Personal Information
      </Text>

      <View className="gap-0.5 rounded-lg border border-sidebar-border bg-sidebar dark:bg-secondary">
        <Text className="font-geist-medium text-card-foreground text-lg">
          Name
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className=" text-muted-foreground">{user?.name}</Text>
        </View>
        <Text className="font-geist-medium text-card-foreground text-lg">
          Email
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className=" text-muted-foreground">{user?.email}</Text>
        </View>
        <Text className="font-geist-medium text-card-foreground text-lg">
          Phone Number
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className=" text-muted-foreground">{user?.phoneNumber}</Text>
        </View>
      </View>

      <Text className="py-2 font-geist-semibold text-muted-foreground text-sm uppercase">
        Account Settings
      </Text>

      <View className="gap-0.5 rounded-lg border border-sidebar-border bg-sidebar dark:bg-secondary">
        <Text className="font-geist-medium text-card-foreground text-lg">
          Password
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-muted-foreground">********</Text>
        </View>
      </View>

      <Text className="py-2 font-geist-semibold text-destructive text-sm uppercase">
        Danger Zone
      </Text>

      <View className="gap-0.5 rounded-lg border border-sidebar-border bg-sidebar dark:bg-secondary">
        <Dialog
          open={isDeleteDialogVisible}
          onOpenChange={setDeleteDialogVisible}
        >
          <DialogTrigger asChild>
            <Pressable
              onPress={handleDeleteAccountPress}
              className="flex-row items-center justify-between border-border border-b px-4 py-2 dark:border-popover"
            >
              <Text className="font-geist-bold text-destructive text-lg">
                Delete Account
              </Text>
            </Pressable>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-between">
              <DialogClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                <Text>{isDeleting ? "Deleting..." : "Delete"}</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Pressable
          onPress={logout}
          className="flex-row items-center justify-between px-4 py-2"
        >
          <Text className="font-geist-bold text-destructive text-lg">
            Logout
          </Text>
        </Pressable>
      </View>
    </Container>
  );
};

export default ProfilePage;
