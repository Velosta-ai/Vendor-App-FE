import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { bookingsService, bikesService } from '../services/dataService';
import { mockBikes } from '../services/mockData';

const AddBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const prefillData = route.params?.prefillData || {};

  const [customerName, setCustomerName] = useState(prefillData.customerName || '');
  const [phone, setPhone] = useState(prefillData.phone || '');
  const [selectedBike, setSelectedBike] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000)); // +1 day
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [bikes, setBikes] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showBikePicker, setShowBikePicker] = useState(false);

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      // For now, use mock data
      const availableBikes = mockBikes.filter(b => b.availability === 'available');
      setBikes(availableBikes);
    } catch (error) {
      console.error('Error loading bikes:', error);
    }
  };

  const handleSaveBooking = async () => {
    // Validation
    if (!customerName.trim()) {
      Alert.alert('Error', 'Please enter customer name');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }
    if (!selectedBike) {
      Alert.alert('Error', 'Please select a bike');
      return;
    }
    if (!totalAmount) {
      Alert.alert('Error', 'Please enter total amount');
      return;
    }
    if (!paidAmount) {
      Alert.alert('Error', 'Please enter paid amount');
      return;
    }

    const bookingData = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      bikeId: selectedBike.id,
      bikeName: selectedBike.name,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalAmount: parseFloat(totalAmount),
      paidAmount: parseFloat(paidAmount),
      notes: notes.trim(),
    };

    try {
      // await bookingsService.createBooking(bookingData);
      Alert.alert('Success', 'Booking created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        {/* Customer Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Customer Name *</Text>
          <TextInput
            style={styles.input}
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Enter customer name"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            placeholderTextColor={COLORS.textLight}
            keyboardType="phone-pad"
          />
        </View>

        {/* Select Bike */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Bike *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowBikePicker(!showBikePicker)}
          >
            <Text style={selectedBike ? styles.inputText : styles.placeholder}>
              {selectedBike ? selectedBike.name : 'Select a bike'}
            </Text>
          </TouchableOpacity>
          
          {showBikePicker && (
            <View style={styles.pickerContainer}>
              {bikes.map((bike) => (
                <TouchableOpacity
                  key={bike.id}
                  style={styles.pickerItem}
                  onPress={() => {
                    setSelectedBike(bike);
                    setShowBikePicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{bike.name}</Text>
                  <Text style={styles.pickerItemRate}>₹{bike.dailyRate}/day</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Start Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.inputText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* End Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Date *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.inputText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              minimumDate={startDate}
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        {/* Total Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            value={totalAmount}
            onChangeText={setTotalAmount}
            placeholder="0"
            placeholderTextColor={COLORS.textLight}
            keyboardType="numeric"
          />
        </View>

        {/* Paid Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Paid Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            value={paidAmount}
            onChangeText={setPaidAmount}
            placeholder="0"
            placeholderTextColor={COLORS.textLight}
            keyboardType="numeric"
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes"
            placeholderTextColor={COLORS.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.saveButton, SHADOWS.small]}
            onPress={handleSaveBooking}
          >
            <Text style={styles.buttonText}>Save Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  contentContainer: {
    paddingBottom: SPACING.xxl,
  },
  form: {
    backgroundColor: COLORS.background,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.backgroundGray,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  placeholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  textArea: {
    minHeight: 100,
  },
  pickerContainer: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  pickerItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  pickerItemRate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.background,
  },
  cancelButtonText: {
    color: COLORS.textPrimary,
  },
});

export default AddBookingScreen;
