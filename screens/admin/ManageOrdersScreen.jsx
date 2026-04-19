import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import database from "@react-native-firebase/database";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ManageOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(null);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const ref = database().ref("orders");
    const onValueChange = ref.on("value", snapshot => {
      const data = snapshot.val() || {};
      const list = Object.keys(data).map(id => ({
        id,
        ...data[id],
      }));
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setOrders(list);
    });
    return () => ref.off("value", onValueChange);
  }, []);

  const updateStatus = (orderId, status) => {
    database().ref(`orders/${orderId}`).update({ status });
  };

  /* ================= IMPROVED OPEN MAP ================= */
  const openMap = (lat, lng) => {
    // Standard URL format for both iOS and Android maps
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  /* ================= FILTER ================= */
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (!order.createdAt) return true;
      const orderDate = new Date(order.createdAt);
      const today = new Date();

      if (filter === "TODAY") {
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      }
      if (filter === "DATE" && selectedDate) {
        return orderDate.toDateString() === new Date(selectedDate).toDateString();
      }
      return true;
    });
  }, [orders, filter, selectedDate]);

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }) => {
    const status = item.status || "Pending";

    const disabled = {
      accept: status !== "Pending",
      washing: status !== "Accepted",
      ready: status !== "Washing",
      delivered: status !== "Ready",
      cancel: status !== "Pending",
    };

    const categories = item.orderItems || item.items || [];

    const getStatusColor = () => {
      switch (status) {
        case "Accepted": return "#2f80ed";
        case "Washing": return "#9b59b6";
        case "Ready": return "#27ae60";
        case "Delivered": return "#1a2a6c";
        case "Cancelled": return "#e74c3c";
        default: return "#f39c12";
      }
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.customer}>{item.customerName}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + "15" }]}>
            <Text style={[styles.statusBadgeText, { color: getStatusColor() }]}>
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ================= UPDATED LOCATION SECTION ================= */}
        <View style={styles.addressBox}>
          {item.location?.lat && item.location?.lng ? (
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => openMap(item.location.lat, item.location.lng)}
            >
              <Icon name="google-maps" size={20} color="#fff" />
              <Text style={styles.mapButtonText}>Open Live Location</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.locationRow}>
              <Icon name="home-map-marker" size={18} color="#636e72" />
              <Text style={styles.addressText}>{item.address || "No address provided"}</Text>
            </View>
          )}
        </View>

        {categories.length > 0 && (
          <View style={styles.categoryBox}>
            <Text style={styles.categoryTitle}>Order Items</Text>
            {categories.map((cat, index) => {
              const isPressed = cat.pressing === true;   // ✅ added

              return (
                <View key={index} style={styles.categoryRow}>
                  <View style={styles.itemMainInfo}>
                    <Text style={styles.categoryName}>
                      {cat.categoryName || cat.name}
                    </Text>
                    <Text style={styles.categoryQty}>
                      Qty: {cat.quantity || cat.qty || 0}
                    </Text>
                  </View>

                  <View style={styles.pressedInfo}>
                    <Text
                      style={[
                        styles.pressedText,
                        { color: isPressed ? "#27ae60" : "#e74c3c" }
                      ]}
                    >
                      Pressed:
                    </Text>

                    <Icon
                      name={isPressed ? "check-circle" : "close-circle"}
                      size={20}
                      color={isPressed ? "#27ae60" : "#e74c3c"}
                      style={styles.pressedIcon}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total Bill:</Text>
          <Text style={styles.totalValue}>Rs {item.totalAmount}</Text>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            disabled={disabled.accept}
            style={[styles.btn, disabled.accept ? styles.disabled : styles.acceptActive]}
            onPress={() => updateStatus(item.id, "Accepted")}
          >
            <Text style={[styles.btnText, !disabled.accept && styles.whiteText]}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={disabled.washing}
            style={[styles.btn, disabled.washing ? styles.disabled : styles.washActive]}
            onPress={() => updateStatus(item.id, "Washing")}
          >
            <Text style={[styles.btnText, !disabled.washing && styles.whiteText]}>Washing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={disabled.ready}
            style={[styles.btn, disabled.ready ? styles.disabled : styles.readyActive]}
            onPress={() => updateStatus(item.id, "Ready")}
          >
            <Text style={[styles.btnText, !disabled.ready && styles.whiteText]}>Ready</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={disabled.delivered}
            style={[styles.btn, disabled.delivered ? styles.disabled : styles.deliverActive]}
            onPress={() => updateStatus(item.id, "Delivered")}
          >
            <Text style={[styles.btnText, !disabled.delivered && styles.whiteText]}>Deliver</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={disabled.cancel}
            style={[styles.cancelBtn, disabled.cancel && styles.disabled]}
            onPress={() => updateStatus(item.id, "Cancelled")}
          >
            <Icon name="trash-can-outline" size={20} color={disabled.cancel ? "#b2bec3" : "#e74c3c"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.filterSection}>
        <TouchableOpacity style={[styles.filterTab, filter === "ALL" && styles.activeTab]} onPress={() => setFilter("ALL")}>
          <Text style={[styles.filterText, filter === "ALL" && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterTab, filter === "TODAY" && styles.activeTab]} onPress={() => setFilter("TODAY")}>
          <Text style={[styles.filterText, filter === "TODAY" && styles.activeTabText]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterTab, filter === "DATE" && styles.activeTab]} onPress={() => { setSelectedDate(new Date()); setFilter("DATE"); }}>
          <Icon name="calendar-month" size={16} color={filter === "DATE" ? "#fff" : "#1a2a6c"} />
          <Text style={[styles.filterText, filter === "DATE" && styles.activeTabText]}> Date</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ManageOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  filterSection: { flexDirection: "row", padding: 15, backgroundColor: "#fff", justifyContent: "space-between", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 2 },
  filterTab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10, backgroundColor: "#f1f3f6", flexDirection: 'row', alignItems: 'center' },
  activeTab: { backgroundColor: "#1a2a6c" },
  filterText: { fontWeight: "700", color: "#1a2a6c", fontSize: 13 },
  activeTabText: { color: "#fff" },

  card: { backgroundColor: "#fff", padding: 16, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: '#edf2f7', elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  customer: { fontSize: 18, fontWeight: "800", color: '#2d3436' },
  phone: { color: "#636e72", fontSize: 14, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: '#f1f2f6', marginVertical: 12 },

  // UPDATED LOCATION STYLES
  addressBox: { marginBottom: 15 },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: '#1a2a6c',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#1a2a6c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  mapButtonText: { color: '#fff', fontWeight: '800', marginLeft: 10, fontSize: 14 },
  locationRow: { flexDirection: "row", alignItems: "center" },
  addressText: { marginLeft: 8, color: "#2d3436", fontSize: 14, flex: 1 },

  categoryBox: { backgroundColor: "#f8f9fa", padding: 12, borderRadius: 12, marginBottom: 15 },
  categoryTitle: { fontSize: 12, fontWeight: "700", color: "#b2bec3", textTransform: "uppercase", marginBottom: 10 },
  categoryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#edf2f7" },
  itemMainInfo: { flex: 1 },
  categoryName: { fontSize: 15, fontWeight: "700", color: "#2d3436" },
  categoryQty: { fontSize: 12, color: "#636e72" },
  pressedInfo: { flexDirection: 'row', alignItems: 'center' },
  pressedText: { fontSize: 13, fontWeight: '600', marginRight: 5 },
  pressedIcon: { marginLeft: 2 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, backgroundColor: '#f8f9fa', padding: 10, borderRadius: 10 },
  totalLabel: { fontSize: 14, color: '#636e72', fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: "900", color: '#1a2a6c' },

  actions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: 'center' },
  btn: { paddingVertical: 10, borderRadius: 10, width: "48%", alignItems: "center", marginBottom: 10, borderWidth: 1, borderColor: '#d1d1d1' },
  btnText: { fontSize: 13, fontWeight: "700", color: '#636e72' },
  whiteText: { color: '#fff' },
  acceptActive: { backgroundColor: '#2f80ed', borderColor: '#2f80ed' },
  washActive: { backgroundColor: '#9b59b6', borderColor: '#9b59b6' },
  readyActive: { backgroundColor: '#27ae60', borderColor: '#27ae60' },
  deliverActive: { backgroundColor: '#1a2a6c', borderColor: '#1a2a6c' },
  cancelBtn: { width: '100%', padding: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e74c3c', marginTop: 5 },
  disabled: { opacity: 0.2, backgroundColor: '#f1f3f6', borderColor: '#d1d1d1' },
});