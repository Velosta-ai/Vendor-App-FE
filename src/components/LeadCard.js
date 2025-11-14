import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const LeadCard = ({ lead, onOpenChat, onConvert, onClose }) => {
  const isWhatsApp = lead.source === 'whatsapp';
  const sourceColor = isWhatsApp ? COLORS.whatsapp : COLORS.call;
  const sourceIcon = isWhatsApp ? '💬' : '📞';
  
  const getStatusColor = () => {
    switch (lead.status) {
      case 'new':
        return COLORS.leadNew;
      case 'in_progress':
        return COLORS.leadInProgress;
      case 'closed':
        return COLORS.leadClosed;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusLabel = () => {
    switch (lead.status) {
      case 'new':
        return 'New Lead';
      case 'in_progress':
        return 'In Progress';
      case 'closed':
        return 'Closed';
      default:
        return lead.status;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <View style={[styles.card, { borderLeftColor: sourceColor }, SHADOWS.small]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>{sourceIcon}</Text>
          <View>
            <Text style={styles.phone}>{lead.phone}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(lead.timestamp)}</Text>
          </View>
        </View>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusLabel()}</Text>
        </View>
      </View>

      <Text style={styles.message} numberOfLines={2}>
        {lead.message}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]} 
          onPress={onOpenChat}
        >
          <Text style={styles.actionButtonText}>
            {isWhatsApp ? '💬 Open Chat' : '📞 Call Back'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]} 
          onPress={onConvert}
        >
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            🔄 Convert
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.closeButton]} 
          onPress={onClose}
        >
          <Text style={[styles.actionButtonText, styles.closeButtonText]}>
            ✅ Close
          </Text>
        </TouchableOpacity>
      </View>
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
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  phone: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timestamp: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statusTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.background,
    fontWeight: '600',
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeButton: {
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
  },
  closeButtonText: {
    color: COLORS.textPrimary,
  },
});

export default LeadCard;
