import { useQuery } from "@tanstack/react-query";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import useDBUser from "~/hooks/use-db-user";
import axios from "~/lib/axios";
import { Hatian } from "~/types";

type HatiansListProps = {
  onSelect: (hatian: Hatian) => void;
};

const HatiansList = (props: HatiansListProps) => {
  const { dbUser } = useDBUser();

  const { data: hatians, isLoading: hatiansLoading } = useQuery({
    queryKey: ["hatian", dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/hatians/${dbUser?.id}`);

      return response.data as Hatian[];
    },
  });

  return (
    <View className="flex-1 gap-2">
      {hatiansLoading &&
        [...Array(3)].map((_, i) => (
          <Skeleton className="w-full h-5" key={i} />
        ))}

      {hatians?.map((hatian) => (
        <TouchableOpacity
          key={hatian.id}
          onPress={() => {
            props.onSelect(hatian);
          }}
          className="w-full flex-row justify-between items-center"
        >
          <Text className="text-lg font-medium self-start max-w-[50%]">
            {hatian.name}
          </Text>

          <View className="flex-row gap-1">
            {hatian.users.map(({ user }) => (
              <View key={user.id} className="flex flex-row">
                <Avatar alt={user.name} className="size-8">
                  <AvatarImage source={{ uri: user.image }} />
                </Avatar>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default HatiansList;
