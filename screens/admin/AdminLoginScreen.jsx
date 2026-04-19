import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ADMIN_PASSWORD = "admin0123";

const AdminLoginScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setPassword("");
      navigation.replace("AdminDashboard");
    } else {
      Alert.alert("Access Denied", "Incorrect admin password. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.innerContainer}>
          {/* Lock Icon Visual */}
          <View style={styles.iconCircle}>
            <Icon name="lock-shield" size={50} color="#1a2a6c" />
          </View>

          <Text style={styles.title}>Admin Access</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to manage rates and view customer orders.
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="key-variant" size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              placeholder="Admin Password"
              placeholderTextColor="#b2bec3"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Authorize & Login</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerVersion}>V 1.0.2 • Secure Connection</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AdminLoginScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  flex: { 
    flex: 1, 
    justifyContent: "center" 
  },
  innerContainer: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // Soft shadow for a realistic floating look
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2d3436",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#636e72",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 15,
    paddingHorizontal: 15,
    width: "100%",
    marginBottom: 20,
    height: 60,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#1a2a6c",
    flexDirection: "row",
    width: "100%",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#1a2a6c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  backButton: {
    marginTop: 25,
    padding: 10,
  },
  backButtonText: {
    color: "#1a2a6c",
    fontWeight: "600",
    fontSize: 14,
  },
  footerVersion: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    color: "#b2bec3",
    fontSize: 12,
    letterSpacing: 1,
  },
});