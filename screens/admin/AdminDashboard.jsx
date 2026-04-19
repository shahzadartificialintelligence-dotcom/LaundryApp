import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AdminDashboard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>System Control</Text>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      <View style={styles.gridContainer}>
        {/* Manage Categories Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ManageCategories")}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#e8ecf9' }]}>
            <Icon name="format-list-bulleted-type" size={32} color="#1a2a6c" />
          </View>
          <Text style={styles.cardTitle}>Manage Categories</Text>
          <Text style={styles.cardDesc}>Update rates and laundry services</Text>
          <View style={styles.arrowContainer}>
             <Icon name="arrow-right" size={18} color="#1a2a6c" />
          </View>
        </TouchableOpacity>

        {/* Manage Orders Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ManageOrders")}
          activeOpacity={0.7}
        >
          <View style={[styles.iconBox, { backgroundColor: '#fff3e0' }]}>
            <Icon name="clipboard-text-clock-outline" size={32} color="#f39c12" />
          </View>
          <Text style={styles.cardTitle}>Manage Orders</Text>
          <Text style={styles.cardDesc}>View, track, and update status</Text>
          <View style={styles.arrowContainer}>
             <Icon name="arrow-right" size={18} color="#f39c12" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout / Exit */}
      <TouchableOpacity 
        style={styles.exitBtn} 
        onPress={() => navigation.replace("Home")}
      >
        <Icon name="logout" size={20} color="#e74c3c" />
        <Text style={styles.exitText}> Logout Admin</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: "#636e72",
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a2a6c",
    marginTop: 5,
  },
  gridContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden'
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
  },
  cardDesc: {
    fontSize: 13,
    color: "#b2bec3",
    marginTop: 4,
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: 10,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    padding: 10,
  },
  exitText: {
    color: "#e74c3c",
    fontWeight: "700",
    fontSize: 15,
  },
});