import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CategoryCard = ({ name, washRate, pressRate, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{name}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Washing:</Text>
        <Text style={styles.value}>Rs {washRate}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Pressing:</Text>
        <Text style={styles.value}>Rs {pressRate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
