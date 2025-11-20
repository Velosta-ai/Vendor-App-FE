import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import { COLORS } from './src/constants/theme';
import { LoadingProvider, useLoading } from './src/contexts/LoadingContext';
import { AlertProvider, useAlert } from './src/contexts/AlertContext';
import GlobalLoader from './src/components/GlobalLoader';
import AlertModal from './src/components/AlertModal';
import { setLoadingManager } from './src/services/dataService';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { alert, hideAlert } = useAlert();

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
        <AlertModal
          visible={alert.visible}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          buttons={alert.buttons}
          onClose={hideAlert}
        />
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </LoadingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
