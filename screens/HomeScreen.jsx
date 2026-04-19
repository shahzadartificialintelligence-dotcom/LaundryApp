import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from "react-native";
import database from "@react-native-firebase/database";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HomeScreen = ({ navigation }) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = database().ref("/categories");
    ref.on("value", snapshot => {
      if (snapshot.exists()) {
        setRates(snapshot.val());
      }
      setLoading(false);
    });
    return () => ref.off();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1a2a6c" />
        <Text style={styles.loaderText}>Loading Fresh Rates...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Welcome to</Text>
          <Text style={styles.headerTitle}>Premium Laundry</Text>
        </View>
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => navigation.navigate("Order")}
        >
          <Icon name="plus-circle" size={18} color="#1a2a6c" />
          <Text style={styles.orderBtnText}> New Order</Text>
        </TouchableOpacity>
      </View>

      {/* Rates List */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Our Services & Rates</Text>

        {Object.keys(rates).map(key => (
          <View key={key} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Icon name="tshirt-crew" size={24} color="#1a2a6c" />
              </View>
              <Text style={styles.category}>{rates[key].name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rateRow}>
              <View style={styles.rateItem}>
                <Text style={styles.rateLabel}>Washing</Text>
                <Text style={styles.rateValue}>Rs {rates[key].washRate}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.rateItem}>
                <Text style={styles.rateLabel}>Pressing</Text>
                <Text style={styles.rateValue}>Rs {rates[key].pressRate}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Professional Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.contactBtn, styles.callBtn]}
          onPress={() => Linking.openURL("tel:+923043955545")}
        >
          <Icon name="phone" size={20} color="#fff" />
          <Text style={styles.contactText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactBtn, styles.whatsappBtn]}
          onPress={() => Linking.openURL("https://wa.me/923043955545")}
        >
          <Icon name="whatsapp" size={20} color="#fff" />
          <Text style={styles.contactText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => navigation.navigate("AdminLogin")}
        >
          <Icon name="shield-account" size={20} color="#fff" />
          <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 25,
    backgroundColor: "#1a2a6c", // Deep Classic Navy
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
  },
  headerSubtitle: { color: "#cbd5e0", fontSize: 14, fontWeight: "500" },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  orderBtn: {
    backgroundColor: "#fff",
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  orderBtnText: { color: "#1a2a6c", fontWeight: "bold", fontSize: 14 },

  // List Styling
  scrollContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#2d3436", marginBottom: 15 },

  card: {
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 15,
    padding: 18,
    // Realistic Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#1a2a6c',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconContainer: {
    backgroundColor: '#e8ecf9',
    padding: 8,
    borderRadius: 10,
    marginRight: 12
  },
  category: { fontSize: 18, fontWeight: "700", color: "#2d3436" },

  divider: { height: 1, backgroundColor: '#f1f2f6', marginBottom: 12 },

  rateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rateItem: { flex: 1, alignItems: 'center' },
  verticalDivider: { width: 1, height: 30, backgroundColor: '#f1f2f6' },
  rateLabel: { fontSize: 12, color: "#636e72", textTransform: 'uppercase', letterSpacing: 1 },
  rateValue: { fontSize: 16, fontWeight: "700", color: "#1a2a6c", marginTop: 4 },

  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 0.35,
    justifyContent: 'center'
  },
  callBtn: { backgroundColor: "#1a2a6c" },
  whatsappBtn: { backgroundColor: "#25D366" },
  contactText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },

  adminBtn: {
    backgroundColor: "#2d3436",
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.2,
  },
  adminText: { color: "#fff", fontSize: 10, fontWeight: "bold", marginTop: 2 },

  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#fff' },
  loaderText: { marginTop: 10, color: '#1a2a6c', fontWeight: '600' }
});