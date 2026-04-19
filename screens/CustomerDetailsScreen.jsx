import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from "react-native";
import database from "@react-native-firebase/database";
import Geolocation from "react-native-geolocation-service";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { items: orderItems, total: totalAmount } = route.params;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null); // Added for lat/lng storage
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const sanitizeKey = key => key.replace(/\./g, "_");

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to auto-fill your address.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Fetch current location
  const fetchCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Location permission is required to use this feature.");
      return;
    }

    setLocationLoading(true);

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setAddress(`Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`);
        setCoords({ lat: latitude, lng: longitude }); // Store numbers for database
        setLocationLoading(false);
      },
      error => {
        console.log(error);
        Alert.alert("Error", "Unable to fetch location. Please try again.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const submitOrder = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Missing Information", "Please provide your name, contact, and address.");
      return;
    }

    setLoading(true);
    try {
      const orderId = database().ref("/orders").push().key;
      const createdAt = new Date().toISOString();

      const cleanedItems = orderItems.map(it => ({
        categoryKey: it.categoryKey,
        categoryName: it.categoryName,
        washing: !!it.washing,
        pressing: !!it.pressing,
        quantity: Number(it.quantity),
        washRate: Number(it.washRate),
        pressRate: Number(it.pressRate),
        total: Number(it.total),
      }));

      const orderData = {
        orderId,
        customerName: name,
        phone,
        address,
        location: coords, // Saves lat and lng as an object for Admin button
        items: cleanedItems,
        totalAmount: Number(totalAmount),
        status: "Pending",
        createdAt,
      };

      await database().ref(`/orders/${orderId}`).set(orderData);
      const safePhone = sanitizeKey(phone);
      await database().ref(`/userOrders/${safePhone}/${orderId}`).set(orderData);

      Alert.alert("Success!", "Your order has been placed and is being processed.", [
        { text: "Great", onPress: () => navigation.reset({ index: 0, routes: [{ name: "Home" }] }) }
      ]);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemIcon}>
        <Icon name="package-variant" size={20} color="#1a2a6c" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.categoryName}</Text>
        <Text style={styles.itemSub}>
          {item.quantity} Unit(s) • {item.pressing ? "Wash & Press" : "Wash Only"}
        </Text>
      </View>
      <Text style={styles.itemPrice}>Rs {item.total}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#1a2a6c" />
            </TouchableOpacity>
            <Text style={styles.title}>Checkout</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <FlatList
              data={orderItems}
              scrollEnabled={false}
              keyExtractor={(_, i) => i.toString()}
              renderItem={renderItem}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Payable Amount</Text>
              <Text style={styles.totalAmount}>Rs {totalAmount}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            
            <View style={styles.inputWrapper}>
              <Icon name="account-outline" size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#b2bec3"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="phone-outline" size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#b2bec3"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 12 }]}>
              <Icon name="map-marker-outline" size={20} color="#636e72" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.addressInput]}
                placeholder="Complete Address"
                placeholderTextColor="#b2bec3"
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Use Current Location Button */}
            <TouchableOpacity
              style={[styles.locationBtn, locationLoading && { opacity: 0.6 }]}
              onPress={fetchCurrentLocation}
              disabled={locationLoading}
            >
              <Icon name="crosshairs-gps" size={20} color="#fff" />
              <Text style={styles.locationBtnText}>
                {locationLoading ? "Fetching Location..." : "Use Current Location"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.btnDisabled]}
            onPress={submitOrder}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.submitBtnText}>Processing...</Text>
            ) : (
              <>
                <Text style={styles.submitBtnText}>Confirm Order </Text>
                <Icon name="check-decagram" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.footerNote}>Cash on delivery only</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CustomerDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  title: { fontSize: 22, fontWeight: "800", color: "#1a2a6c" },

  section: { backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2d3436", marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },

  itemCard: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f1f2f6" },
  itemIcon: { backgroundColor: "#e8ecf9", padding: 8, borderRadius: 10, marginRight: 12 },
  itemName: { fontSize: 15, fontWeight: "600", color: "#2d3436" },
  itemSub: { fontSize: 12, color: "#636e72" },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#1a2a6c" },

  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 15, paddingTop: 10 },
  totalLabel: { fontSize: 14, color: "#636e72", fontWeight: "600" },
  totalAmount: { fontSize: 20, fontWeight: "800", color: "#1a2a6c" },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, borderWidth: 1, borderColor: '#edf2f7', marginBottom: 15, paddingHorizontal: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#2d3436" },
  addressInput: { height: 80, textAlignVertical: "top" },

  locationBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: "#1a2a6c", padding: 14, borderRadius: 15, marginBottom: 15 },
  locationBtnText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },

  submitBtn: { backgroundColor: "#1a2a6c", flexDirection: 'row', padding: 18, borderRadius: 15, alignItems: "center", justifyContent: "center", shadowColor: "#1a2a6c", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  btnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  footerNote: { textAlign: 'center', marginTop: 15, color: '#b2bec3', fontSize: 12, fontStyle: 'italic' },
});