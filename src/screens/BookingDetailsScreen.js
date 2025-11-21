// src/screens/BookingDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAlert } from "../contexts/AlertContext";
import {
  Edit3,
  Trash2,
  CheckCircle2,
  MessageCircle,
  IndianRupee,
  X,
  MessageSquare,
} from "lucide-react-native";
import { bookingsService } from "../services/dataService";

import {
  COLORS as THEME_COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../constants/theme";

const COLORS = {
  primary: THEME_COLORS.primary,
  background: THEME_COLORS.background,
  surface: THEME_COLORS.surface,
  text: {
    primary: THEME_COLORS.textPrimary,
    secondary: THEME_COLORS.textSecondary,
    tertiary: "#94a3b8",
  },
  border: { light: THEME_COLORS.borderLight },
};

const BookingDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { showSuccess, showError, showWarning } = useAlert();
  const { id } = route.params || {};
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [additionalPayment, setAdditionalPayment] = useState("");

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingsService.getBookingById(id);
      setBooking(data);
    } catch (err) {
      console.error(err);
      showError("Error", "Failed to load booking");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const handleEdit = () => {
    navigation.navigate("AddBooking", { editBooking: booking });
  };

  const handleMarkReturned = () => {
    // Always show payment modal to allow adding payment
    setShowPaymentModal(true);
    setAdditionalPayment("");
  };

  const confirmMarkReturned = async (additionalAmount = 0) => {
    try {
      const newPaidAmount = (booking.paidAmount || 0) + additionalAmount;

      // Update paid amount if additional payment is provided
      if (additionalAmount > 0) {
        await bookingsService.updateBooking(id, {
          ...booking,
          paidAmount: newPaidAmount,
        });
      }

      // Mark as returned
      await bookingsService.markReturned(id);
      setShowPaymentModal(false);
      showSuccess("Success", "Marked as returned");
      loadBooking();
    } catch (err) {
      console.error(err);
      showError("Error", "Failed to mark returned");
    }
  };

  const handlePaymentSubmit = () => {
    const amount = parseFloat(additionalPayment) || 0;
    const balance = Math.max(
      0,
      (booking.totalAmount || 0) - (booking.paidAmount || 0)
    );

    if (amount < 0) {
      showError("Error", "Amount cannot be negative");
      return;
    }

    if (amount > balance) {
      showError(
        "Error",
        `Amount cannot exceed balance of ₹${balance.toLocaleString("en-IN")}`
      );
      return;
    }

    confirmMarkReturned(amount);
  };

  const handleDelete = () => {
    showWarning("Delete booking", "This cannot be undone. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await bookingsService.deleteBooking(id);
            showSuccess("Deleted", "Booking deleted");
            navigation.goBack();
          } catch (err) {
            console.error(err);
            showError("Error", "Failed to delete");
          }
        },
      },
    ]);
  };

  const handleWhatsApp = () => {
    const phone = booking?.phone?.replace(/\D/g, "");
    if (!phone) {
      showError("Error", "Invalid phone number");
      return;
    }

    const bikeName = booking?.bike?.name || booking?.bikeName || "your bike";
    const bookingId = booking?.id || "";
    const start = booking?.startDate ? new Date(booking.startDate) : null;
    const end = booking?.endDate ? new Date(booking.endDate) : null;

    const formattedStart = start
      ? start.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

    const formattedEnd = end
      ? end.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

    const totalAmount = booking?.totalAmount ?? "N/A";
    const paidAmount = booking?.paidAmount ?? "N/A";
    const balance = totalAmount - paidAmount;

    const vendorName = "Velosta Rentals"; // <-- change or make dynamic

    const msg = `
Hi ${booking?.customerName},

Here are the details of your bike booking:

🆔 *Booking ID:* ${bookingId}
🏍 *Bike:* ${bikeName}
📅 *From:* ${formattedStart}
📅 *To:* ${formattedEnd}

💰 *Total Amount:* ₹${totalAmount}
💵 *Paid:* ₹${paidAmount}
💳 *Balance:* ₹${balance}

If you have any questions, feel free to reply here.
  
Regards,  
*${vendorName}*  
  `.trim();

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else showError("Error", "Cannot open WhatsApp");
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View
          style={[
            styles.container,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <Text style={{ padding: 20 }}>No booking found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(booking.endDate) - new Date(booking.startDate)) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.name}>{booking.customerName}</Text>
              <Text style={styles.sub}>{booking.phone}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleWhatsApp}>
                <MessageSquare size={18} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn} onPress={handleEdit}>
                <Edit3 size={18} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bike */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bike</Text>
            <Text style={styles.sectionValue}>
              {booking.bike?.name || booking.bikeName}
            </Text>
            <Text style={styles.muted}>{booking.bike?.model || ""}</Text>
          </View>

          {/* Dates */}
          <View style={styles.row}>
            <View style={styles.smallCard}>
              <Text style={styles.smallTitle}>Start</Text>
              <Text style={styles.smallValue}>
                {new Date(booking.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.smallCard}>
              <Text style={styles.smallTitle}>End</Text>
              <Text style={styles.smallValue}>
                {new Date(booking.endDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.smallCard}>
              <Text style={styles.smallTitle}>Duration</Text>
              <Text style={styles.smallValue}>
                {days} {days === 1 ? "day" : "days"}
              </Text>
            </View>
          </View>

          {/* Payment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.muted}>Total</Text>
              <Text style={styles.sectionValue}>
                ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.muted}>Paid</Text>
              <Text style={styles.sectionValue}>
                ₹{(booking.paidAmount || 0).toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={styles.rowBetween}>
              <Text style={styles.muted}>Balance</Text>
              <Text
                style={[
                  styles.sectionValue,
                  {
                    color:
                      booking.totalAmount - booking.paidAmount > 0
                        ? "#d97706"
                        : "#059669",
                  },
                ]}
              >
                ₹
                {Math.max(
                  0,
                  (booking.totalAmount || 0) - (booking.paidAmount || 0)
                ).toLocaleString("en-IN")}
              </Text>
            </View>
          </View>

          {/* Notes */}
          {booking.notes ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.sectionValue}>{booking.notes}</Text>
            </View>
          ) : null}

          {/* Footer CTAs */}
          <View style={styles.footer}>
            {booking.status !== "RETURNED" && (
              <TouchableOpacity
                style={[styles.cta, { backgroundColor: "#059669" }]}
                onPress={handleMarkReturned}
              >
                <CheckCircle2 size={18} color="#fff" />
                <Text style={styles.ctaText}>Mark Returned</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.cta, { backgroundColor: "#ef4444" }]}
              onPress={handleDelete}
            >
              <Trash2 size={18} color="#fff" />
              <Text style={styles.ctaText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment</Text>
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={24} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Balance Amount</Text>
                <Text style={styles.balanceAmount}>
                  ₹
                  {Math.max(
                    0,
                    (booking.totalAmount || 0) - (booking.paidAmount || 0)
                  ).toLocaleString("en-IN")}
                </Text>
              </View>

              <View style={styles.paymentInputGroup}>
                <Text style={styles.paymentLabel}>Remaining Payment (₹)</Text>
                <View style={styles.paymentInputContainer}>
                  <View style={styles.paymentInputIcon}>
                    <IndianRupee size={20} color={COLORS.text.tertiary} />
                  </View>
                  <TextInput
                    style={styles.paymentInput}
                    value={additionalPayment}
                    onChangeText={(text) => {
                      // Only allow numbers and decimal point
                      const cleaned = text.replace(/[^0-9.]/g, "");
                      // Only allow one decimal point
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
                    ₹{(booking.paidAmount || 0).toLocaleString("en-IN")}
                  </Text>
                </View>
                {additionalPayment && parseFloat(additionalPayment) > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Additional</Text>
                    <Text
                      style={[styles.summaryValue, { color: COLORS.primary }]}
                    >
                      +₹
                      {parseFloat(additionalPayment || 0).toLocaleString(
                        "en-IN"
                      )}
                    </Text>
                  </View>
                )}
                <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                  <Text style={styles.summaryLabelTotal}>
                    Total Paid Amount
                  </Text>
                  <Text style={styles.summaryValueTotal}>
                    ₹
                    {(
                      (booking.paidAmount || 0) +
                      parseFloat(additionalPayment || 0)
                    ).toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handlePaymentSubmit}
              >
                <CheckCircle2 size={20} color="#fff" />
                <Text style={styles.modalConfirmText}>Mark Returned</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  content: { padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 20, fontWeight: "700", color: COLORS.text.primary },
  sub: { color: COLORS.text.secondary, marginTop: 3 },
  actionRow: { flexDirection: "row", gap: 8 }, // gap not supported everywhere but it's fine visually
  iconBtn: { marginLeft: 10, padding: 8, borderRadius: 8 },
  section: { marginTop: 16 },
  sectionTitle: {
    color: COLORS.text.secondary,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 6,
  },
  sectionValue: { fontSize: 16, fontWeight: "600", color: COLORS.text.primary },
  muted: { color: COLORS.text.tertiary, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  smallCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  smallTitle: { color: COLORS.text.secondary, fontSize: 12, fontWeight: "700" },
  smallValue: { fontSize: 14, fontWeight: "700", marginTop: 6 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  ctaText: { color: "#fff", fontWeight: "700", marginLeft: 8 },

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

export default BookingDetailsScreen;
