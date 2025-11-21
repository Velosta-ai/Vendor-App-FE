// src/screens/DashboardScreen.js
// Integrated with dashboardService.getDashboard()
// Replace existing file at this path with the following.

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
import { dashboardService } from "../services/dataService";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";

// Theme aliases (keeps parity with your existing design)
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
    orangeBg: COLORS.backgroundSecondary || "#fff7ed",
    purple: "#7c3aed",
    purpleBg: "#f5f3ff",
  },
};

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

/* Small reusable UI components */
const StatCard = ({ title, value, subtitle, icon, bgColor, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.statIconBox, { backgroundColor: bgColor }]}>
        {icon}
      </View>

      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{title}</Text>
        <Text style={styles.statNumber}>{value}</Text>
        {subtitle ? <Text style={styles.statSubtitle}>{subtitle}</Text> : null}
      </View>

      <ArrowRight size={18} color={THEME_COLORS.text.tertiary} />
    </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vendorName, setVendorName] = useState(
    route.params?.vendorName || "Vendor"
  );
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    // tick every minute for time display
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const loadDashboard = useCallback(async (opts = { showLoader: true }) => {
    if (opts.showLoader) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await dashboardService.getDashboard();
      if (res?.error) {
        setError(res.error || "Failed to fetch dashboard");
        setStats(null);
      } else {
        // adapt to response shape defensively
        setStats({
          bikes: res.bikes || {
            total: 0,
            available: 0,
            rented: 0,
            maintenance: 0,
          },
          bookings: res.bookings || {
            active: 0,
            upcoming: 0,
            pendingReturns: 0,
            returnedToday: 0,
          },
          leads: res.leads || { new: 0, open: 0 },
          revenue: res.revenue || { total: 0, thisMonth: 0 },
        });
        // if vendor name present in response, use it
        if (res.vendor?.name) setVendorName(res.vendor.name);
      }
    } catch (err) {
      console.error("loadDashboard error:", err);
      setError(err.message || "Failed to load dashboard");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard({ showLoader: false });
    setRefreshing(false);
  };

  const formatCurrency = (amount = 0) => {
    try {
      return `₹${Number(amount).toLocaleString("en-IN")}`;
    } catch {
      return `₹${amount}`;
    }
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = () =>
    time.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatTime = () =>
    time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleLogout = () => {
    const onLogout = route.params?.onLogout;
    if (onLogout) return onLogout();
    // fallback: navigate to login or goBack
    navigation.getParent()?.goBack();
  };

  // navigate helper
  const goToBookings = (tab = "all") =>
    navigation.navigate("Bookings", { tab });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
        {/* HEADER */}
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

        {/* Loading / Error */}
        <View style={{ paddingHorizontal: SPACING.xl, marginTop: SPACING.lg }}>
          {loading && (
            <View style={{ padding: SPACING.md, alignItems: "center" }}>
              <ActivityIndicator size="small" color={THEME_COLORS.primary} />
              <Text
                style={{ marginTop: 8, color: THEME_COLORS.text.secondary }}
              >
                Loading dashboard…
              </Text>
            </View>
          )}

          {error && !loading && (
            <View style={{ padding: SPACING.md }}>
              <Text style={{ color: THEME_COLORS.status.error }}>
                Error: {error}
              </Text>
            </View>
          )}
        </View>

        {/* MAIN STATS */}
        {!loading && stats && (
          <>
            {/* REVENUE */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.revenueCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Revenue")}
              >
                <View style={styles.revenueTop}>
                  <View>
                    <Text style={styles.revenueLabel}>Total Revenue</Text>
                    <Text style={styles.revenueAmount}>
                      {formatCurrency(stats.revenue.total)}
                    </Text>
                  </View>
                  <View style={styles.revenueIcon}>
                    <Wallet size={24} color={THEME_COLORS.primary} />
                  </View>
                </View>

                <View style={styles.revenueBottom}>
                  <TrendingUp size={14} color={THEME_COLORS.status.success} />
                  <Text style={styles.revenueChange}>
                    {formatCurrency(stats.revenue.thisMonth)} this month
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>

              <View style={styles.statsGrid}>
                <StatCard
                  title="Active Bookings"
                  value={stats.bookings.active}
                  subtitle={`${stats.bookings.upcoming || 0} upcoming`}
                  icon={<Bike size={20} color={THEME_COLORS.primary} />}
                  bgColor={THEME_COLORS.accent.blueBg}
                  onPress={() => goToBookings("active")}
                />

                <StatCard
                  title="Pending Returns"
                  value={stats.bookings.pendingReturns}
                  subtitle={`${
                    stats.bookings.returnedToday || 0
                  } returned today`}
                  icon={
                    <TimerReset size={20} color={THEME_COLORS.accent.orange} />
                  }
                  bgColor={THEME_COLORS.accent.orangeBg}
                  onPress={() => goToBookings("active")}
                />

                {/* <StatCard
                  title="New Leads"
                  value={stats.leads.new}
                  subtitle={`${stats.leads.open || 0} open`}
                  icon={
                    <Smartphone size={20} color={THEME_COLORS.accent.purple} />
                  }
                  bgColor={THEME_COLORS.accent.purpleBg}
                  onPress={() => navigation.navigate("Leads")}
                /> */}
              </View>
            </View>

            {/* Bikes summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fleet</Text>
              <View style={[styles.row, { gap: SPACING.md }]}>
                <TouchableOpacity
                  style={styles.smallCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("Bikes")}
                >
                  <Text style={styles.smallLabel}>Total</Text>
                  <Text style={styles.smallNumber}>{stats.bikes.total}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.smallCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("Bikes", { filter: "available" })
                  }
                >
                  <Text style={styles.smallLabel}>Available</Text>
                  <Text style={styles.smallNumber}>
                    {stats.bikes.available}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.smallCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("Bikes", { filter: "rented" })
                  }
                >
                  <Text style={styles.smallLabel}>Rented</Text>
                  <Text style={styles.smallNumber}>{stats.bikes.rented}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* fallback empty */}
        {!loading && !stats && !error && (
          <View
            style={{
              paddingHorizontal: SPACING.xl,
              paddingVertical: SPACING.md,
            }}
          >
            <Text style={{ color: THEME_COLORS.text.secondary }}>
              No dashboard data yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/* Helper: improved WhatsApp message composer
   Use in booking screen where booking object is available.
   Example usage:
     handleWhatsApp(booking, vendorName, showError, Linking)
*/
export const composeWhatsAppUrl = ({ booking, vendorName = "Vendor" }) => {
  // booking: { id, customerName, bike: { name }, startDate, endDate, totalAmount, phone }
  if (!booking) return null;
  const phone = (booking.phone || "").replace(/\D/g, "");
  const id = booking.id || booking._id || "N/A";
  const bikeName = booking.bike?.name || booking.bikeName || "your bike";
  const start = booking.startDate
    ? new Date(booking.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const end = booking.endDate
    ? new Date(booking.endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const timeText = booking.startDate
    ? new Date(booking.startDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const price = booking.totalAmount
    ? `₹${Number(booking.totalAmount).toLocaleString("en-IN")}`
    : "N/A";

  const msg = `Hi ${booking.customerName || ""},

This is ${vendorName}. Your booking (ID: ${id}) for *${bikeName}* is confirmed.

Dates: ${start} → ${end} ${timeText ? `at ${timeText}` : ""}
Amount: ${price}

If you need to change or cancel, reply to this message or call us.

Thanks & regards,
${vendorName}`;

  if (!phone) return null;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  return url;
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

  // Header
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
    backgroundColor: THEME_COLORS.background,
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

  // Revenue card
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

  // Stats grid & cards
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
    marginBottom: SPACING.md,
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

  // Fleet small cards
  row: { flexDirection: "row" },
  smallCard: {
    flex: 1,
    backgroundColor: THEME_COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    alignItems: "center",
    justifyContent: "center",
    ...ELEVATION.sm,
  },
  smallLabel: { fontSize: TYPOGRAPHY.xs, color: THEME_COLORS.text.secondary },
  smallNumber: {
    fontSize: TYPOGRAPHY.md,
    color: THEME_COLORS.text.primary,
    fontWeight: "700",
  },
});

export default DashboardScreen;
