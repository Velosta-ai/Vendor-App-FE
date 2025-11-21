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
import { User, Eye, EyeOff } from "lucide-react-native";
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../constants/theme";
import { authService, setAuthToken } from "../services/dataService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JoinOrgScreen = ({ navigation }) => {
  const { showError, showSuccess } = useAlert();

  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const finishJoin = async (res) => {
    if (res && res.token) {
      setAuthToken(res.token);
      await AsyncStorage.setItem("velosta_token", res.token);
      await AsyncStorage.setItem(
        "velosta_account",
        JSON.stringify(res.account || {})
      );
      showSuccess("Joined", "Successfully joined organization");
      navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
    } else {
      const msg = (res && (res.message || res.error)) || "Join failed";
      showError("Error", msg);
    }
  };

  const handleJoin = async () => {
    if (
      !inviteCode.trim() ||
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      showError("Missing fields", "Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.joinOrg({
        inviteCode: inviteCode.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });

      await finishJoin(res);
    } catch (err) {
      showError("Join Error", err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: SPACING.xl, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Join Organization</Text>
            <Text style={styles.subtitle}>Enter invite code from your admin</Text>
          </View>

          <View style={{ marginTop: SPACING.md }}>
          <Text style={styles.label}>Invite Code</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="e.g. ORG-5XK72H"
              placeholderTextColor={COLORS.textLight}
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />
          </View>

          <Text style={[styles.label, { marginTop: SPACING.md }]}>
            Your Name
          </Text>
          <View style={styles.inputWrapper}>
            <User
              size={20}
              color={COLORS.textSecondary}
              style={{ marginRight: SPACING.sm }}
            />
            <TextInput
              style={styles.input}
              placeholder="Full name"
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
            Password
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color={COLORS.textSecondary} />
              ) : (
                <Eye size={20} color={COLORS.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleJoin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Join Organization</Text>
            )}
          </TouchableOpacity>

          <View style={{ marginTop: SPACING.lg, alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ color: COLORS.textSecondary }}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: "center", marginBottom: SPACING.lg },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.textPrimary },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
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
  input: {
    flex: 1,
    height: 48,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  eyeIcon: {
    padding: SPACING.sm,
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

export default JoinOrgScreen;
