import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import BikeCard from '../components/BikeCard';
import { bikesService } from '../services/dataService';
import { mockBikes } from '../services/mockData';

const BikesScreen = () => {
  const navigation = useNavigation();
  const [bikes, setBikes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      // For now, use mock data. Replace with actual API call when backend is ready
      // const data = await bikesService.getAllBikes();
      setBikes(mockBikes);
    } catch (error) {
      console.error('Error loading bikes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBikes();
    setRefreshing(false);
  };

  const handleEditBike = (bike) => {
    navigation.navigate('AddEditBike', { bike });
  };

  const renderBike = ({ item }) => (
    <BikeCard bike={item} onEdit={() => handleEditBike(item)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bikes}
        renderItem={renderBike}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bikes found</Text>
            <Text style={styles.emptySubtext}>Add your first bike to get started</Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, SHADOWS.medium]}
        onPress={() => navigation.navigate('AddEditBike')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  listContainer: {
    paddingVertical: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: COLORS.background,
    fontWeight: 'bold',
  },
});

export default BikesScreen;
