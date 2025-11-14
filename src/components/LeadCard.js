import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  MessageCircle,
  Phone,
  CheckCircle,
  ArrowRight,
  Clock,
  User,
} from "lucide-react-native";

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

  status: {
    new: "#2563eb",
    newBg: "#eff6ff",
    inProgress: "#d97706",
    inProgressBg: "#fef3c7",
    closed: "#059669",
    closedBg: "#ecfdf5",
  },

  source: {
    whatsapp: "#25d366",
    whatsappBg: "#f0fdf4",
    call: "#2563eb",
    callBg: "#eff6ff",
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
};

const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
};

const LeadCard = ({ lead, onOpenChat, onConvert, onClose }) => {
  const isWhatsApp = lead.source === "whatsapp";
  const sourceColor = isWhatsApp ? COLORS.source.whatsapp : COLORS.source.call;
  const sourceBgColor = isWhatsApp
    ? COLORS.source.whatsappBg
    : COLORS.source.callBg;

  const getStatusConfig = () => {
    switch (lead.status) {
      case "new":
        return {
          color: COLORS.status.new,
          bg: COLORS.status.newBg,
          label: "New Lead",
        };
      case "in_progress":
        return {
          color: COLORS.status.inProgress,
          bg: COLORS.status.inProgressBg,
          label: "In Progress",
        };
      case "closed":
        return {
          color: COLORS.status.closed,
          bg: COLORS.status.closedBg,
          label: "Closed",
        };
      default:
        return {
          color: COLORS.text.tertiary,
          bg: COLORS.background,
          label: lead.status,
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.card}>
      {/* Source Indicator Strip */}
      <View style={[styles.sourceStrip, { backgroundColor: sourceColor }]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Source Icon */}
          <View style={[styles.sourceIcon, { backgroundColor: sourceBgColor }]}>
            {isWhatsApp ? (
              <MessageCircle size={18} color={sourceColor} strokeWidth={2.5} />
            ) : (
              <Phone size={18} color={sourceColor} strokeWidth={2.5} />
            )}
          </View>

          {/* Lead Info */}
          <View style={styles.leadInfo}>
            <Text style={styles.phone}>{lead.phone}</Text>
            <View style={styles.timestampRow}>
              <Clock size={12} color={COLORS.text.tertiary} strokeWidth={2} />
              <Text style={styles.timestamp}>
                {formatTimestamp(lead.timestamp)}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Badge */}
        <View
          style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: statusConfig.color }]}
          />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Message Preview */}
      <View style={styles.messageContainer}>
        <Text style={styles.message} numberOfLines={2}>
          {lead.message}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={onOpenChat}
          activeOpacity={0.8}
        >
          {isWhatsApp ? (
            <MessageCircle size={16} color="#fff" strokeWidth={2.5} />
          ) : (
            <Phone size={16} color="#fff" strokeWidth={2.5} />
          )}
          <Text style={styles.primaryButtonText}>
            {isWhatsApp ? "Open Chat" : "Call Back"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={onConvert}
          activeOpacity={0.8}
        >
          <ArrowRight
            size={16}
            color={COLORS.text.secondary}
            strokeWidth={2.5}
          />
          <Text style={styles.secondaryButtonText}>Convert</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.tertiaryButton]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <CheckCircle
            size={16}
            color={COLORS.status.closed}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    overflow: "hidden",
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

  sourceStrip: {
    height: 3,
    width: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: SPACING.md,
  },

  sourceIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },

  leadInfo: {
    flex: 1,
  },

  phone: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },

  timestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },

  timestamp: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    gap: SPACING.xs,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: "600",
  },

  messageContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },

  message: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  tertiaryButton: {
    backgroundColor: COLORS.status.closedBg,
    paddingHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  primaryButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    color: "#fff",
  },

  secondaryButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    color: COLORS.text.secondary,
  },
});

export default LeadCard;
