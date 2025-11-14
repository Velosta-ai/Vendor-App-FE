import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const SummaryCard = ({ title, value, backgroundColor, onPress, icon }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor }, SHADOWS.small]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    margin: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  value: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SummaryCard;
