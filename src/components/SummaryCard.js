import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { TrendingUp, TrendingDown, Minus } from "lucide-react-native";

// Professional Colors (matching BikesScreen)
const COLORS = {
  primary: "#2563eb",
  background: "#f8f9fb",
  surface: "#ffffff",

  text: {
    primary: "#0f172a",
    secondary: "#475569",
    tertiary: "#94a3b8",
  },

  border: {
    light: "#e2e8f0",
    medium: "#cbd5e1",
  },

  accent: {
    blue: "#2563eb",
    blueBg: "#eff6ff",
    green: "#059669",
    greenBg: "#ecfdf5",
    orange: "#d97706",
    orangeBg: "#fef3c7",
    purple: "#7c3aed",
    purpleBg: "#f5f3ff",
    red: "#dc2626",
    redBg: "#fef2f2",
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

const TYPOGRAPHY = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 24,
  xxl: 28,
};

const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
};

const SummaryCard = ({
  title,
  value,
  icon: IconComponent,
  iconColor,
  iconBgColor,
  trend, // 'up', 'down', 'neutral'
  trendValue, // e.g., '+12%'
  onPress,
  variant = "default", // 'default', 'primary', 'success', 'warning', 'danger'
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case "primary":
        return {
          iconColor: COLORS.accent.blue,
          iconBg: COLORS.accent.blueBg,
        };
      case "success":
        return {
          iconColor: COLORS.accent.green,
          iconBg: COLORS.accent.greenBg,
        };
      case "warning":
        return {
          iconColor: COLORS.accent.orange,
          iconBg: COLORS.accent.orangeBg,
        };
      case "danger":
        return {
          iconColor: COLORS.accent.red,
          iconBg: COLORS.accent.redBg,
        };
      case "purple":
        return {
          iconColor: COLORS.accent.purple,
          iconBg: COLORS.accent.purpleBg,
        };
      default:
        return {
          iconColor: iconColor || COLORS.primary,
          iconBg: iconBgColor || COLORS.accent.blueBg,
        };
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return (
          <TrendingUp size={12} color={COLORS.accent.green} strokeWidth={2.5} />
        );
      case "down":
        return (
          <TrendingDown size={12} color={COLORS.accent.red} strokeWidth={2.5} />
        );
      case "neutral":
        return (
          <Minus size={12} color={COLORS.text.tertiary} strokeWidth={2.5} />
        );
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return COLORS.accent.green;
      case "down":
        return COLORS.accent.red;
      default:
        return COLORS.text.tertiary;
    }
  };

  const colors = getVariantColors();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Icon */}
      {IconComponent && (
        <View
          style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}
        >
          <IconComponent size={22} color={colors.iconColor} strokeWidth={2.5} />
        </View>
      )}

      {/* Value */}
      <Text style={styles.value}>{value}</Text>

      {/* Title & Trend */}
      <View style={styles.footer}>
        <Text style={styles.title}>{title}</Text>
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            {getTrendIcon()}
            <Text style={[styles.trendValue, { color: getTrendColor() }]}>
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 140,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    margin: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },

  value: {
    fontSize: TYPOGRAPHY.xxl,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },

  title: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
    flex: 1,
  },

  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },

  trendValue: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
  },
});

export default SummaryCard;
