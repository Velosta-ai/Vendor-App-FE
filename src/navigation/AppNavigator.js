import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
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
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: "white",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="LeadsList"
      component={LeadsScreen}
      options={{ title: "Leads" }}
    />
    <Stack.Screen
      name="AddLead"
      component={AddLeadScreen}
      options={{ title: "Add Lead" }}
    />
  </Stack.Navigator>
);

// ----------------------
// Bookings Stack
// ----------------------
const BookingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: "white",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="BookingsList"
      component={BookingsScreen}
      options={{ title: "Bookings" }}
    />

    <Stack.Screen
      name="AddBooking"
      component={AddBookingScreen}
      options={{ title: "Add Booking" }}
    />

    <Stack.Screen
      name="BookingDetails"
      component={BookingDetailsScreen}
      options={{ title: "Booking Details" }} // ✅ CLEANED
    />

    <Stack.Screen
      name="AddLead"
      component={AddLeadScreen}
      options={{ title: "Add Lead" }}
    />
  </Stack.Navigator>
);

// ----------------------
// Bikes Stack
// ----------------------
const BikesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.background,
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="BikesList"
      component={BikesScreen}
      options={{ title: "Bikes" }}
    />
    <Stack.Screen
      name="AddEditBike"
      component={AddEditBikeScreen}
      options={({ route }) => ({
        title: route.params?.bike ? "Edit Bike" : "Add Bike",
      })}
    />
  </Stack.Navigator>
);

// ----------------------
// Main Tab Navigator
// ----------------------
const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Dashboard")
          iconName = focused ? "home" : "home-outline";
        if (route.name === "Leads")
          iconName = focused ? "chatbubbles" : "chatbubbles-outline";
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
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: FONT_SIZES.xs,
        fontWeight: "600",
      },

      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.background,
      headerTitleStyle: { fontWeight: "bold" },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen
      name="Leads"
      component={LeadsStack}
      options={{ headerShown: false }}
    />
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

export default AppNavigator;
