import { useAuth } from "@clerk/clerk-expo";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Redirect, Tabs } from "expo-router";
import { House, Notebook, UserRound, UsersRound } from "lucide-react-native";
import React from "react";
import FloatingActionButton from "~/components/floating-action-button";

const TabsLayout = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)"} />;
  }

  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "green", headerShown: false }}
      tabBar={(props) => (
        <>
          <BottomTabBar {...props} />
          <FloatingActionButton />
        </>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="hatians"
        options={{
          title: "Hatians",
          tabBarIcon: ({ color }) => <Notebook size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => <UsersRound size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserRound size={24} color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
