import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { bikesService } from '../services/dataService';

const AddEditBikeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editBike = route.params?.bike;
  const isEditMode = !!editBike;

  const [bikeName, setBikeName] = useState(editBike?.name || '');
  const [regNumber, setRegNumber] = useState(editBike?.registrationNumber || '');
  const [dailyRate, setDailyRate] = useState(editBike?.dailyRate?.toString() || '');
  const [isAvailable, setIsAvailable] = useState(
    editBike?.availability === 'available' || true
  );

  const handleSave = async () => {
    // Validation
    if (!bikeName.trim()) {
      Alert.alert('Error', 'Please enter bike name');
      return;
    }
    if (!regNumber.trim()) {
      Alert.alert('Error', 'Please enter registration number');
      return;
    }
    if (!dailyRate || parseFloat(dailyRate) <= 0) {
      Alert.alert('Error', 'Please enter valid daily rate');
      return;
    }

    const bikeData = {
      name: bikeName.trim(),
      registrationNumber: regNumber.trim().toUpperCase(),
      dailyRate: parseFloat(dailyRate),
      availability: isAvailable ? 'available' : 'booked',
    };

    try {
      if (isEditMode) {
        // await bikesService.updateBike(editBike.id, bikeData);
        Alert.alert('Success', 'Bike updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        // await bikesService.createBike(bikeData);
        Alert.alert('Success', 'Bike added successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'add'} bike`);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Bike',
      'Are you sure you want to delete this bike?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // await bikesService.deleteBike(editBike.id);
              Alert.alert('Success', 'Bike deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete bike');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        {/* Bike Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bike Name *</Text>
          <TextInput
            style={styles.input}
            value={bikeName}
            onChangeText={setBikeName}
            placeholder="e.g. Royal Enfield Classic 350"
            placeholderTextColor={COLORS.textLight}
          />
        </View>

        {/* Registration Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Registration Number *</Text>
          <TextInput
            style={styles.input}
            value={regNumber}
            onChangeText={setRegNumber}
            placeholder="e.g. GJ01AB1234"
            placeholderTextColor={COLORS.textLight}
            autoCapitalize="characters"
          />
        </View>

        {/* Daily Rate */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Rate (₹) *</Text>
          <TextInput
            style={styles.input}
            value={dailyRate}
            onChangeText={setDailyRate}
            placeholder="0"
            placeholderTextColor={COLORS.textLight}
            keyboardType="numeric"
          />
        </View>

        {/* Availability Toggle */}
        <View style={styles.inputGroup}>
          <View style={styles.switchContainer}>
            <View>
              <Text style={styles.label}>Availability</Text>
              <Text style={styles.switchSubtext}>
                {isAvailable ? 'Bike is available for booking' : 'Bike is currently booked'}
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: COLORS.textLight, true: COLORS.primaryLight }}
              thumbColor={isAvailable ? COLORS.primary : COLORS.backgroundGray}
            />
          </View>
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
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>
              {isEditMode ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Delete Button (Edit Mode Only) */}
        {isEditMode && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton, SHADOWS.small]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete Bike</Text>
          </TouchableOpacity>
        )}
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGray,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  switchSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
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
  deleteButton: {
    backgroundColor: COLORS.error,
    marginTop: SPACING.lg,
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

export default AddEditBikeScreen;
