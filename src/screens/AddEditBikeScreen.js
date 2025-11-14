import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Save,
  X,
  Trash2,
  Bike,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Info,
} from "lucide-react-native";
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
    focus: "#2563eb",
  },

  error: "#dc2626",
  errorBg: "#fef2f2",
  success: "#059669",
  successBg: "#ecfdf5",
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

// Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Toggle Field Component
const ToggleField = ({ label, description, value, onValueChange }) => {
  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
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
  const editBike = route.params?.bike;
  const isEditMode = !!editBike;

  const [bikeName, setBikeName] = useState(editBike?.name || "");
  const [regNumber, setRegNumber] = useState(
    editBike?.registrationNumber || ""
  );
  const [bikeModel, setBikeModel] = useState(editBike?.model || "");
  const [bikeYear, setBikeYear] = useState(editBike?.year?.toString() || "");
  const [dailyRate, setDailyRate] = useState(
    editBike?.dailyRate?.toString() || ""
  );
  const [isAvailable, setIsAvailable] = useState(
    editBike?.status === "available" || !editBike
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!bikeName.trim()) {
      newErrors.bikeName = "Bike name is required";
    }

    if (!regNumber.trim()) {
      newErrors.regNumber = "Registration number is required";
    }

    if (!dailyRate || parseFloat(dailyRate) <= 0) {
      newErrors.dailyRate = "Please enter valid daily rate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const bikeData = {
      name: bikeName.trim(),
      registrationNumber: regNumber.trim().toUpperCase(),
      model: bikeModel.trim(),
      year: bikeYear ? parseInt(bikeYear) : null,
      dailyRate: parseFloat(dailyRate),
      status: isAvailable ? "available" : "maintenance",
    };

    try {
      if (isEditMode) {
        await bikesService.updateBike(editBike.id, bikeData);
        Alert.alert("Success", "Bike updated", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await bikesService.createBike(bikeData);
        Alert.alert("Success", "Bike added", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to save bike");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Bike", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await bikesService.deleteBike(editBike.id);
            Alert.alert("Success", "Bike deleted", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (e) {
            Alert.alert("Error", "Failed to delete bike");
          }
        },
      },
    ]);
  };

  return (
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
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Info size={16} color={COLORS.primary} />
          <Text style={styles.infoBannerText}>
            All fields marked with * are required
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <InputField
            label="Bike Name *"
            value={bikeName}
            onChangeText={(text) => {
              setBikeName(text);
              if (errors.bikeName) setErrors({ ...errors, bikeName: null });
            }}
            placeholder="e.g. Royal Enfield Classic 350"
            icon={<Bike size={18} color={COLORS.text.tertiary} />}
            error={errors.bikeName}
          />

          <InputField
            label="Model / Variant"
            value={bikeModel}
            onChangeText={setBikeModel}
            placeholder="e.g. Signals Edition"
            icon={<Bike size={18} color={COLORS.text.tertiary} />}
          />

          <InputField
            label="Registration Number *"
            value={regNumber}
            onChangeText={(text) => {
              setRegNumber(text);
              if (errors.regNumber) setErrors({ ...errors, regNumber: null });
            }}
            placeholder="e.g. GJ01AB1234"
            icon={<CreditCard size={18} color={COLORS.text.tertiary} />}
            autoCapitalize="characters"
            error={errors.regNumber}
          />

          <InputField
            label="Year"
            value={bikeYear}
            onChangeText={setBikeYear}
            placeholder="e.g. 2023"
            icon={<Bike size={18} color={COLORS.text.tertiary} />}
            keyboardType="numeric"
          />
        </View>

        {/* Pricing Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pricing</Text>

          <InputField
            label="Daily Rate (₹) *"
            value={dailyRate}
            onChangeText={(text) => {
              setDailyRate(text);
              if (errors.dailyRate) setErrors({ ...errors, dailyRate: null });
            }}
            placeholder="e.g. 800"
            icon={<DollarSign size={18} color={COLORS.text.tertiary} />}
            keyboardType="numeric"
            error={errors.dailyRate}
          />

          {dailyRate && parseFloat(dailyRate) > 0 && (
            <View style={styles.pricePreview}>
              <Text style={styles.pricePreviewLabel}>Weekly Rate (7 days)</Text>
              <Text style={styles.pricePreviewValue}>
                ₹{(parseFloat(dailyRate) * 7).toLocaleString("en-IN")}
              </Text>
            </View>
          )}
        </View>

        {/* Availability Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Availability</Text>

          <ToggleField
            label="Available for Booking"
            description={
              isAvailable
                ? "This bike is available for customers to book"
                : "This bike is marked as unavailable"
            }
            value={isAvailable}
            onValueChange={setIsAvailable}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.primaryButton]}
            onPress={handleSave}
            activeOpacity={0.8}
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

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl * 2,
  },

  // Info Banner
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

  // Cards
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

  // Input Fields
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
  },
  inputContainerFocused: {
    borderColor: COLORS.border.focus,
    backgroundColor: COLORS.surface,
  },
  inputContainerError: {
    borderColor: COLORS.error,
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

  // Price Preview
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

  // Toggle Field
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

  // Action Section
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
