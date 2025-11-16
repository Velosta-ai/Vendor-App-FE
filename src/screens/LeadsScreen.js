import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
} from "../constants/theme";
import LeadCard from "../components/LeadCard";
import { leadsService } from "../services/dataService";
import { mockWhatsAppLeads, mockCallLeads } from "../services/mockData";

const LeadsScreen = () => {
  const navigation = useNavigation();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilter(activeFilter);
  }, [leads, activeFilter]);

  const loadLeads = async () => {
    try {
      const allLeads = await leadsService.getLeads();

      // Sort newest → oldest (your previous logic)
      const sorted = allLeads.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLeads(sorted);
      console.log(sorted, "hola");
    } catch (error) {
      console.error("Error loading leads:", error);
    }
  };

  const applyFilter = (filter) => {
    if (filter === "all") {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter((lead) => lead.status === filter));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLeads();
    setRefreshing(false);
  };

  const handleOpenChat = (lead) => {
    const url =
      lead.source === "whatsapp"
        ? `https://wa.me/${lead.phone.replace(/\D/g, "")}`
        : `tel:${lead.phone}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    });
  };

  const handleConvert = (lead) => {
    navigation.navigate("AddBooking", {
      prefillData: {
        phone: lead.phone,
        customerName: "",
      },
    });
  };

  const handleCloseLead = async (lead) => {
    Alert.alert("Close Lead", "Are you sure you want to close this lead?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Close",
        onPress: async () => {
          try {
            await leadsService.closeLead(lead.id);

            setLeads(
              leads.map((l) =>
                l.id === lead.id ? { ...l, status: "closed" } : l
              )
            );
          } catch (error) {
            Alert.alert("Error", "Failed to close lead");
          }
        },
      },
    ]);
  };

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          activeFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLead = ({ item }) => (
    <LeadCard
      lead={item}
      onOpenChat={() => handleOpenChat(item)}
      onConvert={() => handleConvert(item)}
      onClose={() => handleCloseLead(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "All")}
        {renderFilterButton("new", "New")}
        {renderFilterButton("in_progress", "In Progress")}
        {renderFilterButton("closed", "Closed")}
      </View>

      {/* Leads List */}
      <FlatList
        data={filteredLeads}
        renderItem={renderLead}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No leads found</Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, SHADOWS.medium]}
        onPress={() => navigation.navigate("AddLead")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: COLORS.background,
  },
  listContainer: {
    paddingVertical: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  fab: {
    position: "absolute",
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  fabIcon: {
    fontSize: 28,
    color: COLORS.background,
    fontWeight: "bold",
  },
});

export default LeadsScreen;
