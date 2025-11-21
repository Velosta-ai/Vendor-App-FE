import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./src/contexts/AuthContext";
import { LoadingProvider } from "./src/contexts/LoadingContext";
import { AlertProvider } from "./src/contexts/AlertContext";

import GlobalLoader from "./src/components/GlobalLoader";
import AlertModal from "./src/components/AlertModal";

import RootNavigator from "./src/navigation/RootNavigator";
import { setLoadingManager } from "./src/services/dataService";
import { useLoading } from "./src/contexts/LoadingContext";
import { useAlert } from "./src/contexts/AlertContext";

function AppContent() {
  const { showLoading, hideLoading } = useLoading();
  const { alert, hideAlert } = useAlert();

  useEffect(() => {
    setLoadingManager({ showLoading, hideLoading });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="light" />
      </NavigationContainer>

      <GlobalLoader />
      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        onClose={hideAlert}
      />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
