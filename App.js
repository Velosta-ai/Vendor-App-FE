import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { COLORS } from './src/constants/theme';
import { LoadingProvider, useLoading } from './src/contexts/LoadingContext';
import GlobalLoader from './src/components/GlobalLoader';
import { setLoadingManager } from './src/services/dataService';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    // Set loading manager for dataService
    setLoadingManager({ showLoading, hideLoading });
  }, [showLoading, hideLoading]);

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
        <GlobalLoader />
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
