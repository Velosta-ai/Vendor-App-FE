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
  Modal,
  TextInput,
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
  IndianRupee,
  X,
} from "lucide-react-native";
import { Swipeable } from "react-native-gesture-handler";

import BookingCard from "../components/BookingCard";
import { bookingsService } from "../services/dataService";

import { COLORS as THEME_COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants/theme";

const COLORS = {
  primary: THEME_COLORS.primary,
  background: THEME_COLORS.background,
  surface: THEME_COLORS.surface,
  text: { primary: THEME_COLORS.textPrimary, secondary: THEME_COLORS.textSecondary, tertiary: "#94a3b8" },
  border: { light: THEME_COLORS.borderLight, medium: THEME_COLORS.border },
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [additionalPayment, setAdditionalPayment] = useState("");

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
    // Show payment modal to allow adding payment
    setSelectedBooking(booking);
    setShowPaymentModal(true);
    setAdditionalPayment("");
  };

  const confirmMarkReturned = async () => {
    if (!selectedBooking) return;

    const amount = parseFloat(additionalPayment) || 0;
    const balance = Math.max(
      0,
      (selectedBooking.totalAmount || 0) - (selectedBooking.paidAmount || 0)
    );

    if (amount < 0) {
      Alert.alert("Error", "Amount cannot be negative");
      return;
    }

    if (amount > balance) {
      Alert.alert("Error", `Amount cannot exceed balance of ₹${balance.toLocaleString("en-IN")}`);
      return;
    }

    try {
      const newPaidAmount = (selectedBooking.paidAmount || 0) + amount;

      // Update paid amount if additional payment is provided
      if (amount > 0) {
        await bookingsService.updateBooking(selectedBooking.id, {
          ...selectedBooking,
          paidAmount: newPaidAmount,
        });
      }

      // Mark as returned
      const res = await bookingsService.markReturned(selectedBooking.id);
      if (res?.error) {
        Alert.alert("Error", res.error);
        return;
      }

      setShowPaymentModal(false);
      setSelectedBooking(null);
      setAdditionalPayment("");
      await loadBookings();
      Alert.alert("Success", "Marked as returned");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to mark as returned");
    }
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
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
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

      {/* Payment Modal */}
      {selectedBooking && (
        <Modal
          visible={showPaymentModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowPaymentModal(false);
            setSelectedBooking(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Payment</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowPaymentModal(false);
                    setSelectedBooking(null);
                  }}
                  style={styles.modalCloseButton}
                >
                  <X size={24} color={COLORS.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceLabel}>Current Balance</Text>
                  <Text style={styles.balanceAmount}>
                    ₹{Math.max(
                      0,
                      (selectedBooking.totalAmount || 0) - (selectedBooking.paidAmount || 0)
                    ).toLocaleString("en-IN")}
                  </Text>
                </View>

                <View style={styles.paymentInputGroup}>
                  <Text style={styles.paymentLabel}>Additional Payment (₹)</Text>
                  <View style={styles.paymentInputContainer}>
                    <View style={styles.paymentInputIcon}>
                      <IndianRupee size={20} color={COLORS.text.tertiary} />
                    </View>
                    <TextInput
                      style={styles.paymentInput}
                      value={additionalPayment}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9.]/g, "");
                        const parts = cleaned.split(".");
                        if (parts.length > 2) return;
                        setAdditionalPayment(cleaned);
                      }}
                      placeholder="0"
                      placeholderTextColor={COLORS.text.tertiary}
                      keyboardType="numeric"
                      autoFocus
                    />
                  </View>
                  <Text style={styles.paymentHint}>
                    Enter amount to add to paid amount (optional)
                  </Text>
                </View>

                <View style={styles.paymentSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Current Paid</Text>
                    <Text style={styles.summaryValue}>
                      ₹{(selectedBooking.paidAmount || 0).toLocaleString("en-IN")}
                    </Text>
                  </View>
                  {additionalPayment && parseFloat(additionalPayment) > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Additional</Text>
                      <Text style={[styles.summaryValue, { color: COLORS.primary }]}>
                        +₹{parseFloat(additionalPayment || 0).toLocaleString("en-IN")}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                    <Text style={styles.summaryLabelTotal}>New Paid Amount</Text>
                    <Text style={styles.summaryValueTotal}>
                      ₹{((selectedBooking.paidAmount || 0) + parseFloat(additionalPayment || 0)).toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowPaymentModal(false);
                    setSelectedBooking(null);
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={confirmMarkReturned}
                >
                  <CheckCircle2 size={20} color="#fff" />
                  <Text style={styles.modalConfirmText}>Mark Returned</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: SPACING.xl,
  },
  balanceInfo: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.primary,
  },
  paymentInputGroup: {
    marginBottom: SPACING.xl,
  },
  paymentLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  paymentInputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  paymentInputIcon: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.md,
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  paymentHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  paymentSummary: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  summaryRowTotal: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  summaryValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  summaryLabelTotal: {
    fontSize: FONT_SIZES.md,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  summaryValueTotal: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "700",
    color: COLORS.primary,
  },
  modalFooter: {
    flexDirection: "row",
    padding: SPACING.xl,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  modalCancelText: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  modalConfirmButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: "#059669",
  },
  modalConfirmText: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: "#fff",
  },
});

export default BookingsScreen;
