import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import BookingsScreen from "../screens/BookingsScreen";
import AddBookingScreen from "../screens/AddBookingScreen";
import BookingDetailsScreen from "../screens/BookingDetailsScreen";
import AddLeadScreen from "../components/AddLeads";

const Stack = createStackNavigator();

export default function BookingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="AddBooking" component={AddBookingScreen} />
      <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
      <Stack.Screen name="AddLead" component={AddLeadScreen} />
    </Stack.Navigator>
  );
}
