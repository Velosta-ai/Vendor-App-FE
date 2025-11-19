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
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Bike,
  TimerReset,
  Smartphone,
  Wallet,
  TrendingUp,
  ArrowRight,
  Calendar,
  Clock,
  LogOut,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SummaryCard from "../components/SummaryCard";
import { dashboardService } from "../services/dataService";
import { mockDashboardStats } from "../services/mockData";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from "../constants/theme";

// Use theme colors with new palette
const THEME_COLORS = {
  primary: COLORS.primary,
  background: COLORS.background,
  surface: COLORS.surface,
  text: {
    primary: COLORS.textPrimary,
    secondary: COLORS.textSecondary,
    tertiary: "#94a3b8",
  },
  border: {
    light: COLORS.borderLight,
    medium: COLORS.border,
  },
  status: {
    success: COLORS.success,
    successBg: "#ecfdf5",
    warning: COLORS.warning,
    warningBg: "#fef3c7",
    error: COLORS.error,
    errorBg: "#fef2f2",
    info: COLORS.info,
    infoBg: "#e0f2fe",
  },
  accent: {
    blue: COLORS.info,
    blueBg: "#e0f2fe",
    green: COLORS.success,
    greenBg: "#ecfdf5",
    orange: COLORS.primary,
    orangeBg: COLORS.backgroundSecondary,
    purple: "#7c3aed",
    purpleBg: "#f5f3ff",
  },
};

// Use theme constants
const TYPOGRAPHY = {
  xs: FONT_SIZES.xs,
  sm: FONT_SIZES.sm,
  base: FONT_SIZES.md,
  md: FONT_SIZES.lg,
  lg: FONT_SIZES.xl,
  xl: FONT_SIZES.xxl,
  xxl: 28,
  xxxl: 34,
};

const RADIUS = {
  sm: BORDER_RADIUS.sm,
  md: BORDER_RADIUS.md,
  lg: BORDER_RADIUS.lg,
  xl: BORDER_RADIUS.xl,
};

const ELEVATION = SHADOWS;

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

      <ArrowRight size={18} color={THEME_COLORS.text.tertiary} />
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
      <ArrowRight size={18} color={isPrimary ? "#fff" : THEME_COLORS.text.tertiary} />
    </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
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

  const handleLogout = () => {
    const onLogout = route.params?.onLogout;
    if (onLogout) {
      onLogout();
    } else {
      // Fallback: try to navigate back
      navigation.getParent()?.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME_COLORS.primary]}
            tintColor={THEME_COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Clean header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.name}>{vendorName}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={20} color={THEME_COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.timeInfo}>
            <View style={styles.timeRow}>
              <Calendar size={14} color={THEME_COLORS.text.secondary} />
              <Text style={styles.timeText}>{formatDate()}</Text>
            </View>
            <View style={styles.timeRow}>
              <Clock size={14} color={THEME_COLORS.text.secondary} />
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
              <Wallet size={24} color={THEME_COLORS.primary} />
            </View>
          </View>

          <View style={styles.revenueBottom}>
            <TrendingUp size={14} color={THEME_COLORS.status.success} />
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
            icon={<Bike size={20} color={THEME_COLORS.primary} />}
            bgColor={THEME_COLORS.accent.blueBg}
            onPress={() => navigation.navigate("Bookings", { tab: "active" })}
          />

          <StatCard
            title="Pending Returns"
            value={stats.pendingReturns}
            subtitle="This week"
            icon={<TimerReset size={20} color={THEME_COLORS.accent.orange} />}
            bgColor={THEME_COLORS.accent.orangeBg}
            onPress={() => navigation.navigate("Bookings", { tab: "active" })}
          />

          <StatCard
            title="New Leads"
            value={stats.newLeads}
            subtitle="Follow up"
            icon={<Smartphone size={20} color={THEME_COLORS.accent.purple} />}
            bgColor={THEME_COLORS.accent.purpleBg}
            onPress={() => navigation.navigate("Leads")}
          />
        </View>
      </View>

    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },

  // Header - clean and minimal
  header: {
    backgroundColor: THEME_COLORS.surface,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: THEME_COLORS.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: THEME_COLORS.border.medium,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sm,
    color: THEME_COLORS.text.secondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  name: {
    fontSize: TYPOGRAPHY.xxl,
    color: THEME_COLORS.text.primary,
    fontWeight: "700",
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
    color: THEME_COLORS.text.secondary,
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
    color: THEME_COLORS.text.primary,
    marginBottom: SPACING.lg,
  },

  // Revenue card - clean, not flashy
  revenueCard: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
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
    color: THEME_COLORS.text.secondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  revenueAmount: {
    fontSize: TYPOGRAPHY.xxxl,
    fontWeight: "700",
    color: THEME_COLORS.text.primary,
    letterSpacing: -0.5,
  },
  revenueIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: THEME_COLORS.accent.blueBg,
    alignItems: "center",
    justifyContent: "center",
  },
  revenueBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.border.light,
  },
  revenueChange: {
    fontSize: TYPOGRAPHY.sm,
    color: THEME_COLORS.status.success,
    fontWeight: "600",
  },

  // Stats grid - simple cards
  statsGrid: {
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
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
    color: THEME_COLORS.text.secondary,
    marginBottom: 4,
    fontWeight: "500",
  },
  statNumber: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: "700",
    color: THEME_COLORS.text.primary,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: THEME_COLORS.text.tertiary,
    fontWeight: "500",
  },

  // Action buttons - clean
  actionBtn: {
    backgroundColor: THEME_COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    ...ELEVATION.sm,
  },
  actionBtnPrimary: {
    backgroundColor: THEME_COLORS.primary,
    borderColor: THEME_COLORS.primary,
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
    color: THEME_COLORS.text.primary,
    marginBottom: 2,
  },
  actionTitlePrimary: {
    color: "#fff",
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.xs,
    color: THEME_COLORS.text.tertiary,
    fontWeight: "500",
  },
});

export default DashboardScreen;
