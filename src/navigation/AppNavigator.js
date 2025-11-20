import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT_SIZES } from "../constants/theme";

import DashboardScreen from "../screens/DashboardScreen";
import BookingsStack from "./BookingStack";
import BikesStack from "./BikesStack";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap = {
            Dashboard: focused ? "home" : "home-outline",
            Bookings: focused ? "calendar" : "calendar-outline",
            Bikes: focused ? "bicycle" : "bicycle-outline",
          };
          return (
            <Ionicons name={iconMap[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Bookings" component={BookingsStack} />
      <Tab.Screen name="Bikes" component={BikesStack} />
    </Tab.Navigator>
  );
}
