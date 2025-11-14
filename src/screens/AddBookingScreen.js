import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  X,
  User,
  Phone,
  Bike,
  Calendar,
  DollarSign,
  CheckCircle2,
  ChevronDown,
  Calculator,
  IndianRupee,
} from "lucide-react-native";
import { bookingsService, bikesService } from "../services/dataService";

//
// THEME
//
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

  success: "#059669",
  successBg: "#ecfdf5",
  warning: "#d97706",
  warningBg: "#fef3c7",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

const TYPO = {
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

//
// INPUT FIELD (fixed)
//
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "default",
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

//
// SELECT FIELD
//
const SelectField = ({ label, value, placeholder, onPress, icon }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity
      style={styles.selectContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.inputIcon}>{icon}</View>

      <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
        {value || placeholder}
      </Text>

      <ChevronDown size={20} color={COLORS.text.tertiary} />
    </TouchableOpacity>
  </View>
);

//
// BIKE OPTION
//
const BikeOption = ({ bike, onSelect, isSelected }) => (
  <TouchableOpacity
    style={[styles.bikeOption, isSelected && styles.bikeOptionSelected]}
    onPress={() => onSelect(bike)}
    activeOpacity={0.8}
  >
    <View style={styles.bikeOptionLeft}>
      <View
        style={[
          styles.bikeOptionIcon,
          isSelected && styles.bikeOptionIconSelected,
        ]}
      >
        <Bike
          size={18}
          color={isSelected ? COLORS.primary : COLORS.text.tertiary}
        />
      </View>

      <View>
        <Text style={styles.bikeOptionName}>{bike.name}</Text>
        <Text style={styles.bikeOptionReg}>{bike.registrationNumber}</Text>
      </View>
    </View>

    <Text style={styles.bikeOptionRate}>₹{bike.dailyRate}/day</Text>
  </TouchableOpacity>
);

//
// MAIN SCREEN
//
const AddBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const editBooking = route.params?.editBooking || null;
  const prefillData = route.params?.prefillData || {};

  //
  // STATE
  //
  const [customerName, setCustomerName] = useState(
    prefillData.customerName || ""
  );
  const [phone, setPhone] = useState(prefillData.phone || "");

  const [selectedBike, setSelectedBike] = useState(null);
  const [bikes, setBikes] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000));

  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [showBikePicker, setShowBikePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [errors, setErrors] = useState({});

  //
  // LOAD BIKES
  //
  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      const all = await bikesService.getBikes();

      const available = all.filter(
        (b) =>
          b.status === "AVAILABLE" ||
          (editBooking && editBooking.bikeId === b.id)
      );

      setBikes(available);
    } catch (err) {
      Alert.alert("Error", "Failed to load bikes");
    }
  };

  //
  // EDIT MODE → Prefill
  //
  useEffect(() => {
    if (!editBooking) return;

    setCustomerName(editBooking.customerName);
    setPhone(editBooking.phone);

    setStartDate(new Date(editBooking.startDate));
    setEndDate(new Date(editBooking.endDate));

    setTotalAmount(String(editBooking.totalAmount));
    setPaidAmount(String(editBooking.paidAmount));
    setNotes(editBooking.notes || "");

    setSelectedBike({
      id: editBooking.bikeId,
      name: editBooking.bikeName,
      registrationNumber: editBooking.registrationNumber,
      dailyRate: editBooking.dailyRate,
    });
  }, [editBooking]);

  //
  // AUTO CALCULATE AMOUNT
  //
  useEffect(() => {
    if (selectedBike && startDate && endDate) {
      const days = Math.max(1, Math.ceil((endDate - startDate) / 86400000));
      setTotalAmount(String(days * selectedBike.dailyRate));
    }
  }, [selectedBike, startDate, endDate]);

  //
  // VALIDATE
  //
  const validate = () => {
    const e = {};

    if (!customerName.trim()) e.customerName = "Customer name is required";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (phone.length < 10) e.phone = "Enter valid phone number";

    if (!selectedBike) e.bike = "Please select a bike";

    if (!totalAmount || totalAmount <= 0)
      e.totalAmount = "Enter a valid amount";

    if (paidAmount === "" || paidAmount < 0) e.paidAmount = "Enter paid amount";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  //
  // SAVE BOOKING
  //
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      bikeId: selectedBike.id,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount),
      notes: notes.trim(),
    };

    try {
      if (editBooking) {
        await bookingsService.updateBooking(editBooking.id, payload);
        Alert.alert("Success", "Booking updated", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await bookingsService.createBooking(payload);
        Alert.alert("Success", "Booking created", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to save booking");
    }
  };

  //
  // FORMAT
  //
  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getDays = () =>
    Math.max(1, Math.ceil((endDate - startDate) / 86400000));

  const getBalance = () =>
    (Number(totalAmount) || 0) - (Number(paidAmount) || 0);

  //
  // UI
  //
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <X size={24} color={COLORS.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {editBooking ? "Edit Booking" : "New Booking"}
          </Text>
          <Text style={styles.subtitle}>
            {editBooking
              ? "Update booking information"
              : "Create a new rental booking"}
          </Text>
        </View>
      </View>

      {/* SCROLL */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CUSTOMER CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Details</Text>

          <InputField
            label="Customer Name *"
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Enter name"
            icon={<User size={18} color={COLORS.text.tertiary} />}
            error={errors.customerName}
          />

          <InputField
            label="Phone Number *"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            icon={<Phone size={18} color={COLORS.text.tertiary} />}
            error={errors.phone}
          />
        </View>

        {/* BIKE CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bike Selection</Text>

          <SelectField
            label="Select Bike *"
            value={selectedBike?.name}
            placeholder="Choose a bike"
            onPress={() => setShowBikePicker((p) => !p)}
            icon={<Bike size={18} color={COLORS.text.tertiary} />}
          />

          {errors.bike && <Text style={styles.errorText}>{errors.bike}</Text>}

          {showBikePicker && (
            <View style={styles.bikePickerContainer}>
              {bikes.map((bike) => (
                <BikeOption
                  key={bike.id}
                  bike={bike}
                  onSelect={(b) => {
                    setSelectedBike(b);
                    setShowBikePicker(false);
                  }}
                  isSelected={selectedBike?.id === bike.id}
                />
              ))}

              {bikes.length === 0 && (
                <Text style={styles.emptyBikesText}>No bikes available</Text>
              )}
            </View>
          )}
        </View>

        {/* DATE CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rental Duration</Text>

          <SelectField
            label="Start Date *"
            value={formatDate(startDate)}
            onPress={() => setShowStartPicker(true)}
            placeholder="Pick start date"
            icon={<Calendar size={18} color={COLORS.text.tertiary} />}
          />

          <SelectField
            label="End Date *"
            value={formatDate(endDate)}
            onPress={() => setShowEndPicker(true)}
            placeholder="Pick end date"
            icon={<Calendar size={18} color={COLORS.text.tertiary} />}
          />

          <View style={styles.durationSummary}>
            <Calculator size={16} color={COLORS.primary} />
            <Text style={styles.durationText}>
              Total: {getDays()} {getDays() === 1 ? "day" : "days"}
            </Text>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(e, d) => {
                setShowStartPicker(false);
                if (d) {
                  setStartDate(d);
                  if (d >= endDate)
                    setEndDate(new Date(d.getTime() + 86400000));
                }
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              minimumDate={startDate}
              onChange={(e, d) => {
                setShowEndPicker(false);
                if (d) setEndDate(d);
              }}
            />
          )}
        </View>

        {/* PAYMENT CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <InputField
            label="Total Amount (₹) *"
            value={totalAmount}
            onChangeText={setTotalAmount}
            keyboardType="numeric"
            placeholder="0"
            icon={<IndianRupee size={18} color={COLORS.text.tertiary} />}
            error={errors.totalAmount}
          />

          <InputField
            label="Paid Amount (₹) *"
            value={paidAmount}
            onChangeText={setPaidAmount}
            keyboardType="numeric"
            placeholder="0"
            icon={<CheckCircle2 size={18} color={COLORS.text.tertiary} />}
            error={errors.paidAmount}
          />

          {totalAmount && paidAmount && (
            <View style={styles.paymentSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValue}>₹{totalAmount}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Paid</Text>
                <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                  ₹{paidAmount}
                </Text>
              </View>

              <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                <Text style={styles.summaryLabelTotal}>Balance</Text>
                <Text
                  style={[
                    styles.summaryValueTotal,
                    {
                      color: getBalance() > 0 ? COLORS.warning : COLORS.success,
                    },
                  ]}
                >
                  ₹{getBalance()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* NOTES */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="Add extra notes..."
              placeholderTextColor={COLORS.text.tertiary}
            />
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
          <CheckCircle2 size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>
            {editBooking ? "Update Booking" : "Create Booking"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

//
// STYLES
//
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: "row",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
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
  headerContent: { flex: 1 },
  title: {
    fontSize: TYPO.lg,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: TYPO.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },

  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.xl, paddingBottom: 80 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  sectionTitle: {
    fontSize: TYPO.md,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },

  inputGroup: { marginBottom: SPACING.lg },
  label: {
    fontSize: TYPO.sm,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },

  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  inputContainerError: { borderColor: COLORS.warning },
  inputContainerDisabled: { opacity: 0.6 },
  inputIcon: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.md,
    fontSize: TYPO.base,
    color: COLORS.text.primary,
  },
  errorText: {
    fontSize: TYPO.xs,
    color: COLORS.warning,
    marginTop: 4,
    marginLeft: 4,
  },

  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  selectText: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPO.base,
    color: COLORS.text.primary,
  },
  selectPlaceholder: {
    color: COLORS.text.tertiary,
  },

  bikePickerContainer: {
    marginTop: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    overflow: "hidden",
  },
  bikeOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  bikeOptionSelected: {
    backgroundColor: COLORS.successBg,
  },
  bikeOptionLeft: { flexDirection: "row", gap: SPACING.md },
  bikeOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  bikeOptionName: {
    fontSize: TYPO.base,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  bikeOptionReg: {
    fontSize: TYPO.xs,
    color: COLORS.text.tertiary,
  },
  bikeOptionRate: {
    fontSize: TYPO.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
  emptyBikesText: {
    padding: SPACING.lg,
    fontSize: TYPO.sm,
    textAlign: "center",
    color: COLORS.text.tertiary,
  },

  durationSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.successBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  durationText: {
    marginLeft: SPACING.sm,
    fontSize: TYPO.sm,
    color: COLORS.success,
    fontWeight: "600",
  },

  paymentSummary: {
    padding: SPACING.md,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    borderColor: COLORS.border.light,
    backgroundColor: COLORS.background,
    marginTop: SPACING.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  summaryRowTotal: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  summaryLabel: {
    fontSize: TYPO.sm,
    color: COLORS.text.secondary,
  },
  summaryValue: {
    fontSize: TYPO.base,
    fontWeight: "600",
  },
  summaryLabelTotal: {
    fontSize: TYPO.base,
    fontWeight: "700",
  },
  summaryValueTotal: {
    fontSize: TYPO.md,
    fontWeight: "700",
  },

  textAreaContainer: {
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  textArea: {
    minHeight: 120,
    color: COLORS.text.primary,
    fontSize: TYPO.base,
  },

  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xl,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: TYPO.base,
    fontWeight: "600",
  },
});

export default AddBookingScreen;
