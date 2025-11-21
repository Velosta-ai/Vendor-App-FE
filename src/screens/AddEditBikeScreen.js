// src/screens/AddEditBikeScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAlert } from "../contexts/AlertContext";
import {
  Save,
  X,
  Trash2,
  Bike as BikeIcon,
  CreditCard,
  IndianRupee,
  Info,
} from "lucide-react-native";
import { bikesService } from "../services/dataService";

import {
  COLORS as THEME_COLORS,
  SPACING as THEME_SPACING,
  FONT_SIZES as THEME_FONT_SIZES,
  BORDER_RADIUS as THEME_BORDER_RADIUS,
} from "../constants/theme";

/**
 * Add/Edit Bike Screen — FIXED & SYNCED WITH BACKEND
 *
 * - Sends correct status values: "AVAILABLE" | "MAINTENANCE"
 * - DOES NOT allow manual selection of "RENTED" (backend controls RENTED)
 * - If bike has active booking (backend might show status "RENTED"), UI shows locked state
 * - Auto upper-cases registration number
 * - Validation improved
 * - Clean UX for create & edit
 */

// Theme mapping
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
    focus: THEME_COLORS.primary,
  },
  error: THEME_COLORS.error,
  success: THEME_COLORS.success,
  successBg: "#ecfdf5",
};

const SPACING = THEME_SPACING;
const TYPOGRAPHY = {
  xs: THEME_FONT_SIZES.xs,
  sm: THEME_FONT_SIZES.sm,
  base: THEME_FONT_SIZES.md,
  md: THEME_FONT_SIZES.lg,
  lg: THEME_FONT_SIZES.xl,
};
const RADIUS = THEME_BORDER_RADIUS;

// Input Field (reusable)
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.tertiary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Toggle field
const ToggleField = ({
  label,
  description,
  value,
  onValueChange,
  disabled,
}) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {description ? (
          <Text style={styles.toggleDescription}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={!!disabled}
        trackColor={{ false: COLORS.border.medium, true: COLORS.primary }}
        thumbColor="#fff"
        ios_backgroundColor={COLORS.border.medium}
      />
    </View>
  );
};

const AddEditBikeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showSuccess, showError, showWarning } = useAlert();
  const editBike = route.params?.bike ?? null;
  const isEditMode = !!editBike;

  // form state
  const [bikeName, setBikeName] = useState(editBike?.name || "");
  const [regNumber, setRegNumber] = useState(
    editBike?.registrationNumber || ""
  );
  const [bikeModel, setBikeModel] = useState(editBike?.model || "");
  const [bikeYear, setBikeYear] = useState(
    editBike?.year ? String(editBike.year) : ""
  );
  const [dailyRate, setDailyRate] = useState(
    editBike?.dailyRate ? String(editBike.dailyRate) : ""
  );

  // status handling:
  // - If editBike.status === "RENTED" then we show locked state (cannot change)
  // - Otherwise allow toggle between AVAILABLE / MAINTENANCE
  const initialAvailable =
    !editBike || (editBike.status && editBike.status === "AVAILABLE");

  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isLockedStatus, setIsLockedStatus] = useState(
    !!(editBike && editBike.status === "RENTED")
  );

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // keep derived state in sync if editBike changes
  useEffect(() => {
    if (!editBike) return;
    setBikeName(editBike.name || "");
    setRegNumber(editBike.registrationNumber || "");
    setBikeModel(editBike.model || "");
    setBikeYear(editBike.year ? String(editBike.year) : "");
    setDailyRate(editBike.dailyRate ? String(editBike.dailyRate) : "");
    setIsLockedStatus(editBike.status === "RENTED");
    setIsAvailable(editBike.status === "AVAILABLE");
  }, [editBike]);

  const validate = () => {
    const newErrors = {};
    if (!bikeName.trim()) newErrors.bikeName = "Bike name is required";
    if (!regNumber.trim())
      newErrors.regNumber = "Registration number is required";
    const dr = parseFloat(dailyRate);
    if (isNaN(dr) || dr <= 0) newErrors.dailyRate = "Enter a valid daily rate";
    if (bikeYear && (!/^\d{4}$/.test(bikeYear) || Number(bikeYear) < 1900))
      newErrors.bikeYear = "Enter a valid year";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const normalizePayload = () => {
    const status = isLockedStatus
      ? "RENTED"
      : isAvailable
      ? "AVAILABLE"
      : "MAINTENANCE";

    return {
      name: bikeName.trim(),
      registrationNumber: regNumber.trim().toUpperCase(),
      model: bikeModel.trim() || null,
      year: bikeYear ? Number(bikeYear) : null,
      dailyRate: Number(dailyRate),
      status,
    };
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = normalizePayload();

    try {
      if (isEditMode) {
        await bikesService.updateBike(editBike.id, payload);
        showSuccess("Success", "Bike updated", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await bikesService.createBike(payload);
        showSuccess("Success", "Bike added", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      // handle API error structures
      const msg =
        (err && err.message) ||
        (err && err.error) ||
        "Failed to save bike. Try again.";
      showError("Save Failed", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!isEditMode) return;
    showWarning(
      "Delete Bike",
      "This action will permanently remove the bike.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await bikesService.deleteBike(editBike.id);
              showSuccess("Deleted", "Bike removed", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              showError("Delete Failed", "Unable to delete bike");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <X size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {isEditMode ? "Edit Bike" : "Add New Bike"}
            </Text>
            <Text style={styles.subtitle}>
              {isEditMode ? "Update bike details" : "Add bike to your fleet"}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info banner */}
          <View style={styles.infoBanner}>
            <InfoBadge />
            <Text style={styles.infoBannerText}>
              Fields marked * are required. RENTED status is controlled by the
              system when a booking is active.
            </Text>
          </View>

          {/* Basic info card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <InputField
              label="Bike Name *"
              value={bikeName}
              onChangeText={(text) => {
                setBikeName(text);
                if (errors.bikeName)
                  setErrors((s) => ({ ...s, bikeName: null }));
              }}
              placeholder="e.g. Royal Enfield Classic 350"
              icon={<BikeIcon size={18} color={COLORS.text.tertiary} />}
              error={errors.bikeName}
            />

            <InputField
              label="Model / Variant"
              value={bikeModel}
              onChangeText={setBikeModel}
              placeholder="e.g. Signals Edition"
              icon={<BikeIcon size={18} color={COLORS.text.tertiary} />}
            />

            <InputField
              label="Registration Number *"
              value={regNumber}
              onChangeText={(text) => {
                // auto upper-case and remove spaces except keep format: often registries have spaces; we keep user input but uppercase
                const upper = text.toUpperCase();
                setRegNumber(upper);
                if (errors.regNumber)
                  setErrors((s) => ({ ...s, regNumber: null }));
              }}
              placeholder="e.g. GJ01AB1234"
              icon={<CreditCard size={18} color={COLORS.text.tertiary} />}
              autoCapitalize="characters"
              error={errors.regNumber}
            />

            <InputField
              label="Year"
              value={bikeYear}
              onChangeText={(text) => {
                // allow only digits for year
                const cleaned = text.replace(/\D/g, "");
                setBikeYear(cleaned);
              }}
              placeholder="e.g. 2023"
              icon={<BikeIcon size={18} color={COLORS.text.tertiary} />}
              keyboardType="numeric"
              error={errors.bikeYear}
            />
          </View>

          {/* Pricing card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pricing</Text>

            <InputField
              label="Daily Rate (₹) *"
              value={dailyRate}
              onChangeText={(text) => {
                // allow numbers and decimal
                const cleaned = text.replace(/[^0-9.]/g, "");
                setDailyRate(cleaned);
                if (errors.dailyRate)
                  setErrors((s) => ({ ...s, dailyRate: null }));
              }}
              placeholder="e.g. 800"
              icon={<IndianRupee size={18} color={COLORS.text.tertiary} />}
              keyboardType="numeric"
              error={errors.dailyRate}
            />

            {dailyRate &&
              !isNaN(Number(dailyRate)) &&
              Number(dailyRate) > 0 && (
                <View style={styles.pricePreview}>
                  <Text style={styles.pricePreviewLabel}>
                    Weekly Rate (7 days)
                  </Text>
                  <Text style={styles.pricePreviewValue}>
                    ₹{(Number(dailyRate) * 7).toLocaleString("en-IN")}
                  </Text>
                </View>
              )}
          </View>

          {/* Availability card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Availability</Text>

            {isLockedStatus ? (
              // Locked state: system controls RENTED
              <View style={styles.lockedStatusBox}>
                <Text style={styles.lockedStatusTitle}>RENTED (locked)</Text>
                <Text style={styles.lockedStatusSubtitle}>
                  This bike currently has an active booking and cannot be
                  manually set available/maintenance. It will be set to
                  AVAILABLE automatically after return.
                </Text>
              </View>
            ) : (
              <ToggleField
                label="Available for Booking"
                description={
                  isAvailable
                    ? "This bike is available for customers to book"
                    : "This bike is temporarily unavailable for booking"
                }
                value={isAvailable}
                onValueChange={(v) => setIsAvailable(v)}
                disabled={false}
              />
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.primaryButton, saving && styles.buttonDisabled]}
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={saving}
            >
              <Save size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {isEditMode ? "Update Bike" : "Add Bike"}
              </Text>
            </TouchableOpacity>

            {isEditMode && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <Trash2 size={20} color={COLORS.error} />
                <Text style={styles.deleteButtonText}>Delete Bike</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/** Small inline components */
function InfoBadge() {
  return <Info size={16} color={COLORS.primary} style={{ marginRight: 8 }} />;
}

/** Styles */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  headerContent: {
    flex: 1,
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

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl * 1.5,
  },

  // Info banner
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  infoBannerText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
    flex: 1,
  },

  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },

  // Inputs
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    paddingHorizontal: SPACING.md,
  },
  inputContainerFocused: {
    borderColor: COLORS.border.focus,
    backgroundColor: COLORS.surface,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  inputIcon: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.md,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.text.primary,
  },
  errorText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
    fontWeight: "500",
  },

  // price preview
  pricePreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.successBg,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  pricePreviewLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },
  pricePreviewValue: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: "700",
    color: COLORS.success,
  },

  // toggle
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  toggleInfo: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  toggleLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },

  // locked status
  lockedStatusBox: {
    backgroundColor: "#fff7ed",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "#f59e0b33",
  },
  lockedStatusTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "700",
    color: "#b45309",
    marginBottom: 6,
  },
  lockedStatusSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text.secondary,
  },

  // actions
  actionSection: {
    marginTop: SPACING.lg,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "600",
    color: "#fff",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: "600",
    color: COLORS.error,
  },
});

export default AddEditBikeScreen;
