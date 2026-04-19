import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import database from "@react-native-firebase/database";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const OrderScreen = ({ navigation }) => {
  const [categories, setCategories] = useState({});
  const [selectedKey, setSelectedKey] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [pressed, setPressed] = useState(false);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const ref = database().ref("/categories");
    ref.on("value", snap => {
      if (snap.exists()) setCategories(snap.val());
    });
    return () => ref.off();
  }, []);

  const selectedCategory = selectedKey ? categories[selectedKey] : null;

  const calcPrice = () => {
    if (!selectedCategory) return 0;
    const qty = parseInt(quantity) || 0;
    const press = pressed ? selectedCategory.pressRate : 0;
    return qty * (selectedCategory.washRate + press);
  };

  const addItem = () => {
    if (!selectedCategory) {
      Alert.alert("Selection Required", "Please select a category first.");
      return;
    }
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a valid number of items.");
      return;
    }

    const item = {
      categoryKey: selectedKey,
      categoryName: selectedCategory.name,
      washing: true,
      pressing: pressed,
      quantity: qty,
      washRate: selectedCategory.washRate,
      pressRate: selectedCategory.pressRate,
      total: calcPrice(),
    };

    setOrderItems(prev => [...prev, item]);
    setQuantity("1");
    setPressed(false);
    setSelectedKey(null);
  };

  const totalAmount = orderItems.reduce((s, i) => s + i.total, 0);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} color="#1a2a6c" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Order</Text>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <Icon name="history" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={orderItems}
          keyExtractor={(_, i) => i.toString()}
          ListHeaderComponent={
            <View style={styles.formContainer}>
              {/* STEP 1: CATEGORY */}
              <View style={styles.sectionHeader}>
                <View style={styles.stepBadge}><Text style={styles.stepText}>1</Text></View>
                <Text style={styles.label}>Select Category</Text>
              </View>
              
              <View style={styles.catGrid}>
                {Object.keys(categories).map(k => (
                  <TouchableOpacity
                    key={k}
                    style={[
                      styles.catBtn,
                      selectedKey === k && styles.catActive,
                    ]}
                    onPress={() => setSelectedKey(k)}
                  >
                    <Icon 
                      name="tshirt-v" 
                      size={20} 
                      color={selectedKey === k ? "#fff" : "#1a2a6c"} 
                    />
                    <Text style={[styles.catText, selectedKey === k && styles.catTextActive]}>
                      {categories[k].name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* STEP 2 & 3: DETAILS */}
              {selectedCategory && (
                <View style={styles.detailsCard}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.stepBadge}><Text style={styles.stepText}>2</Text></View>
                    <Text style={styles.label}>Service & Quantity</Text>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceTitle}>Washing</Text>
                      <Text style={styles.serviceSub}>Included by default</Text>
                    </View>
                    <Icon name="check-circle" size={24} color="#27ae60" />
                  </View>

                  <View style={styles.row}>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceTitle}>Ironing / Pressing</Text>
                      <Text style={styles.serviceSub}>+Rs {selectedCategory.pressRate} per item</Text>
                    </View>
                    <Switch 
                      value={pressed} 
                      onValueChange={setPressed}
                      trackColor={{ false: "#d1d1d1", true: "#1a2a6c" }}
                    />
                  </View>

                  <View style={styles.qtyRow}>
                    <Text style={styles.qtyLabel}>Quantity:</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="number-pad"
                      value={quantity}
                      onChangeText={setQuantity}
                    />
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Item Subtotal</Text>
                    <Text style={styles.priceValue}>Rs {calcPrice()}</Text>
                  </View>

                  <TouchableOpacity style={styles.addBtn} onPress={addItem}>
                    <Icon name="cart-plus" size={20} color="#fff" />
                    <Text style={styles.addText}> Add to Basket</Text>
                  </TouchableOpacity>
                </View>
              )}

              {orderItems.length > 0 && (
                <Text style={styles.basketTitle}>Current Basket ({orderItems.length})</Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.categoryName}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity} Unit(s) • {item.pressing ? "Washing + Press" : "Washing only"}
                </Text>
              </View>
              <Text style={styles.itemTotal}>Rs {item.total}</Text>
            </View>
          )}
          ListFooterComponent={
            orderItems.length > 0 ? (
              <View style={styles.footer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={styles.totalAmount}>Rs {totalAmount}</Text>
                </View>
                <TouchableOpacity
                  style={styles.nextBtn}
                  onPress={() =>
                    navigation.navigate("CustomerDetails", {
                      items: orderItems,
                      total: totalAmount,
                    })
                  }
                >
                  <Text style={styles.nextText}>Proceed to Checkout</Text>
                  <Icon name="arrow-right" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "800", color: "#1a2a6c" },
  historyBtn: { backgroundColor: "#1a2a6c", padding: 8, borderRadius: 10 },

  formContainer: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stepBadge: { 
    backgroundColor: '#1a2a6c', 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  stepText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: "700", color: "#2d3436" },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  catActive: { backgroundColor: "#1a2a6c", borderColor: "#1a2a6c" },
  catText: { marginLeft: 8, color: "#1a2a6c", fontWeight: "600" },
  catTextActive: { color: "#fff" },

  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  serviceTitle: { fontSize: 15, fontWeight: '600', color: '#2d3436' },
  serviceSub: { fontSize: 12, color: '#b2bec3' },
  
  qtyRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderColor: '#f1f2f6', paddingTop: 15 },
  qtyLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  input: {
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },

  priceContainer: {
    backgroundColor: '#e8ecf9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priceLabel: { color: '#1a2a6c', fontWeight: '600' },
  priceValue: { color: '#1a2a6c', fontWeight: '800', fontSize: 18 },

  addBtn: {
    backgroundColor: "#27ae60",
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: 'center',
  },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  basketTitle: { fontSize: 18, fontWeight: '700', marginTop: 25, marginBottom: 10, color: '#1a2a6c' },
  itemCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60'
  },
  itemName: { fontSize: 16, fontWeight: '700', color: '#2d3436' },
  itemDetails: { fontSize: 12, color: '#636e72', marginTop: 2 },
  itemTotal: { fontSize: 16, fontWeight: '800', color: '#1a2a6c' },

  footer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 16, color: '#636e72' },
  totalAmount: { fontSize: 22, fontWeight: '900', color: '#1a2a6c' },
  nextBtn: {
    backgroundColor: "#1a2a6c",
    flexDirection: 'row',
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: 'center',
  },
  nextText: { color: "#fff", fontWeight: "bold", fontSize: 18, marginRight: 10 },
});