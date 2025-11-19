import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { COLORS } from './src/constants/theme';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {!isAuthenticated ? (
          <>
            <LoginScreen onLogin={handleLogin} />
            <StatusBar style="dark" />
          </>
        ) : (
          <NavigationContainer>
            <AppNavigator onLogout={handleLogout} />
            <StatusBar style="light" />
          </NavigationContainer>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
