import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import SummaryCard from '../components/SummaryCard';
import { dashboardService } from '../services/dataService';
import { mockDashboardStats } from '../services/mockData';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState(mockDashboardStats);
  const [refreshing, setRefreshing] = useState(false);
  const [vendorName, setVendorName] = useState('Vendor');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // For now, use mock data. Replace with actual API call when backend is ready
      // const data = await dashboardService.getStats();
      setStats(mockDashboardStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.vendorName}>{vendorName}</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Business Summary</Text>
        <View style={styles.cardsRow}>
          <SummaryCard
            title="Active Bookings"
            value={stats.activeBookings}
            backgroundColor={COLORS.activeBookings}
            icon="🏍️"
            onPress={() => navigation.navigate('Bookings', { tab: 'active' })}
          />
          <SummaryCard
            title="Pending Returns"
            value={stats.pendingReturns}
            backgroundColor={COLORS.pendingReturns}
            icon="⏰"
            onPress={() => navigation.navigate('Bookings', { tab: 'active' })}
          />
        </View>
        <View style={styles.cardsRow}>
          <SummaryCard
            title="New Leads"
            value={stats.newLeads}
            backgroundColor={COLORS.newLeads}
            icon="📱"
            onPress={() => navigation.navigate('Leads')}
          />
          <SummaryCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            backgroundColor={COLORS.revenue}
            icon="💰"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction, SHADOWS.small]}
          onPress={() => navigation.navigate('AddBooking')}
        >
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionButtonText}>Add Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryAction, SHADOWS.small]}
          onPress={() => navigation.navigate('Leads')}
        >
          <Text style={styles.actionIcon}>👁️</Text>
          <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
            View Leads
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryAction, SHADOWS.small]}
          onPress={() => navigation.navigate('Bikes')}
        >
          <Text style={styles.actionIcon}>🏍️</Text>
          <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
            Manage Bikes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  welcomeText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  vendorName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  summarySection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginLeft: SPACING.md,
  },
  cardsRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  actionsSection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
  },
  secondaryAction: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.background,
  },
  secondaryActionText: {
    color: COLORS.primary,
  },
});

export default DashboardScreen;
