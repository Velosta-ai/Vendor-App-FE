// src/screens/AddBookingScreen.js
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAlert } from "../contexts/AlertContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  X,
  User,
  Phone,
  Bike,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Calculator,
  IndianRupee,
} from "lucide-react-native";
import { bookingsService, bikesService } from "../services/dataService";
import {
  COLORS as THEME_COLORS,
  SPACING as THEME_SPACING,
  FONT_SIZES as THEME_FONT_SIZES,
  BORDER_RADIUS as THEME_BORDER_RADIUS,
} from "../constants/theme";

/* THEME ALIASES (kept similar to your original file) */
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
  success: THEME_COLORS.success,
  successBg: "#ecfdf5",
  warning: THEME_COLORS.warning,
  warningBg: "#fef3c7",
};

const SPACING = THEME_SPACING;
const TYPO = {
  xs: THEME_FONT_SIZES.xs,
  sm: THEME_FONT_SIZES.sm,
  base: THEME_FONT_SIZES.md,
  md: THEME_FONT_SIZES.lg,
  lg: THEME_FONT_SIZES.xl,
};
const RADIUS = THEME_BORDER_RADIUS;

/* Helper: format ISO -> human (en-IN) */
const formatDateHuman = (isoOrDate) => {
  const d = isoOrDate ? new Date(isoOrDate) : null;
  if (!d) return "";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* BikeOption shows available/unavailable badge */
const BikeOption = ({ bike, availability, onSelect, isSelected }) => {
  const unavailable = availability && !availability.isAvailableNow;
  return (
    <TouchableOpacity
      style={[styles.bikeOption, isSelected && styles.bikeOptionSelected]}
      onPress={() => onSelect(bike, availability)}
      activeOpacity={0.85}
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

        <View style={{ maxWidth: "65%" }}>
          <Text style={styles.bikeOptionName}>{bike.name}</Text>
          <Text style={styles.bikeOptionReg}>{bike.registrationNumber}</Text>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.bikeOptionRate}>₹{bike.dailyRate}/day</Text>

        {unavailable ? (
          <View style={styles.unavailableInfo}>
            <Text style={styles.unavailableText}>
              Returns in {availability.returnInDays}{" "}
              {availability.returnInDays === 1 ? "day" : "days"}
            </Text>
            {availability.nextAvailableDate && (
              <Text style={styles.nextAvailableText}>
                Available {formatDateHuman(availability.nextAvailableDate)}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.availablePill}>
            <Text style={styles.availableText}>Available</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const AddBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showSuccess, showError, showWarning } = useAlert();

  const editBooking = route.params?.editBooking || null;
  const prefillData = route.params?.prefillData || {};

  // Form state
  const [customerName, setCustomerName] = useState(
    prefillData.customerName || ""
  );
  const [phone, setPhone] = useState(() =>
    (prefillData.phone || "").replace(/^\+91\s*/, "")
  );
  const [selectedBike, setSelectedBike] = useState({ name: "Select A Bike" }); // bike object
  const [selectedAvailability, setSelectedAvailability] = useState(null); // availability object from API
  const [bikes, setBikes] = useState([]);
  const [availMap, setAvailMap] = useState({}); // { bikeId: availability }

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000));

  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [showBikePicker, setShowBikePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // bottom sheet state
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetBike, setSheetBike] = useState(null);
  const [sheetAvailability, setSheetAvailability] = useState(null);
  const [sheetLoading, setSheetLoading] = useState(false);

  /* Load all bikes + lazy availability fetch for each bike (parallel but not blocking UI) */
  useEffect(() => {
    loadBikesAndAvail();
  }, []);

  const loadBikesAndAvail = async () => {
    try {
      const all = await bikesService.getBikes();
      // show all bikes (Option A)
      setBikes(all || []);

      // fetch availability in parallel (non-blocking)
      const availPromises = (all || []).map(async (b) => {
        try {
          const a = await bikesService.getBikeAvailability(b.id);
          return { id: b.id, availability: a };
        } catch (err) {
          return { id: b.id, availability: null };
        }
      });

      const results = await Promise.all(availPromises);
      const map = {};
      results.forEach((r) => {
        if (r && r.id) map[r.id] = r.availability;
      });
      setAvailMap(map);
    } catch (err) {
      console.error("loadBikes", err);
      showError("Error", "Failed to load bikes");
    }
  };

  /* Edit mode prefill */
  useEffect(() => {
    if (!editBooking) return;

    setCustomerName(editBooking.customerName || "");
    setPhone((editBooking.phone || "").replace(/^\+91\s*/, ""));
    setStartDate(new Date(editBooking.startDate));
    setEndDate(new Date(editBooking.endDate));
    setTotalAmount(String(editBooking.totalAmount || 0));
    setPaidAmount(String(editBooking.paidAmount || 0));
    setNotes(editBooking.notes || "");
    // we'll set selectedBike after bikes load (match by id)
    console.log(editBooking.bike, "edit");
    setSelectedBike({
      id: editBooking.bike.id,
      name: editBooking.bike.name,
      registrationNumber: editBooking.bike.registrationNumber,
      dailyRate: editBooking.bike.dailyRate,
    });
  }, [editBooking]);

  /* auto calculate amount */
  useEffect(() => {
    if (selectedBike && startDate && endDate) {
      const days = Math.max(1, Math.ceil((endDate - startDate) / 86400000));
      setTotalAmount(String(days * (selectedBike.dailyRate || 0)));
    }
  }, [selectedBike, startDate, endDate]);

  /* validation */
  const validate = () => {
    const e = {};
    if (!customerName.trim()) e.customerName = "Customer name is required";
    const fullPhone = phone.trim();
    if (!fullPhone) e.phone = "Phone number is required";
    else if (fullPhone.length < 10) e.phone = "Enter valid phone number";
    if (!selectedBike) e.bike = "Please select a bike";
    if (!totalAmount || Number(totalAmount) <= 0)
      e.totalAmount = "Enter a valid amount";
    if (paidAmount === "" || Number(paidAmount) < 0)
      e.paidAmount = "Enter paid amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* Create or update booking with overlap handling */
  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      customerName: customerName.trim(),
      phone: `+91${phone.trim()}`,
      bikeId: selectedBike.id,
      // send ISO full timestamps (backend expects DateTime)
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount),
      notes: notes.trim(),
    };

    try {
      if (editBooking) {
        const res = await bookingsService.updateBooking(
          editBooking.id,
          payload
        );
        if (res?.error) throw new Error(res.error);
        showSuccess("Success", "Booking updated", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const res = await bookingsService.createBooking(payload);
        console.log(res, "bike not");
        // If backend returns conflict with nextAvailableDate, handle gracefully
        if (res && res.error && res.nextAvailableDate) {
          // Auto offer to adjust to nextAvailableDate
          showWarning(
            "Not available",
            `Bike is not available. Available from ${formatDateHuman(
              res.nextAvailableDate
            )}. Adjust to that date?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Adjust",
                onPress: () => {
                  const next = new Date(res.nextAvailableDate);
                  setStartDate(next);
                  setEndDate(new Date(next.getTime() + 86400000));
                  // refresh availability for selected bike
                  refreshAvailability(selectedBike.id);
                },
              },
            ]
          );
          setLoading(false);
          return;
        }

        if (res?.error)
          throw new Error(res.error || "Failed to create booking");

        showSuccess("Success", "Booking created", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error("handleSave", err);
      showError("Error", err.message || "Failed to save booking");
    } finally {
      setLoading(false);
    }
  };

  /* refresh availability for one bike */
  const refreshAvailability = async (bikeId) => {
    try {
      const a = await bikesService.getBikeAvailability(bikeId);
      setAvailMap((m) => ({ ...m, [bikeId]: a }));
      if (selectedBike?.id === bikeId) setSelectedAvailability(a);
    } catch (err) {
      console.warn("refreshAvailability:", err);
    }
  };

  /* on bike select: if available -> select; if not -> open sheet with options */
  const handleSelectBike = async (bike, availability) => {
    // ensure we have availability object; if not, fetch
    let avail = availability;
    if (!avail) {
      try {
        avail = await bikesService.getBikeAvailability(bike.id);
        setAvailMap((m) => ({ ...m, [bike.id]: avail }));
      } catch (err) {
        console.warn("availability fetch failed", err);
        avail = null;
      }
    }

    // if unavailable -> open sheet with option to Book from nextAvailableDate
    if (avail && !avail.isAvailableNow) {
      setSheetBike(bike);
      setSheetAvailability(avail);
      setSheetVisible(true);
      return;
    }

    // available -> select normally
    console.log(bike, "hola");
    setSelectedBike(bike);
    setSelectedAvailability(avail || null);
    setShowBikePicker(false);

    // If bike is available but startDate is before now, set startDate = today
    const now = new Date();
    if (startDate < now) setStartDate(now);

    // refresh price autocalc will trigger via effect
  };

  /* bottom sheet action: book from next available date */
  const handleBookFromNext = () => {
    if (!sheetAvailability?.nextAvailableDate) {
      showError("Unavailable", "No next available date returned");
      return;
    }
    const next = new Date(sheetAvailability.nextAvailableDate);
    setStartDate(next);
    setEndDate(new Date(next.getTime() + 86400000));
    console.log(sheetBike, "sheet");
    setSelectedBike(sheetBike);
    setSelectedAvailability(sheetAvailability);
    setSheetVisible(false);
    setShowBikePicker(false);

    showSuccess("Dates set", `Start date set to ${formatDateHuman(next)}`);
  };

  /* format / helpers */
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

  /* When user changes startDate manually, we auto-check availability for selected bike and auto-fix if needed */
  useEffect(() => {
    if (!selectedBike) return;
    let mounted = true;
    (async () => {
      try {
        const avail = await bikesService.getBikeAvailability(selectedBike.id);
        if (!mounted) return;
        setSelectedAvailability(avail);
        // if selected bike is unavailable for current startDate (i.e., nextAvailableDate > startDate), auto-fix
        if (avail && !avail.isAvailableNow && avail.nextAvailableDate) {
          const next = new Date(avail.nextAvailableDate);
          if (startDate < next) {
            // auto-fix (AUTO-FIX behavior)
            setStartDate(next);
            setEndDate(new Date(next.getTime() + 86400000));
            showWarning(
              "Date adjusted",
              `Selected bike unavailable for chosen dates. Start date adjusted to ${formatDateHuman(
                next
              )}`
            );
          }
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [startDate, selectedBike]);

  /* UI */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Name *</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <User size={18} color={COLORS.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholderTextColor={COLORS.text.tertiary}
                />
              </View>
              {errors.customerName && (
                <Text style={styles.errorText}>{errors.customerName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <View
                  style={[
                    styles.phoneInputWrapper,
                    errors.phone && styles.inputContainerError,
                  ]}
                >
                  <View style={styles.inputIcon}>
                    <Phone size={18} color={COLORS.text.tertiary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={(text) => {
                      const digitsOnly = text.replace(/\D/g, "");
                      if (digitsOnly.length <= 10) setPhone(digitsOnly);
                      if (errors.phone)
                        setErrors((s) => ({ ...s, phone: null }));
                    }}
                    placeholder="98765 43210"
                    placeholderTextColor={COLORS.text.tertiary}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>
          </View>

          {/* BIKE CARD */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Bike Selection</Text>

            <TouchableOpacity
              style={styles.selectContainer}
              onPress={() => setShowBikePicker((p) => !p)}
              activeOpacity={0.8}
            >
              <View style={styles.inputIcon}>
                <Bike size={18} color={COLORS.text.tertiary} />
              </View>
              <Text
                style={[
                  styles.selectText,
                  !selectedBike && styles.selectPlaceholder,
                ]}
              >
                {selectedBike
                  ? `${selectedBike.name} • ${selectedBike.registrationNumber}`
                  : "Choose a bike"}
              </Text>
              <ChevronDown size={20} color={COLORS.text.tertiary} />
            </TouchableOpacity>
            {errors.bike && <Text style={styles.errorText}>{errors.bike}</Text>}

            {showBikePicker && (
              <View style={styles.bikePickerContainer}>
                {bikes.map((b) => (
                  <BikeOption
                    key={b.id}
                    bike={b}
                    availability={availMap[b.id]}
                    onSelect={handleSelectBike}
                    isSelected={selectedBike?.id === b.id}
                  />
                ))}
                {bikes.length === 0 && (
                  <Text style={styles.emptyBikesText}>No bikes found</Text>
                )}
              </View>
            )}
          </View>

          {/* DATE CARD */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Rental Duration</Text>

            <TouchableOpacity
              style={styles.selectContainer}
              onPress={() => setShowStartPicker(true)}
            >
              <View style={styles.inputIcon}>
                <Calendar size={18} color={COLORS.text.tertiary} />
              </View>
              <Text style={styles.selectText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selectContainer, { marginTop: 12 }]}
              onPress={() => setShowEndPicker(true)}
            >
              <View style={styles.inputIcon}>
                <Calendar size={18} color={COLORS.text.tertiary} />
              </View>
              <Text style={styles.selectText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>

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
                display="default"
                onChange={(e, d) => {
                  setShowStartPicker(false);
                  if (d) {
                    const nStart = d;
                    // if selected bike has nextAvailableDate and nStart < nextAvailableDate => auto-fix
                    if (
                      selectedAvailability &&
                      !selectedAvailability.isAvailableNow &&
                      selectedAvailability.nextAvailableDate
                    ) {
                      const next = new Date(
                        selectedAvailability.nextAvailableDate
                      );
                      if (nStart < next) {
                        // auto-fix to next
                        setStartDate(next);
                        setEndDate(new Date(next.getTime() + 86400000));
                        showWarning(
                          "Date adjusted",
                          `Start date adjusted to ${formatDateHuman(
                            next
                          )} because bike is unavailable earlier.`
                        );
                        return;
                      }
                    }

                    setStartDate(nStart);
                    if (nStart >= endDate)
                      setEndDate(new Date(nStart.getTime() + 86400000));
                  }
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Amount (₹) *</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <IndianRupee size={18} color={COLORS.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={String(totalAmount)}
                  onChangeText={(t) => setTotalAmount(t.replace(/[^\d.]/g, ""))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={COLORS.text.tertiary}
                />
              </View>
              {errors.totalAmount && (
                <Text style={styles.errorText}>{errors.totalAmount}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Paid Amount (₹) *</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <CheckCircle2 size={18} color={COLORS.text.tertiary} />
                </View>
                <TextInput
                  style={styles.input}
                  value={String(paidAmount)}
                  onChangeText={(t) => setPaidAmount(t.replace(/[^\d.]/g, ""))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={COLORS.text.tertiary}
                />
              </View>
              {errors.paidAmount && (
                <Text style={styles.errorText}>{errors.paidAmount}</Text>
              )}
            </View>

            {(totalAmount || paidAmount) && (
              <View style={styles.paymentSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryValue}>
                    ₹{Number(totalAmount || 0).toLocaleString("en-IN")}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Paid</Text>
                  <Text
                    style={[styles.summaryValue, { color: COLORS.success }]}
                  >
                    ₹{Number(paidAmount || 0).toLocaleString("en-IN")}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                  <Text style={styles.summaryLabelTotal}>Balance</Text>
                  <Text
                    style={[
                      styles.summaryValueTotal,
                      {
                        color:
                          getBalance() > 0 ? COLORS.warning : COLORS.success,
                      },
                    ]}
                  >
                    ₹{getBalance().toLocaleString("en-IN")}
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
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <CheckCircle2 size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>
                  {editBooking ? "Update Booking" : "Create Booking"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Sheet Modal for unavailable bike */}
        <Modal
          visible={sheetVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setSheetVisible(false)}
        >
          <View style={styles.sheetOverlay}>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setSheetVisible(false)}
            />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              {sheetLoading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Text style={styles.sheetTitle}>{sheetBike?.name}</Text>
                  <Text style={styles.sheetReg}>
                    {sheetBike?.registrationNumber}
                  </Text>

                  {sheetAvailability?.currentBooking ? (
                    <View style={styles.sheetRow}>
                      <Text style={styles.sheetLabel}>Current renter</Text>
                      <Text style={styles.sheetValue}>
                        {sheetAvailability.currentBooking.customerName}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.sheetRow}>
                    <Text style={styles.sheetLabel}>Returns in</Text>
                    <Text style={styles.sheetValue}>
                      {sheetAvailability?.returnInDays ?? "-"}{" "}
                      {sheetAvailability?.returnInDays === 1 ? "day" : "days"}
                    </Text>
                  </View>

                  <View style={styles.sheetRow}>
                    <Text style={styles.sheetLabel}>Available from</Text>
                    <Text style={styles.sheetValue}>
                      {sheetAvailability?.nextAvailableDate
                        ? formatDateHuman(sheetAvailability.nextAvailableDate)
                        : "-"}
                    </Text>
                  </View>

                  <View style={{ marginTop: 16 }}>
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={handleBookFromNext}
                    >
                      <Text style={styles.primaryButtonText}>
                        Book from next available date
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        { backgroundColor: COLORS.background, marginTop: 10 },
                      ]}
                      onPress={() => setSheetVisible(false)}
                    >
                      <Text
                        style={[
                          styles.primaryButtonText,
                          { color: COLORS.text.primary },
                        ]}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* Styles: keep original styles and add sheet styles */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: "row",
    paddingTop: SPACING.lg,
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
  title: { fontSize: TYPO.lg, fontWeight: "700", color: COLORS.text.primary },
  subtitle: {
    fontSize: TYPO.sm,
    color: COLORS.text.secondary,
    fontWeight: "500",
  },

  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.xl, paddingBottom: 120 },

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
    paddingHorizontal: 8,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  inputContainerError: { borderColor: COLORS.warning },
  inputContainerDisabled: { opacity: 0.6 },
  inputIcon: { width: 44, alignItems: "center", justifyContent: "center" },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingRight: SPACING.md,
    fontSize: TYPO.base,
    color: COLORS.text.primary,
  },

  phoneInputContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
    alignItems: "stretch",
  },
  phonePrefix: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  phonePrefixText: {
    fontSize: TYPO.base,
    fontWeight: "600",
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
    paddingHorizontal: 8,
  },
  selectText: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPO.base,
    color: COLORS.text.primary,
  },
  selectPlaceholder: { color: COLORS.text.tertiary },

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
  bikeOptionSelected: { backgroundColor: COLORS.successBg },
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
  bikeOptionReg: { fontSize: TYPO.xs, color: COLORS.text.tertiary },
  bikeOptionRate: {
    fontSize: TYPO.sm,
    fontWeight: "600",
    color: COLORS.primary,
  },
  unavailableInfo: { marginTop: 6, alignItems: "flex-end" },
  unavailableText: {
    fontSize: TYPO.xs,
    color: COLORS.warning,
    fontWeight: "600",
  },
  nextAvailableText: { fontSize: TYPO.xs, color: COLORS.text.tertiary },

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
  summaryLabel: { fontSize: TYPO.sm, color: COLORS.text.secondary },
  summaryValue: { fontSize: TYPO.base, fontWeight: "600" },
  summaryLabelTotal: { fontSize: TYPO.base, fontWeight: "700" },
  summaryValueTotal: { fontSize: TYPO.md, fontWeight: "700" },

  textAreaContainer: {
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  textArea: { minHeight: 120, color: COLORS.text.primary, fontSize: TYPO.base },

  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xl,
  },
  primaryButtonText: { color: "#fff", fontSize: TYPO.base, fontWeight: "600" },

  // Bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: "50%",
  },
  sheetHandle: {
    width: 56,
    height: 6,
    borderRadius: 6,
    backgroundColor: COLORS.border.light,
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: TYPO.md,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  sheetReg: {
    fontSize: TYPO.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.md,
  },
  sheetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  sheetLabel: { color: COLORS.text.secondary },
  sheetValue: { color: COLORS.text.primary, fontWeight: "600" },
});

export default AddBookingScreen;
