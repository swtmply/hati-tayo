import * as PopoverPrimitive from "@rn-primitives/popover";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { TextInput, View } from "react-native";
import axios from "~/lib/axios";
import { User } from "~/types";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { Text } from "./ui/text";

type ComboBoxProps<T> = {
  defaultList?: Array<T>;
  renderItem?: (
    item: T,
    closePopover: () => void,
    setGroupSelected: (groupSelected: boolean) => void
  ) => React.ReactNode;
  searchListItem?: (item: User, closePopover: () => void) => React.ReactNode;
};

const ComboBox = <T,>(props: ComboBoxProps<T>) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [groupSelected, setGroupSelected] = React.useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["users", searchValue],
    queryFn: async () => {
      const response = await axios.get("/api/users?search=" + searchValue);

      return response.data;
    },
    enabled: searchValue.length > 5,
  });

  const popoverTriggerRef = React.useRef<PopoverPrimitive.TriggerRef>(null);
  const searchInputRef = React.useRef<TextInput>(null);

  const closePopover = () => {
    popoverTriggerRef.current?.close();
    searchInputRef.current?.blur();
    setSearchValue("");
  };

  return (
    <Popover>
      <PopoverTrigger ref={popoverTriggerRef} asChild>
        <Input
          nativeID="group_members"
          ref={searchInputRef}
          placeholder="Select Group or User"
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full gap-2" insets={{ left: 15, right: 15 }}>
        {!groupSelected &&
          searchValue.length !== 6 &&
          props.defaultList?.map((item, index) => (
            <View key={index} className="gap-4">
              {props.renderItem?.(item, closePopover, setGroupSelected)}

              {index !== props.defaultList!.length - 1 && <Separator />}
            </View>
          ))}

        {searchValue.length > 5 && (
          <View className="gap-4">
            {isLoading && <Text>Loading...</Text>}

            {data?.users?.length === 0 && <Text>No users found</Text>}

            {data?.users?.map((user: User, index: number) => (
              <View key={`${user.id}-${index}`} className="gap-4">
                {props.searchListItem?.(user, closePopover)}

                {index !== props.defaultList!.length - 1 && <Separator />}
              </View>
            ))}
          </View>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
