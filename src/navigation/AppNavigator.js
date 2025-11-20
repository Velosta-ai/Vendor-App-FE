import React from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONT_SIZES } from "../constants/theme";

// Screens
import DashboardScreen from "../screens/DashboardScreen";
import LeadsScreen from "../screens/LeadsScreen";
import AddLeadScreen from "../components/AddLeads";
import BookingsScreen from "../screens/BookingsScreen";
import AddBookingScreen from "../screens/AddBookingScreen";
import BookingDetailsScreen from "../screens/BookingDetailsScreen";
import BikesScreen from "../screens/BikesScreen";
import AddEditBikeScreen from "../screens/AddEditBikeScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ----------------------
// Leads Stack
// ----------------------
const LeadsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="LeadsList"
      component={LeadsScreen}
    />
    <Stack.Screen
      name="AddLead"
      component={AddLeadScreen}
    />
  </Stack.Navigator>
);

// ----------------------
// Bookings Stack
// ----------------------
const BookingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="BookingsList"
      component={BookingsScreen}
    />

    <Stack.Screen
      name="AddBooking"
      component={AddBookingScreen}
    />

    <Stack.Screen
      name="BookingDetails"
      component={BookingDetailsScreen}
    />

    <Stack.Screen
      name="AddLead"
      component={AddLeadScreen}
    />
  </Stack.Navigator>
);

// ----------------------
// Bikes Stack
// ----------------------
const BikesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="BikesList"
      component={BikesScreen}
    />
    <Stack.Screen
      name="AddEditBike"
      component={AddEditBikeScreen}
    />
  </Stack.Navigator>
);

// ----------------------
// Main Tab Navigator
// ----------------------
const AppNavigator = ({ onLogout }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard")
            iconName = focused ? "home" : "home-outline";
          // if (route.name === "Leads")
          //   iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          if (route.name === "Bookings")
            iconName = focused ? "calendar" : "calendar-outline";
          if (route.name === "Bikes")
            iconName = focused ? "bicycle" : "bicycle-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: "600",
        },

        headerShown: false,
      })}
    >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      initialParams={{ onLogout }}
    />
    {/* <Tab.Screen
      name="Leads"
      component={LeadsStack}
      options={{ headerShown: false }}
    /> */}
    <Tab.Screen
      name="Bookings"
      component={BookingsStack}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Bikes"
      component={BikesStack}
      options={{ headerShown: false }}
    />
    </Tab.Navigator>
  );
};

export default AppNavigator;
