import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Phone } from "lucide-react-native";
import { leadsService } from "../services/dataService";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants/theme";

const AddLeadScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const fullPhone = phone.trim();
    if (!fullPhone) {
      Alert.alert("Error", "Phone number is required");
      return;
    }
    if (fullPhone.length < 10) {
      Alert.alert("Error", "Enter valid phone number");
      return;
    }

    try {
      await leadsService.createLead({
        phone: `+91${fullPhone}`,
        message,
        source: "manual",
      });

      Alert.alert("Success", "Lead added", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to add lead");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Lead</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Lead Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Phone size={18} color={COLORS.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={(text) => {
                      // Only allow digits
                      const digitsOnly = text.replace(/\D/g, "");
                      if (digitsOnly.length <= 10) {
                        setPhone(digitsOnly);
                      }
                    }}
                    placeholder="98765 43210"
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message (optional)</Text>
              <TextInput
                style={styles.textArea}
                value={message}
                onChangeText={setMessage}
                placeholder="Enter message..."
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Lead</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  phoneInputContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  phonePrefix: {
    backgroundColor: COLORS.backgroundGray,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  phonePrefixText: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundGray,
    alignItems: "center",
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
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: COLORS.backgroundGray,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
  },
});

export default AddLeadScreen;
