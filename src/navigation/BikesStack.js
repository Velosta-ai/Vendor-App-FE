import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import BikesScreen from "../screens/BikesScreen";
import AddEditBikeScreen from "../screens/AddEditBikeScreen";

const Stack = createStackNavigator();

export default function BikesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BikesList" component={BikesScreen} />
      <Stack.Screen name="AddEditBike" component={AddEditBikeScreen} />
    </Stack.Navigator>
  );
}
