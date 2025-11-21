import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../constants/theme";

import LoginScreen from "../screens/LoginScreen";
import RegisterOrgScreen from "../screens/RegisterOrgScreen";
import JoinOrgScreen from "../screens/JoinOrgScreen";

import MainTabs from "./AppNavigator";

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show loading screen while checking authentication
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          {/* AUTH FLOW */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegisterOrg" component={RegisterOrgScreen} />
          <Stack.Screen name="JoinOrg" component={JoinOrgScreen} />
        </>
      ) : (
        <>
          {/* MAIN APPLICATION */}
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
