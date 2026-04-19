import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OrderItem = ({ item, onRemove }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{item.category}</Text>
        <Text style={styles.text}>Qty: {item.quantity}</Text>
        <Text style={styles.text}>
          Pressing: {item.pressed ? "Yes" : "No"}
        </Text>
        <Text style={styles.price}>Rs {item.total}</Text>
      </View>

      {onRemove && (
        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "bold",
  },
  remove: {
    color: "red",
    fontWeight: "bold",
  },
});
