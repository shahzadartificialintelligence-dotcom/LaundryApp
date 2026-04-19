import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import database from "@react-native-firebase/database";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const OrderHistoryScreen = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = () => {
    if (!phone) return;
    setLoading(true);

    const ref = database().ref("/orders").orderByChild("phone").equalTo(phone);

    ref.on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(list);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'cancelled': return '#e74c3c';
      default: return '#1a2a6c';
    }
  };

  const renderItem = ({ item }) => {
    const orderItems = item.orderItems || item.items || [];
    const statusColor = getStatusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderIdText}>Order Summary</Text>
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status?.toUpperCase() || "PENDING"}
            </Text>
          </View>
        </View>

        <View style={styles.customerSection}>
          <Icon name="account-circle-outline" size={16} color="#636e72" />
          <Text style={styles.customerName}> {item.name || item.customerName || "N/A"}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.itemsBox}>
          {orderItems.length > 0 ? (
            orderItems.map((it, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemMain}>
                  <Text style={styles.itemName}>{it.categoryName || it.name}</Text>
                  <Text style={styles.itemSub}>
                    Qty: {it.quantity} | {it.pressing ? "Wash & Press" : "Wash Only"}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>Rs {it.total}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItems}>No items found in this order</Text>
          )}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.totalLabel}>Total Amount Paid</Text>
          <Text style={styles.totalValue}>Rs {item.totalAmount || item.total || 0}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.title}>Track Your Orders</Text>
        <Text style={styles.subtitle}>Enter your phone number to see your laundry history</Text>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#1a2a6c" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. 03001234567"
            placeholderTextColor="#b2bec3"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={fetchOrders} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="magnify" size={20} color="#fff" />
              <Text style={styles.buttonText}> Search History</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.orderId || item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && phone !== "" && (
            <View style={styles.emptyContainer}>
              <Icon name="clipboard-text-search-outline" size={60} color="#d1d1d1" />
              <Text style={styles.emptyText}>No orders found for this number</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  searchSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#1a2a6c" },
  subtitle: { fontSize: 13, color: "#636e72", marginBottom: 20, marginTop: 4 },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#2d3436", fontWeight: '600' },

  button: {
    backgroundColor: "#1a2a6c",
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  listContent: { padding: 20 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  orderIdText: { fontSize: 14, fontWeight: '700', color: '#1a2a6c' },
  dateText: { fontSize: 11, color: '#b2bec3', marginTop: 2 },

  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },

  customerSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  customerName: { fontSize: 13, color: '#636e72' },

  divider: { height: 1, backgroundColor: '#f1f2f6', marginBottom: 12 },

  itemsBox: { marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemMain: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#2d3436' },
  itemSub: { fontSize: 12, color: '#95a5a6' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#2d3436' },
  noItems: { fontSize: 12, color: '#b2bec3', fontStyle: 'italic' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginTop: 5
  },
  totalLabel: { fontSize: 12, color: '#636e72', fontWeight: '600' },
  totalValue: { fontSize: 16, fontWeight: '800', color: '#1a2a6c' },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, color: '#b2bec3', fontSize: 14 }
});