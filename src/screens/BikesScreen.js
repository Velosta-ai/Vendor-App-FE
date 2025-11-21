// src/screens/BikesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAlert } from "../contexts/AlertContext";
import { Plus, Bike as BikeIcon } from "lucide-react-native";
import BikeCard from "../components/BikeCard";
import { bikesService } from "../services/dataService";

import {
  COLORS as THEME_COLORS,
  SPACING as THEME_SPACING,
  FONT_SIZES as THEME_FONT_SIZES,
  BORDER_RADIUS as THEME_BORDER_RADIUS,
} from "../constants/theme";

// Local palette
const COLORS = {
  primary: THEME_COLORS.primary,
  background: THEME_COLORS.background,
  surface: THEME_COLORS.surface,
  text: {
    primary: THEME_COLORS.textPrimary,
    secondary: THEME_COLORS.textSecondary,
    tertiary: "#94a3b8",
  },
  border: {
    light: THEME_COLORS.borderLight,
    medium: THEME_COLORS.border,
  },
  status: {
    available: THEME_COLORS.success,
    maintenance: THEME_COLORS.error,
    rented: THEME_COLORS.warning,
  },
};

const SPACING = THEME_SPACING;
const TYPOGRAPHY = {
  xs: THEME_FONT_SIZES.xs,
  sm: THEME_FONT_SIZES.sm,
  base: THEME_FONT_SIZES.md,
  lg: THEME_FONT_SIZES.xl,
};

const RADIUS = THEME_BORDER_RADIUS;

const StatsSummary = ({ bikes }) => {
  const maintenance = bikes.filter((b) => b.status === "MAINTENANCE").length;

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{bikes.length}</Text>
        <Text style={styles.statLabel}>Total</Text>
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
  const { showError, showSuccess } = useAlert();
  const [bikes, setBikes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      const data = await bikesService.getBikes({ skipGlobalLoader: true });
      // normalize possible null responses
      if (!Array.isArray(data)) {
        throw new Error(data?.error || "Invalid bikes response");
      }
      setBikes(data);
    } catch (error) {
      console.error("Error loading bikes:", error);
      showError("Error", error.message || "Failed to load bikes");
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

  // toggle maintenance and refresh list
  const handleToggleMaintenance = async (bike) => {
    try {
      // optimistic UX: show spinner inside card handled by BikeCard
      const res = await bikesService.toggleMaintenance(bike.id);

      if (res?.error) {
        showError("Error", res.error);
        return;
      }

      // success — reload list
      await loadBikes();
      showSuccess("Updated", `${bike.name} maintenance status updated.`);
    } catch (err) {
      console.error("toggle maintenance", err);
      showError("Error", err.message || "Failed to update maintenance status");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Fleet</Text>
          <Text style={styles.subtitle}>{bikes.length} bikes in inventory</Text>
        </View>
      </View>

      {bikes.length > 0 && <StatsSummary bikes={bikes} />}

      <FlatList
        data={bikes}
        renderItem={({ item }) => (
          <BikeCard
            bike={item}
            onEdit={() => handleEditBike(item)}
            onToggleMaintenance={handleToggleMaintenance}
          />
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
              <BikeIcon size={32} color={COLORS.text.tertiary} />
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

      {bikes.length > 0 && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddEditBike")}
          activeOpacity={0.8}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.lg,
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

  listContent: {
    paddingVertical: SPACING.md,
    paddingBottom: 120,
  },

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
