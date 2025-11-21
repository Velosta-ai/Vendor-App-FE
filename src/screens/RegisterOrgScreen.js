import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAlert } from "../contexts/AlertContext";
import { Lock, User } from "lucide-react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants/theme";
import { authService, setAuthToken } from "../services/dataService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterOrgScreen = ({ navigation }) => {
  const { showError, showSuccess } = useAlert();

  const [orgName, setOrgName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const finishSignup = async (res) => {
    if (res && res.token) {
      setAuthToken(res.token);
      await AsyncStorage.setItem("velosta_token", res.token);
      await AsyncStorage.setItem(
        "velosta_account",
        JSON.stringify(res.account || {})
      );
      showSuccess("Welcome", "Organization created successfully");
      navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
    } else {
      const msg = (res && (res.message || res.error)) || "Registration failed";
      showError("Error", msg);
    }
  };

  const handleRegister = async () => {
    if (!orgName.trim() || !name.trim() || !email.trim() || !password.trim()) {
      showError("Missing fields", "Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.registerOrg({
        orgName: orgName.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });

      await finishSignup(res);
    } catch (err) {
      showError("Register Error", err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: SPACING.xl }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Lock size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Create Organization</Text>
            <Text style={styles.subtitle}>Set up your company on Velosta</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Organization Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sai Rentals"
                placeholderTextColor={COLORS.textLight}
                value={orgName}
                onChangeText={setOrgName}
              />
            </View>

            <Text style={[styles.label, { marginTop: SPACING.md }]}>
              Your Name
            </Text>
            <View style={styles.inputWrapper}>
              <User
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor={COLORS.textLight}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={[styles.label, { marginTop: SPACING.md }]}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, { marginTop: SPACING.md }]}>
              Phone (optional)
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor={COLORS.textLight}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={[styles.label, { marginTop: SPACING.md }]}>
              Password
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Create Organization</Text>
              )}
            </TouchableOpacity>

            <View style={{ marginTop: SPACING.lg, alignItems: "center" }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: COLORS.textSecondary }}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: "center", marginBottom: SPACING.lg },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.textPrimary },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  form: { marginTop: SPACING.md },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundGray,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    height: 48,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: {
    color: "#fff",
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
  },
});

export default RegisterOrgScreen;
