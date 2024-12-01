import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import axios from "~/lib/axios";

import { useRouter } from "expo-router";
import ComboBox from "~/components/combo-box";
import { Check, X } from "~/components/icons";
import useDBUser from "~/hooks/use-db-user";
import { User } from "~/types";

export const groupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  members: z.custom<User[]>().refine((value) => value.length > 0, {
    message: "Group must have at least one member",
  }),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

const GroupForm = () => {
  const { dbUser } = useDBUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const methods = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const { append, remove } = useFieldArray({
    control: methods.control,
    name: "members",
  });

  const members = methods.watch("members");

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: GroupFormValues) => {
      const response = await axios.post("/api/groups/create", data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups", dbUser?.id],
      });

      router.replace("/(tabs)/groups");
    },
  });

  const onSubmit = (data: GroupFormValues) => {
    if (!dbUser) return;

    mutate({ ...data, members: [...data.members, dbUser] });

    if (isSuccess) methods.reset();
  };

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      <Text className="text-2xl font-bold">Create New Group</Text>
      <FormProvider {...methods}>
        <View className="flex-1 gap-4">
          <Controller
            control={methods.control}
            name="name"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View className="gap-2">
                <Label nativeID="group_name">Group Name</Label>
                <Input
                  placeholder="Enter group name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  aria-labelledby="group_name"
                  aria-errormessage="group_name-error"
                />
                {error && <Text className="text-red-500">{error.message}</Text>}
              </View>
            )}
          />

          <View className="gap-2">
            <Label nativeID="group_members">Group Members</Label>
            <ComboBox
              defaultList={[] as User[]}
              searchListItem={(user, closePopover) => {
                const isSelected = members.some(
                  (member) => member.user_code === user.user_code
                );

                return (
                  <TouchableOpacity
                    key={user.id}
                    onPress={() => {
                      if (isSelected) {
                        const index = members.findIndex(
                          (member) => member.user_code === user.user_code
                        );
                        remove(index);
                      } else {
                        append(user);
                      }

                      closePopover();
                    }}
                    className="items-center flex-row justify-between"
                  >
                    <View className="flex-row items-center gap-2">
                      <Avatar alt={user.name}>
                        <AvatarImage source={{ uri: user.image }} />
                      </Avatar>

                      <Text className="font-medium text-lg">{user.name}</Text>
                    </View>

                    {isSelected && (
                      <Check className="text-primary rounded-full" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <View className="gap-4">
            {members.map((member, index) => (
              <TouchableOpacity
                onPress={() => {
                  remove(index);
                }}
                className="items-center flex-row justify-between"
                key={member.id}
              >
                <View className="flex-row items-center gap-2">
                  <Avatar alt={member.name}>
                    <AvatarImage source={{ uri: member.image }} />
                  </Avatar>

                  <Text className="font-medium text-lg">{member.name}</Text>
                </View>

                <X className="text-destructive rounded-full" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Button
          variant={"default"}
          onPress={methods.handleSubmit(onSubmit)}
          disabled={isPending}
        >
          <Text>Submit Group</Text>
        </Button>
      </FormProvider>
    </SafeAreaView>
  );
};

export default GroupForm;
