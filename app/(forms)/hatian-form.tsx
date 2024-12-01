import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Check, X } from "~/components/icons";
import React from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import ComboBox from "~/components/combo-box";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Group, User } from "~/types";
import { Text } from "~/components/ui/text";

export const hatianSchema = z.object({
  name: z.string().min(1, "Name is required"),
  members: z.custom<User[]>().refine((value) => value.length > 0, {
    message: "Hatian must have at least one member",
  }),
});

export type HatianFormValues = z.infer<typeof hatianSchema>;

const HatianForm = () => {
  const { dbUser } = useDBUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

  const methods = useForm<HatianFormValues>({
    resolver: zodResolver(hatianSchema),
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

  const { data, isLoading } = useQuery({
    queryKey: ["groups", dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${dbUser?.id}`);

      return response.data as Group[];
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: HatianFormValues) => {
      const response = await axios.post("/api/hatians/create", {
        ...data,
        group: selectedGroup,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["hatian", dbUser?.id],
      });

      router.replace("/(tabs)/hatians");
    },
  });

  const onSubmit = async (data: HatianFormValues) => {
    mutate(data);
    if (isSuccess) methods.reset();
  };

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      <Text className="text-2xl font-bold">Create New Hatian</Text>
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
                <Label nativeID="hatian_name">Hatian Name</Label>
                <Input
                  placeholder="Enter hatian name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  aria-labelledby="hatian_name"
                  aria-errormessage="hatian_name-error"
                />
                {error && <Text className="text-red-500">{error.message}</Text>}
              </View>
            )}
          />

          <View className="gap-2">
            <Label nativeID="group_members">Hatian Members</Label>
            {isLoading ? (
              <Input placeholder="Loading..." />
            ) : (
              <ComboBox
                defaultList={data}
                renderItem={(item, closePopover, groupSelected) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        append(item.users.map(({ user }) => user));
                        groupSelected(true);
                        setSelectedGroup(item);
                        closePopover();
                      }}
                      className="gap-2 flex-1"
                    >
                      <Text className="text-lg font-medium">{item.name}</Text>

                      <View className="flex-row gap-1">
                        {item.users.map(({ user }) => (
                          <View key={user.id} className="flex flex-row">
                            <Avatar alt={user.name} className="size-8">
                              <AvatarImage source={{ uri: user.image }} />
                            </Avatar>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  );
                }}
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
            )}
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
          <Text>Submit Hatian</Text>
        </Button>
      </FormProvider>
    </SafeAreaView>
  );
};

export default HatianForm;
