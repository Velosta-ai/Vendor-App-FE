import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';

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
    </SafeAreaProvider>
  );
}
