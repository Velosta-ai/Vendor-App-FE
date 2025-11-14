import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Plus, Search, Filter, Bike, Grid, List } from "lucide-react-native";
import BikeCard from "../components/BikeCard";
import { bikesService } from "../services/dataService";

// Professional Colors
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
  xl: 20,
  xxl: 28,
};

const TYPOGRAPHY = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
};

const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
};

// Stats Summary Component
const StatsSummary = ({ bikes }) => {
  const available = bikes.filter((b) => b.status === "available").length;
  const rented = bikes.filter((b) => b.status === "rented").length;
  const maintenance = bikes.filter((b) => b.status === "maintenance").length;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{bikes.length}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statBox}>
        <Text style={[styles.statValue, { color: COLORS.status.available }]}>
          {available}
        </Text>
        <Text style={styles.statLabel}>Available</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statBox}>
        <Text style={[styles.statValue, { color: COLORS.status.rented }]}>
          {rented}
        </Text>
        <Text style={styles.statLabel}>Rented</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statBox}>
        <Text style={[styles.statValue, { color: COLORS.status.maintenance }]}>
          {maintenance}
        </Text>
        <Text style={styles.statLabel}>Maintenance</Text>
      </View>
    </View>
  );
};

const BikesScreen = () => {
  const navigation = useNavigation();
  const [bikes, setBikes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      const data = await bikesService.getBikes();
      setBikes(data);
    } catch (error) {
      console.error("Error loading bikes:", error);
      Alert.alert("Error", "Failed to load bikes");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBikes();
    setRefreshing(false);
  };

  const handleEditBike = (bike) => {
    navigation.navigate("AddEditBike", { bike });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Fleet</Text>
          <Text style={styles.subtitle}>{bikes.length} bikes in inventory</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Summary */}
      {bikes.length > 0 && <StatsSummary bikes={bikes} />}

      {/* Bikes List */}
      <FlatList
        data={bikes}
        renderItem={({ item }) => (
          <BikeCard bike={item} onEdit={() => handleEditBike(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Bike size={32} color={COLORS.text.tertiary} />
            </View>
            <Text style={styles.emptyTitle}>No bikes in fleet</Text>
            <Text style={styles.emptyText}>
              Add your first bike to start managing your inventory
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("AddEditBike")}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.emptyButtonText}>Add First Bike</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add Button (only show if bikes exist) */}
      {bikes.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddEditBike")}
          activeOpacity={0.8}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === "ios" ? 60 : SPACING.xxl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },

  // Stats Summary
  statsContainer: {
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border.light,
    marginHorizontal: SPACING.sm,
  },

  // List
  listContent: {
    paddingVertical: SPACING.md,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl * 3,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.tertiary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  emptyButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "600",
    color: "#fff",
  },

  // Add Button
  addButton: {
    position: "absolute",
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
});

export default BikesScreen;
