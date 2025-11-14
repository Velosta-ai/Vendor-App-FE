import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const BookingCard = ({ booking, onMarkReturned, onSendConfirmation, hideActions = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <View style={[styles.card, SHADOWS.small]}>
      <View style={styles.header}>
        <Text style={styles.bikeIcon}>🏍️</Text>
        <View style={styles.headerInfo}>
          <Text style={styles.bikeName}>{booking.bikeName}</Text>
          <Text style={styles.customerName}>{booking.customerName}</Text>
          <Text style={styles.phone}>{booking.phone}</Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Duration:</Text>
        <Text style={styles.dateValue}>
          {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
        </Text>
      </View>

      <View style={styles.paymentContainer}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Paid:</Text>
          <Text style={styles.paymentValue}>₹{booking.paidAmount}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Total:</Text>
          <Text style={[styles.paymentValue, styles.totalAmount]}>₹{booking.totalAmount}</Text>
        </View>
      </View>

      {!hideActions && booking.status === 'active' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.returnButton]} 
            onPress={onMarkReturned}
          >
            <Text style={styles.actionButtonText}>✅ Mark as Returned</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton]} 
            onPress={onSendConfirmation}
          >
            <Text style={styles.actionButtonText}>💬 Send Confirmation</Text>
          </TouchableOpacity>
        </View>
      )}

      {booking.status === 'upcoming' && !hideActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton]} 
            onPress={onSendConfirmation}
          >
            <Text style={styles.actionButtonText}>💬 Send Confirmation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bikeIcon: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  headerInfo: {
    flex: 1,
  },
  bikeName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  customerName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  phone: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  dateContainer: {
    backgroundColor: COLORS.backgroundGray,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  dateLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  dateValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  paymentRow: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  paymentValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  totalAmount: {
    color: COLORS.textPrimary,
  },
  actions: {
    gap: SPACING.sm,
  },
  actionButton: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  returnButton: {
    backgroundColor: COLORS.success,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default BookingCard;
