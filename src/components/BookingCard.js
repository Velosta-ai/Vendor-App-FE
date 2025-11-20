import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Bike,
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  CheckCircle2,
  MapPin,
} from "lucide-react-native";

import { COLORS as THEME_COLORS } from "../constants/theme";

const COLORS = {
  primary: THEME_COLORS.primary,
  surface: THEME_COLORS.surface,

  text: {
    primary: THEME_COLORS.textPrimary,
    secondary: THEME_COLORS.textSecondary,
    tertiary: "#94a3b8",
  },

  border: {
    light: THEME_COLORS.borderLight,
  },

  status: {
    active: THEME_COLORS.info,
    activeBg: "#08ad37ff",
    upcoming: THEME_COLORS.warning,
    upcomingBg: "#fef3c7",
    returned: THEME_COLORS.success,
    returnedBg: "#ecfdf5",
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
};

const TYPOGRAPHY = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
};

const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
};

const BookingCard = ({
  booking,
  onMarkReturned,
  onSendConfirmation,
  hideActions,
}) => {
  const getStatusConfig = () => {
    switch (booking.status) {
      case "ACTIVE":
        return {
          label: "Active",
          color: "white",
          bg: COLORS.status.activeBg,
        };
      case "UPCOMING":
        return {
          label: "Upcoming",
          color: COLORS.status.upcoming,
          bg: COLORS.status.upcomingBg,
        };
      case "RETURNED":
        return {
          label: "Returned",
          color: COLORS.status.returned,
          bg: COLORS.status.returnedBg,
        };
      default:
        return {
          label: "Unknown",
          color: COLORS.text.tertiary,
          bg: COLORS.border.light,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDuration = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? "day" : "days"}`;
  };
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.bikeIcon}>
            <Bike size={20} color={COLORS.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.bikeName}>{booking.bike.name}</Text>
            <Text style={styles.bikeModel}>
              {booking.bike.registrationNumber || "Standard"}
            </Text>
          </View>
        </View>

        <View
          style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
        >
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <User size={16} color={COLORS.text.tertiary} />
          <Text style={styles.infoText}>{booking.customerName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Phone size={16} color={COLORS.text.tertiary} />
          <Text style={styles.infoText}>{booking.phone}</Text>
        </View>
      </View>

      {/* Date Info */}
      <View style={styles.section}>
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Calendar size={16} color={COLORS.text.tertiary} />
            <View>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(booking.startDate)}
              </Text>
            </View>
          </View>
          <View style={styles.dateSeparator} />
          <View style={styles.dateItem}>
            <Calendar size={16} color={COLORS.text.tertiary} />
            <View>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(booking.endDate)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.durationBadge}>
          <Clock size={12} color={COLORS.text.secondary} />
          <Text style={styles.durationText}>{getDuration()}</Text>
        </View>
      </View>

      {/* Location (if available) */}
      {booking.location && (
        <View style={styles.locationRow}>
          <MapPin size={14} color={COLORS.text.tertiary} />
          <Text style={styles.locationText}>{booking.location}</Text>
        </View>
      )}

      {/* Amount */}
      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amountValue}>
          ₹{booking.totalAmount?.toLocaleString("en-IN") || "0"}
        </Text>
      </View>

      {/* Actions */}
      {!hideActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onSendConfirmation}
            activeOpacity={0.7}
          >
            <MessageCircle size={18} color={COLORS.text.secondary} />
            <Text style={styles.actionText}>Send Message</Text>
          </TouchableOpacity>

          {booking.status === "active" && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={onMarkReturned}
              activeOpacity={0.7}
            >
              <CheckCircle2 size={18} color="#fff" />
              <Text style={styles.actionTextPrimary}>Mark Returned</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    flex: 1,
  },
  bikeIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerInfo: {
    flex: 1,
  },
  bikeName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  bikeModel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
  },

  // Sections
  section: {
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },

  // Dates
  dateRow: {
    flexDirection: "row",
    marginBottom: SPACING.sm,
  },
  dateItem: {
    flex: 1,
    flexDirection: "row",
    gap: SPACING.sm,
  },
  dateSeparator: {
    width: 1,
    backgroundColor: COLORS.border.light,
    marginHorizontal: SPACING.md,
  },
  dateLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    marginBottom: 2,
    fontWeight: "500",
  },
  dateValue: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.primary,
    fontWeight: "600",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: COLORS.border.light,
    borderRadius: RADIUS.sm,
  },
  durationText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.secondary,
    fontWeight: "600",
  },

  // Location
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  locationText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },

  // Amount
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  amountValue: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: "700",
    color: COLORS.text.primary,
  },

  // Actions
  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.border.light,
    gap: 6,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  actionText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
  actionTextPrimary: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    color: "#fff",
  },
});

export default BookingCard;
