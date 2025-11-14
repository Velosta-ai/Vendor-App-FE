import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Plus,
  Eye,
  Bike,
  TimerReset,
  Smartphone,
  Wallet,
  TrendingUp,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react-native";
import SummaryCard from "../components/SummaryCard";
import { dashboardService } from "../services/dataService";
import { mockDashboardStats } from "../services/mockData";

// 🎨 AUTHENTIC PROFESSIONAL COLORS (Inspired by Linear, Stripe, Notion)
const COLORS = {
  // Neutral Professional Palette
  primary: "#2563eb", // Deep trustworthy blue
  primaryHover: "#1d4ed8",

  // Backgrounds (subtle, not harsh white)
  background: "#f8f9fb",
  surface: "#ffffff",

  // Text hierarchy (proper contrast ratios)
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    tertiary: "#94a3b8",
    disabled: "#cbd5e1",
  },

  // Borders (very subtle)
  border: {
    light: "#e2e8f0",
    medium: "#cbd5e1",
  },

  // Status colors (muted, professional)
  status: {
    success: "#059669",
    successBg: "#ecfdf5",
    warning: "#d97706",
    warningBg: "#fef3c7",
    error: "#dc2626",
    errorBg: "#fef2f2",
    info: "#0284c7",
    infoBg: "#e0f2fe",
  },

  // Accent colors (desaturated, sophisticated)
  accent: {
    blue: "#0284c7",
    blueBg: "#e0f2fe",
    green: "#059669",
    greenBg: "#ecfdf5",
    orange: "#ea580c",
    orangeBg: "#fff7ed",
    purple: "#7c3aed",
    purpleBg: "#f5f3ff",
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

const TYPOGRAPHY = {
  // Real font sizes that look professional
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
};

const ELEVATION = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
};

// Simple, clean stat card
const StatCard = ({ title, value, subtitle, icon, bgColor, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={[styles.statIconBox, { backgroundColor: bgColor }]}>
        {icon}
      </View>

      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{title}</Text>
        <Text style={styles.statNumber}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>

      <ArrowRight size={18} color={COLORS.text.tertiary} />
    </TouchableOpacity>
  );
};

// Clean action button
const ActionButton = ({
  title,
  subtitle,
  icon,
  iconBg,
  onPress,
  isPrimary,
}) => {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, isPrimary && styles.actionBtnPrimary]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIcon, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <View style={styles.actionContent}>
        <Text
          style={[styles.actionTitle, isPrimary && styles.actionTitlePrimary]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
      </View>
      <ArrowRight size={18} color={isPrimary ? "#fff" : COLORS.text.tertiary} />
    </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState(mockDashboardStats);
  const [refreshing, setRefreshing] = useState(false);
  const [vendorName, setVendorName] = useState("Vendor");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    loadDashboardStats();
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboardStats = async () => {
    try {
      setStats(mockDashboardStats);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = () => {
    return time.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = () => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Clean header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.name}>{vendorName}</Text>
        </View>

        <View style={styles.timeInfo}>
          <View style={styles.timeRow}>
            <Calendar size={14} color={COLORS.text.secondary} />
            <Text style={styles.timeText}>{formatDate()}</Text>
          </View>
          <View style={styles.timeRow}>
            <Clock size={14} color={COLORS.text.secondary} />
            <Text style={styles.timeText}>{formatTime()}</Text>
          </View>
        </View>
      </View>

      {/* Revenue card - simple and clear */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.revenueCard} activeOpacity={0.8}>
          <View style={styles.revenueTop}>
            <View>
              <Text style={styles.revenueLabel}>Total Revenue</Text>
              <Text style={styles.revenueAmount}>
                {formatCurrency(stats.totalRevenue)}
              </Text>
            </View>
            <View style={styles.revenueIcon}>
              <Wallet size={24} color={COLORS.primary} />
            </View>
          </View>

          <View style={styles.revenueBottom}>
            <TrendingUp size={14} color={COLORS.status.success} />
            <Text style={styles.revenueChange}>+12.5% from last month</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsGrid}>
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            subtitle="5 today"
            icon={<Bike size={20} color={COLORS.primary} />}
            bgColor={COLORS.accent.blueBg}
            onPress={() => navigation.navigate("Bookings", { tab: "active" })}
          />

          <StatCard
            title="Pending Returns"
            value={stats.pendingReturns}
            subtitle="This week"
            icon={<TimerReset size={20} color={COLORS.accent.orange} />}
            bgColor={COLORS.accent.orangeBg}
            onPress={() => navigation.navigate("Bookings", { tab: "active" })}
          />

          <StatCard
            title="New Leads"
            value={stats.newLeads}
            subtitle="Follow up"
            icon={<Smartphone size={20} color={COLORS.accent.purple} />}
            bgColor={COLORS.accent.purpleBg}
            onPress={() => navigation.navigate("Leads")}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <ActionButton
          title="Create Booking"
          subtitle="Add new bike rental"
          icon={<Plus size={20} color="#fff" />}
          iconBg={COLORS.primary}
          isPrimary={true}
          onPress={() => navigation.navigate("AddBooking")}
        />

        <ActionButton
          title="View Leads"
          subtitle="Manage inquiries"
          icon={<Eye size={20} color={COLORS.accent.blue} />}
          iconBg={COLORS.accent.blueBg}
          onPress={() => navigation.navigate("Leads")}
        />

        <ActionButton
          title="Manage Fleet"
          subtitle="Update inventory"
          icon={<Bike size={20} color={COLORS.accent.purple} />}
          iconBg={COLORS.accent.purpleBg}
          onPress={() => navigation.navigate("Bikes")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },

  // Header - clean and minimal
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === "ios" ? 60 : SPACING.xxxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  name: {
    fontSize: TYPOGRAPHY.xxl,
    color: COLORS.text.primary,
    fontWeight: "700",
    marginBottom: SPACING.md,
    letterSpacing: -0.5,
  },
  timeInfo: {
    flexDirection: "row",
    gap: SPACING.lg,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },

  // Sections
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },

  // Revenue card - clean, not flashy
  revenueCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...ELEVATION.sm,
  },
  revenueTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  revenueLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  revenueAmount: {
    fontSize: TYPOGRAPHY.xxxl,
    fontWeight: "700",
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  revenueIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.accent.blueBg,
    alignItems: "center",
    justifyContent: "center",
  },
  revenueBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  revenueChange: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.status.success,
    fontWeight: "600",
  },

  // Stats grid - simple cards
  statsGrid: {
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...ELEVATION.sm,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.secondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  statNumber: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },

  // Action buttons - clean
  actionBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...ELEVATION.sm,
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  actionTitlePrimary: {
    color: "#fff",
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
});

export default DashboardScreen;
