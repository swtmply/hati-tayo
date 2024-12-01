import { TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { Text } from "~/components/ui/text";
import useDBUser from "~/hooks/use-db-user";
import { useQuery } from "@tanstack/react-query";
import axios from "~/lib/axios";
import { Group, User } from "~/types";
import { Skeleton } from "~/components/ui/skeleton";
import { Avatar, AvatarImage } from "~/components/ui/avatar";

type UsersListProps = {
  onSelect: (users: User) => void;
};

const UsersList = (props: UsersListProps) => {
  const { dbUser } = useDBUser();

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["groups", dbUser?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/groups/${dbUser?.id}`);

      return response.data as Group[];
    },
  });

  const users = useMemo(() => {
    if (groups === undefined) return [] as User[];

    const users = groups.reduce((acc, group) => {
      return [...acc, ...group.users.map(({ user }) => user)];
    }, [] as User[]);

    return users.filter((user, index, self) => {
      return index === self.findIndex((t) => t.id === user.id);
    });
  }, [groups]);

  return (
    <View className="flex-1 gap-3">
      {groupsLoading &&
        [...Array(3)].map((_, i) => (
          <Skeleton className="w-full h-5" key={i} />
        ))}

      {users?.map((user) => {
        if (user.id === dbUser?.id) return null;

        return (
          <TouchableOpacity
            key={user.id}
            onPress={() => {
              props.onSelect(user);
            }}
            className="w-full flex-row gap-2 items-center"
          >
            <View key={user.id} className="flex flex-row">
              <Avatar alt={user.name} className="size-8">
                <AvatarImage source={{ uri: user.image }} />
              </Avatar>
            </View>

            <Text>{user.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default UsersList;
