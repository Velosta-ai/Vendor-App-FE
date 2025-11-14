import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const BikeCard = ({ bike, onEdit }) => {
  const isAvailable = bike.availability === 'available';

  return (
    <TouchableOpacity 
      style={[styles.card, SHADOWS.small]}
      onPress={onEdit}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.bikeIcon}>🏍️</Text>
          <View style={styles.info}>
            <Text style={styles.bikeName}>{bike.name}</Text>
            <Text style={styles.regNumber}>{bike.registrationNumber}</Text>
            <Text style={styles.rate}>₹{bike.dailyRate}/day</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={[
            styles.statusTag, 
            { backgroundColor: isAvailable ? COLORS.available : COLORS.booked }
          ]}>
            <Text style={styles.statusDot}>
              {isAvailable ? '🟢' : '🔴'}
            </Text>
            <Text style={styles.statusText}>
              {isAvailable ? 'Available' : 'Booked'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundGray,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bikeIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  info: {
    flex: 1,
  },
  bikeName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  regNumber: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  rate: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusDot: {
    fontSize: 12,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default BikeCard;
