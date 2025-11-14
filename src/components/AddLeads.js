import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { leadsService } from "../services/dataService";
import { useNavigation } from "@react-navigation/native";

const AddLeadScreen = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Phone number is required");
      return;
    }

    try {
      console.log(
        {
          phone,
          message,
          source: "manual",
        },
        "hola"
      );
      await leadsService.createLead({
        phone,
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
    <View style={{ padding: 20 }}>
      <Text>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text>Message (optional)</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={{ color: "#fff" }}>Save Lead</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default AddLeadScreen;
