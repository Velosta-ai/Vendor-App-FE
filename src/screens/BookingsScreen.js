import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import BookingCard from '../components/BookingCard';
import { bookingsService } from '../services/dataService';
import { mockBookings } from '../services/mockData';

const BookingsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.params?.tab || 'active');
  const [bookings, setBookings] = useState(mockBookings);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (route.params?.tab) {
      setActiveTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const loadBookings = async () => {
    try {
      // For now, use mock data. Replace with actual API call when backend is ready
      // const active = await bookingsService.getActiveBookings();
      // const upcoming = await bookingsService.getUpcomingBookings();
      // const returned = await bookingsService.getReturnedBookings();
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleMarkReturned = async (booking) => {
    Alert.alert(
      'Mark as Returned',
      `Confirm return for ${booking.customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              // await bookingsService.markAsReturned(booking.id);
              // Update local state
              const updatedBooking = { ...booking, status: 'returned' };
              setBookings({
                ...bookings,
                active: bookings.active.filter(b => b.id !== booking.id),
                returned: [...bookings.returned, updatedBooking],
              });
              Alert.alert('Success', 'Booking marked as returned');
            } catch (error) {
              Alert.alert('Error', 'Failed to mark booking as returned');
            }
          },
        },
      ]
    );
  };

  const handleSendConfirmation = (booking) => {
    const message = `Hey ${booking.customerName}, your booking for ${booking.bikeName} is confirmed from ${booking.startDate} to ${booking.endDate}. Thank you for choosing Velosta ✅`;
    const url = `https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open WhatsApp');
      }
    });
  };

  const renderTab = (tab, label) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBooking = ({ item }) => (
    <BookingCard
      booking={item}
      onMarkReturned={() => handleMarkReturned(item)}
      onSendConfirmation={() => handleSendConfirmation(item)}
      hideActions={activeTab === 'returned'}
    />
  );

  const getCurrentBookings = () => {
    return bookings[activeTab] || [];
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTab('active', 'Active')}
        {renderTab('upcoming', 'Upcoming')}
        {renderTab('returned', 'Returned')}
      </View>

      {/* Bookings List */}
      <FlatList
        data={getCurrentBookings()}
        renderItem={renderBooking}
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
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, SHADOWS.medium]}
        onPress={() => navigation.navigate('AddBooking')}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
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

export default BookingsScreen;
