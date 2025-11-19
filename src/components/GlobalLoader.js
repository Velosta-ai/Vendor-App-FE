import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';
import { COLORS } from '../constants/theme';

const GlobalLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default GlobalLoader;

