import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Bike,
  Edit3,
  Calendar,
  DollarSign,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react-native";

const COLORS = {
  primary: "#2563eb",
  surface: "#ffffff",

  text: {
    primary: "#0f172a",
    secondary: "#475569",
    tertiary: "#94a3b8",
  },

  border: {
    light: "#e2e8f0",
  },

  status: {
    available: "#059669",
    availableBg: "#ecfdf5",
    rented: "#d97706",
    rentedBg: "#fef3c7",
    maintenance: "#dc2626",
    maintenanceBg: "#fef2f2",
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

const BikeCard = ({ bike, onEdit }) => {
  const getStatusConfig = () => {
    switch (bike.status) {
      case "available":
        return {
          label: "Available",
          color: COLORS.status.available,
          bg: COLORS.status.availableBg,
          icon: <CheckCircle2 size={12} color={COLORS.status.available} />,
        };
      case "rented":
        return {
          label: "Rented",
          color: COLORS.status.rented,
          bg: COLORS.status.rentedBg,
          icon: <Clock size={12} color={COLORS.status.rented} />,
        };
      case "maintenance":
        return {
          label: "Maintenance",
          color: COLORS.status.maintenance,
          bg: COLORS.status.maintenanceBg,
          icon: <AlertCircle size={12} color={COLORS.status.maintenance} />,
        };
      default:
        return {
          label: "Unknown",
          color: COLORS.text.tertiary,
          bg: COLORS.border.light,
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.bikeIcon, { backgroundColor: statusConfig.bg }]}>
            <Bike size={20} color={statusConfig.color} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.bikeName}>{bike.name}</Text>
            <Text style={styles.bikeModel}>
              {bike.model || "Standard Model"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Edit3 size={18} color={COLORS.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Info Grid */}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Settings size={14} color={COLORS.text.tertiary} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Registration</Text>
            <Text style={styles.infoValue}>
              {bike.registrationNumber || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Calendar size={14} color={COLORS.text.tertiary} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Year</Text>
            <Text style={styles.infoValue}>{bike.year || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <DollarSign size={14} color={COLORS.text.tertiary} />
          </View>
          <View>
            <Text style={styles.infoLabel}>Daily Rate</Text>
            <Text style={styles.infoValue}>
              ₹{bike.dailyRate?.toLocaleString("en-IN") || "0"}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View
          style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
        >
          {statusConfig.icon}
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>

        {bike.currentBooking && (
          <Text style={styles.bookingInfo}>
            Rented to {bike.currentBooking.customerName}
          </Text>
        )}
      </View>
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
  editButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.border.light,
    alignItems: "center",
    justifyContent: "center",
  },

  // Info Grid
  infoGrid: {
    flexDirection: "row",
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    gap: SPACING.xs,
    paddingRight: SPACING.sm,
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    marginBottom: 2,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.primary,
    fontWeight: "600",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
  },
  bookingInfo: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
    fontStyle: "italic",
  },
});

export default BikeCard;
