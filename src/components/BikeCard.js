// src/components/BikeCard.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Bike, Edit, Wrench } from "lucide-react-native"; // 🔥 FIXED: Tools → Wrench

import {
  COLORS as THEME_COLORS,
  SPACING as THEME_SPACING,
  FONT_SIZES as THEME_FONT_SIZES,
  BORDER_RADIUS as THEME_BORDER_RADIUS,
} from "../constants/theme";

const COLORS = {
  primary: THEME_COLORS.primary,
  surface: THEME_COLORS.surface,
  background: THEME_COLORS.background,
  textPrimary: THEME_COLORS.textPrimary,
  textSecondary: THEME_COLORS.textSecondary,
  success: THEME_COLORS.success,
  warning: THEME_COLORS.warning,
  error: THEME_COLORS.error,
  borderLight: THEME_COLORS.borderLight,
};

const TYPO = {
  sm: THEME_FONT_SIZES.md,      // Increased from sm
  base: THEME_FONT_SIZES.lg,     // Increased from md
  lg: THEME_FONT_SIZES.xxl,      // Increased from xl
};

const RADIUS = THEME_BORDER_RADIUS;

const BikeCard = ({
  bike,
  onEdit = () => {},
  onToggleMaintenance = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (bike.status === "AVAILABLE") {
      Alert.alert(
        "Move to Maintenance?",
        `${bike.name} will be unavailable for booking until restored.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: async () => {
              setLoading(true);
              try {
                await onToggleMaintenance(bike);
              } finally {
                setLoading(false);
              }
            },
            style: "destructive",
          },
        ]
      );
      return;
    }

    setLoading(true);
    try {
      await onToggleMaintenance(bike);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel =
    bike.status === "MAINTENANCE"
      ? "Maintenance"
      : bike.status === "RENTED"
      ? "Rented"
      : "Available";

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Bike size={24} color={COLORS.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{bike.name}</Text>
          <Text style={styles.reg}>{bike.registrationNumber}</Text>
          <Text style={styles.rate}>₹{bike.dailyRate}/day</Text>
        </View>
      </View>

      <View style={styles.right}>
        <View
          style={[
            styles.statusPill,
            bike.status === "MAINTENANCE" && styles.statusMaintenance,
            bike.status === "RENTED" && styles.statusRented,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              bike.status === "MAINTENANCE" && { color: COLORS.error },
              bike.status === "RENTED" && { color: COLORS.warning },
            ]}
          >
            {statusLabel}
          </Text>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Edit size={16} color={COLORS.primary} />
        </TouchableOpacity>

        {/* TEMP: Maintenance button commented out */}
        {/* <TouchableOpacity
          style={[
            styles.maintBtn,
            bike.status === "MAINTENANCE" ? styles.maintBtnActive : null,
          ]}
          onPress={handleToggle}
          activeOpacity={0.8}
          disabled={loading || bike.status === "RENTED"}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Wrench size={14} color="#fff" />
              <Text style={styles.maintBtnText}>
                {bike.status === "MAINTENANCE" ? "Restore" : "Maintenance"}
              </Text>
            </>
          )}
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: THEME_SPACING.lg,
    marginHorizontal: THEME_SPACING.lg,
    marginVertical: THEME_SPACING.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  left: { flexDirection: "row", gap: 12, flex: 1, alignItems: "center" },

  iconWrap: {
    width: 64,        // Increased from 56
    height: 64,       // Increased from 56
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  name: { fontSize: TYPO.lg, fontWeight: "700", color: COLORS.textPrimary },
  reg: { fontSize: TYPO.sm, color: COLORS.textSecondary, marginTop: 4 },
  rate: {
    fontSize: TYPO.base,   // Increased from sm
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 6,
  },

  right: { alignItems: "flex-end" },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#E8F8EE",
    marginBottom: 8,
  },

  statusText: { fontSize: 14, fontWeight: "700", color: COLORS.success },  // Increased from 12

  statusMaintenance: { backgroundColor: "#FFE4E6" },
  statusRented: { backgroundColor: "#FFF4D6" },

  editBtn: {
    marginBottom: 8,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },

  maintBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  maintBtnActive: {
    backgroundColor: COLORS.primary,
  },

  maintBtnText: { color: "#fff", fontWeight: "700", fontSize: TYPO.sm },
});

export default BikeCard;
