import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Text } from "~/components/ui/text";
import HatiansList from "./_components/hatians-list";
import UsersList from "./_components/users-list";

import { zodResolver } from "@hookform/resolvers/zod";
import * as PopoverPrimitive from "@rn-primitives/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Hatian, User } from "~/types";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

export const transactionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hatian: z.custom<Hatian>().optional(),
  users: z.custom<User[]>().optional(),
  amount: z.coerce.number(),
  paidBy: z.string(),
  splitType: z.enum(["equally"]),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

const TransactionForm = () => {
  const contentInsets = {
    left: 14,
    right: 14,
  };

  const { dbUser } = useDBUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  const methods = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      amount: 0,
      splitType: "equally",
      paidBy: "",
      hatian: undefined,
      users: [dbUser],
    },
  });

  const triggerRef = React.useRef<PopoverPrimitive.TriggerRef>(null);

  React.useEffect(() => {
    triggerRef.current?.open();
  }, []);

  const closePopover = () => {
    triggerRef.current?.close();
  };

  const hatian = methods.watch("hatian");
  const users = methods.watch("users");

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      const response = await axios.post("/api/transactions/create", data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["hatian"],
      });
      router.navigate("/(tabs)/hatians");
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    mutate(data);

    if (isSuccess) methods.reset();
  };

  const { append, remove } = useFieldArray({
    control: methods.control,
    name: "users",
  });

  return (
    <SafeAreaView className="p-4 flex-1 gap-4">
      <Text className="text-2xl font-bold">Create New Transaction</Text>

      <FormProvider {...methods}>
        <View className="flex-1 justify-between">
          <View className="gap-4">
            <Popover>
              <PopoverTrigger ref={triggerRef} asChild>
                <Button variant={"outline"} className="items-start">
                  <Text className="text-base text-muted-foreground">
                    Select hatian or users
                  </Text>
                </Button>
              </PopoverTrigger>
              <PopoverContent insets={contentInsets} className="w-full gap-4">
                <Input placeholder="Search" autoFocus={true} />

                <Text className="leading-none native:text-sm uppercase font-semibold tracking-wide text-muted-foreground">
                  Hatians
                </Text>

                <Controller
                  control={methods.control}
                  name="hatian"
                  render={({ field }) => (
                    <HatiansList
                      onSelect={(hatian) => {
                        field.onChange(hatian);

                        methods.setValue(
                          "users",
                          hatian.users.map(({ user }) => user)
                        );

                        closePopover();
                      }}
                    />
                  )}
                />

                <Text className="leading-none native:text-sm uppercase font-semibold tracking-wide text-muted-foreground">
                  Users
                </Text>

                <UsersList
                  onSelect={(user) => {
                    append(user);

                    closePopover();
                  }}
                />
              </PopoverContent>
            </Popover>

            <Text className="font-medium text-muted-foreground">
              Making transaction with:
            </Text>
            {hatian && (
              <View>
                <Text className="text-2xl font-">{hatian.name}</Text>
              </View>
            )}

            {users &&
              users.map((user, index) => {
                if (user.id === dbUser?.id) return null;

                return (
                  <View
                    key={user.id}
                    className="flex-row items-center justify-between"
                  >
                    <View className="gap-2 items-center flex-row">
                      <Avatar alt={user.name} className="size-8">
                        <AvatarImage source={{ uri: user.image }} />
                      </Avatar>
                      <Text>{user.name}</Text>
                    </View>
                    <Button
                      variant={"outline"}
                      onPress={() => remove(index)}
                      className="items-center"
                    >
                      <Text>Remove</Text>
                    </Button>
                  </View>
                );
              })}

            <Controller
              control={methods.control}
              name="name"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View className="gap-2">
                  <Label nativeID="transaction_name">Name</Label>
                  <Input
                    placeholder="Enter transaction name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    aria-labelledby="transaction_name"
                    aria-errormessage="transaction_name-error"
                  />
                  {error && (
                    <Text className="text-red-500">{error.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={methods.control}
              name="amount"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View className="gap-2">
                  <Label nativeID="hatian_amount">Amount</Label>
                  <Input
                    placeholder="Enter hatian amount"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    value={value?.toString()}
                    aria-labelledby="hatian_amount"
                    aria-errormessage="hatian_amount-error"
                  />
                  {error && (
                    <Text className="text-red-500">{error.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={methods.control}
              name="paidBy"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <View className="gap-2">
                  <Label nativeID="hatian_paid_by">Paid by</Label>
                  <Select onValueChange={(option) => onChange(option?.value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        className="text-foreground text-base"
                        placeholder="Select a user"
                      />
                    </SelectTrigger>
                    <SelectContent
                      insets={contentInsets}
                      className="w-full mt-1"
                    >
                      {users?.map((user) => (
                        <SelectItem
                          key={user.id}
                          label={user.name}
                          value={user.id}
                        >
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {error && (
                    <Text className="text-red-500">{error.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={methods.control}
              name="splitType"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <View className="gap-2">
                  <Label nativeID="hatian_split_type">Split Type</Label>
                  <Select
                    defaultValue={{ label: "Equally", value: "equally" }}
                    onValueChange={(option) => onChange(option?.value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        className="text-foreground text-base"
                        placeholder="Select a split type"
                      />
                    </SelectTrigger>
                    <SelectContent
                      insets={contentInsets}
                      className="w-full mt-1"
                    >
                      <SelectItem label="Equally" value="equally">
                        Equally
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {error && (
                    <Text className="text-red-500">{error.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <Button
            variant={"default"}
            onPress={methods.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            <Text>Submit Transaction</Text>
          </Button>
        </View>
      </FormProvider>
    </SafeAreaView>
  );
};

export default TransactionForm;
