// src/screens/BookingsScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Plus,
  CheckCircle2,
  Clock,
  Package,
  Search,
  Trash2,
  Edit3,
} from "lucide-react-native";
import { Swipeable } from "react-native-gesture-handler";

import BookingCard from "../components/BookingCard";
import { bookingsService } from "../services/dataService";

const COLORS = {
  primary: "#FF6F00",
  background: "#f8f9fb",
  surface: "#ffffff",
  text: { primary: "#0f172a", secondary: "#475569", tertiary: "#94a3b8" },
  border: { light: "#e2e8f0", medium: "#cbd5e1" },
};

const BookingsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState(route.params?.tab || "active");
  const [bookings, setBookings] = useState({
    active: [],
    upcoming: [],
    returned: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    try {
      const active = await bookingsService.getBookings("ACTIVE");
      const upcoming = await bookingsService.getBookings("UPCOMING");
      const returned = await bookingsService.getBookings("RETURNED");
      setBookings({ active, upcoming, returned });
    } catch (error) {
      console.error("Error loading bookings:", error);
      Alert.alert("Error", "Failed to load bookings");
    }
  };

  // Reload when screen focused
  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleMarkReturned = async (booking) => {
    Alert.alert(
      "Mark Returned",
      `Mark booking for ${booking.customerName} as returned?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const res = await bookingsService.markReturned(booking.id);
              if (res?.error) {
                Alert.alert("Error", res.error);
                return;
              }
              await loadBookings();
              Alert.alert("Success", "Marked as returned");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to mark as returned");
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (booking) => {
    Alert.alert(
      "Delete booking",
      `Delete booking for ${booking.customerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await bookingsService.deleteBooking(booking.id);
              if (res?.error) {
                Alert.alert("Error", res.error);
                return;
              }
              await loadBookings();
              Alert.alert("Deleted", "Booking deleted successfully");
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete booking");
            }
          },
        },
      ]
    );
  };

  const rightSwipeActions = (booking) => (
    <View style={styles.rightActions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#0ea5e9" }]}
        onPress={() =>
          navigation.navigate("AddBooking", { editBooking: booking })
        }
      >
        <Edit3 size={18} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#ef4444" }]}
        onPress={() => handleDelete(booking)}
      >
        <Trash2 size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const leftSwipeActions = (booking) =>
    booking.status !== "RETURNED" ? (
      <View style={styles.leftActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#059669" }]}
          onPress={() => handleMarkReturned(booking)}
        >
          <CheckCircle2 size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    ) : null;

  const handleSendConfirmation = (booking) => {
    const message = `Hey ${booking.customerName}, your booking for ${
      booking.bike?.name || booking.bikeName
    } is confirmed from ${booking.startDate} to ${booking.endDate}.`;
    const phone = booking.phone.replace(/\D/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert("Error", "Cannot open WhatsApp");
    });
  };

  const getCurrentBookings = () => bookings[activeTab] || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Bookings</Text>
          <Text style={styles.subtitle}>
            {(bookings.active?.length || 0) +
              (bookings.upcoming?.length || 0) +
              (bookings.returned?.length || 0)}{" "}
            total bookings
          </Text>
        </View>

        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.tabActive]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "active" && styles.tabLabelActive,
            ]}
          >
            Active
          </Text>
          <View
            style={[
              styles.countBadge,
              activeTab === "active" && styles.countBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.tabCount,
                activeTab === "active" && styles.tabCountActive,
              ]}
            >
              {bookings.active?.length || 0}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.tabActive]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "upcoming" && styles.tabLabelActive,
            ]}
          >
            Upcoming
          </Text>
          <View
            style={[
              styles.countBadge,
              activeTab === "upcoming" && styles.countBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.tabCount,
                activeTab === "upcoming" && styles.tabCountActive,
              ]}
            >
              {bookings.upcoming?.length || 0}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "returned" && styles.tabActive]}
          onPress={() => setActiveTab("returned")}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === "returned" && styles.tabLabelActive,
            ]}
          >
            Returned
          </Text>
          <View
            style={[
              styles.countBadge,
              activeTab === "returned" && styles.countBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.tabCount,
                activeTab === "returned" && styles.tabCountActive,
              ]}
            >
              {bookings.returned?.length || 0}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCurrentBookings()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        renderItem={({ item }) => (
          <Swipeable
            renderLeftActions={() => leftSwipeActions(item)}
            renderRightActions={() => rightSwipeActions(item)}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("BookingDetails", { id: item.id })
              }
            >
              <BookingCard
                booking={item}
                onSendConfirmation={() => handleSendConfirmation(item)}
                hideActions
              />
            </TouchableOpacity>
          </Swipeable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
            <Text style={styles.emptyText}>
              Pull to refresh or add a new booking.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddBooking")}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "700", color: COLORS.text.primary },
  subtitle: { fontSize: 13, color: COLORS.text.secondary },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabLabel: { fontSize: 14, color: COLORS.text.secondary, fontWeight: "600" },
  tabLabelActive: { color: COLORS.primary },
  countBadge: {
    marginTop: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countBadgeActive: { backgroundColor: `${COLORS.primary}22` },
  tabCount: { fontSize: 12, color: COLORS.text.tertiary, fontWeight: "700" },
  tabCountActive: { color: COLORS.primary },
  listContent: { paddingVertical: 12 },
  leftActions: { width: 80, justifyContent: "center", alignItems: "center" },
  rightActions: {
    width: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: { padding: 40, alignItems: "center" },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptyText: { fontSize: 13, color: COLORS.text.tertiary },
  addButton: {
    position: "absolute",
    bottom: 28,
    right: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});

export default BookingsScreen;
