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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Edit3,
  Trash2,
  CheckCircle2,
  MessageCircle,
} from "lucide-react-native";
import { bookingsService } from "../services/dataService";

const COLORS = {
  primary: "#2563eb",
  background: "#f8f9fb",
  surface: "#ffffff",
  text: { primary: "#0f172a", secondary: "#475569", tertiary: "#94a3b8" },
  border: { light: "#e2e8f0" },
};

const BookingDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingsService.getBookingById(id);
      setBooking(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load booking");
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
    Alert.alert("Mark Returned", "Confirm mark as returned?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          try {
            await bookingsService.markReturned(id);
            Alert.alert("Success", "Marked as returned");
            loadBooking();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to mark returned");
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete booking", "This cannot be undone. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await bookingsService.deleteBooking(id);
            Alert.alert("Deleted", "Booking deleted");
            navigation.goBack();
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Failed to delete");
          }
        },
      },
    ]);
  };

  const handleWhatsApp = () => {
    const phone = booking?.phone?.replace(/\D/g, "");
    const msg = `Hi ${
      booking?.customerName
    }, this is a message about your booking for ${
      booking?.bike?.name || booking?.bikeName
    }.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else Alert.alert("Error", "Cannot open WhatsApp");
    });
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20 }}>No booking found.</Text>
      </View>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.name}>{booking.customerName}</Text>
            <Text style={styles.sub}>{booking.phone}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={handleWhatsApp}>
              <MessageCircle size={18} color={COLORS.primary} />
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
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
});

export default BookingDetailsScreen;
