import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const AlertModal = ({ visible, type, title, message, onClose, buttons }) => {
  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={48} color="#FFFFFF" strokeWidth={2} />,
          backgroundColor: COLORS.success,
          iconBg: COLORS.success,
          titleColor: COLORS.textPrimary,
          messageColor: COLORS.textSecondary,
        };
      case 'error':
        return {
          icon: <XCircle size={48} color="#FFFFFF" strokeWidth={2} />,
          backgroundColor: COLORS.error,
          iconBg: COLORS.error,
          titleColor: COLORS.textPrimary,
          messageColor: COLORS.textSecondary,
        };
      case 'warning':
        return {
          icon: <AlertCircle size={48} color="#FFFFFF" strokeWidth={2} />,
          backgroundColor: COLORS.warning,
          iconBg: COLORS.warning,
          titleColor: COLORS.textPrimary,
          messageColor: COLORS.textSecondary,
        };
      default:
        return {
          icon: <AlertCircle size={48} color="#FFFFFF" strokeWidth={2} />,
          backgroundColor: COLORS.info,
          iconBg: COLORS.info,
          titleColor: COLORS.textPrimary,
          messageColor: COLORS.textSecondary,
        };
    }
  };

  const config = getConfig();

  // Default buttons if none provided
  const defaultButtons = buttons || [
    {
      text: 'OK',
      onPress: onClose,
      style: 'primary',
    },
  ];

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon Circle */}
          <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
            {config.icon}
          </View>

          {/* Title */}
          {title && (
            <Text style={[styles.title, { color: config.titleColor }]}>{title}</Text>
          )}

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: config.messageColor }]}>
              {message}
            </Text>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {defaultButtons.map((button, index) => {
              const isPrimary = button.style === 'primary' || index === defaultButtons.length - 1;
              const isDestructive = button.style === 'destructive';
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isPrimary && { backgroundColor: config.iconBg },
                    isDestructive && { backgroundColor: COLORS.error },
                    defaultButtons.length > 1 && styles.buttonMultiple,
                  ]}
                  onPress={() => {
                    if (button.onPress) {
                      button.onPress();
                    }
                    // Always close the modal after button press
                    if (onClose) {
                      onClose();
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      (isPrimary || isDestructive) && styles.buttonTextPrimary,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonMultiple: {
    flex: 1,
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
});

export default AlertModal;

