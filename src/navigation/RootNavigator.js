import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterOrgScreen from "../screens/RegisterOrgScreen";
import JoinOrgScreen from "../screens/JoinOrgScreen";

import MainTabs from "./AppNavigator";

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* AUTH FLOW */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterOrg" component={RegisterOrgScreen} />
      <Stack.Screen name="JoinOrg" component={JoinOrgScreen} />

      {/* MAIN APPLICATION */}
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
