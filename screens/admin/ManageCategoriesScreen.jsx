import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
  Keyboard,
} from "react-native";
import database from "@react-native-firebase/database";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ManageCategoriesScreen = () => {
  const [categoryName, setCategoryName] = useState("");
  const [washRate, setWashRate] = useState("");
  const [pressRate, setPressRate] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const ref = database().ref("categories");
    const listener = ref.on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setCategories(list);
      } else {
        setCategories([]);
      }
    });
    return () => ref.off("value", listener);
  }, []);

  const resetForm = () => {
    setCategoryName("");
    setWashRate("");
    setPressRate("");
    setEditId(null);
    Keyboard.dismiss();
  };

  const saveCategory = () => {
    if (!categoryName || !washRate || !pressRate) {
      Alert.alert("Required Fields", "Please provide a name and both rates.");
      return;
    }

    const data = {
      name: categoryName.trim(),
      washRate: Number(washRate),
      pressRate: Number(pressRate),
    };

    if (editId) {
      database().ref(`categories/${editId}`).update(data);
    } else {
      database().ref("categories").push(data);
    }
    resetForm();
  };

  const editCategory = item => {
    setCategoryName(item.name);
    setWashRate(String(item.washRate));
    setPressRate(String(item.pressRate));
    setEditId(item.id);
  };

  const deleteCategory = id => {
    Alert.alert("Confirm Delete", "This category will be removed permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => database().ref(`categories/${id}`).remove(),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoSection}>
        <View style={styles.iconCircle}>
          <Icon name="tshirt-v-outline" size={22} color="#1a2a6c" />
        </View>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.rateRow}>
            <Text style={styles.rateTag}>Wash: Rs {item.washRate}</Text>
            <Text style={styles.rateTag}>Press: Rs {item.pressRate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => editCategory(item)}>
          <Icon name="pencil" size={20} color="#2f80ed" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={() => deleteCategory(item.id)}>
          <Icon name="trash-can-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Form Section */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {editId ? "Edit Category Details" : "Create New Category"}
        </Text>
        
        <View style={styles.inputWrapper}>
          <Icon name="tag-outline" size={20} color="#636e72" style={styles.inputIcon} />
          <TextInput
            placeholder="Category Name (e.g. Suit)"
            value={categoryName}
            onChangeText={setCategoryName}
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
            <Icon name="water-outline" size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              placeholder="Wash Rate"
              keyboardType="number-pad"
              value={washRate}
              onChangeText={setWashRate}
              style={styles.input}
            />
          </View>
          <View style={[styles.inputWrapper, { flex: 1 }]}>
            <Icon name="iron-outline" size={20} color="#636e72" style={styles.inputIcon} />
            <TextInput
              placeholder="Press Rate"
              keyboardType="number-pad"
              value={pressRate}
              onChangeText={setPressRate}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.saveBtn, editId ? styles.updateBtn : null]} 
            onPress={saveCategory}
          >
            <Icon name={editId ? "check-circle" : "plus-circle"} size={20} color="#fff" />
            <Text style={styles.saveBtnText}> {editId ? "Update" : "Add Category"}</Text>
          </TouchableOpacity>
          
          {editId && (
            <TouchableOpacity style={styles.cancelBtn} onPress={resetForm}>
              <Icon name="close" size={20} color="#636e72" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List Section */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Existing Categories ({categories.length})</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listScroll}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="toy-brick-plus-outline" size={50} color="#d1d1d1" />
            <Text style={styles.emptyText}>No categories found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ManageCategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  
  // Form Styling
  formCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  formTitle: { fontSize: 18, fontWeight: "800", color: "#1a2a6c", marginBottom: 15 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f3f6",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#2d3436", fontWeight: "600" },
  row: { flexDirection: "row" },
  buttonRow: { flexDirection: "row", alignItems: "center" },
  saveBtn: {
    flex: 1,
    backgroundColor: "#1a2a6c",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  updateBtn: { backgroundColor: "#27ae60" },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: { marginLeft: 10, padding: 12, backgroundColor: "#e0e0e0", borderRadius: 12 },

  // List Styling
  listHeader: { paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  listTitle: { fontSize: 14, fontWeight: "700", color: "#636e72", textTransform: "uppercase" },
  listScroll: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#edf2f7",
  },
  infoSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e8ecf9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemName: { fontSize: 16, fontWeight: "700", color: "#2d3436" },
  rateRow: { flexDirection: "row", marginTop: 4 },
  rateTag: { fontSize: 12, color: "#1a2a6c", backgroundColor: "#f0f2f9", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8, fontWeight: "600" },
  
  actionSection: { flexDirection: "row" },
  iconBtn: { marginLeft: 15, padding: 5 },
  
  emptyBox: { alignItems: "center", marginTop: 50 },
  emptyText: { marginTop: 10, color: "#b2bec3", fontSize: 14 },
});