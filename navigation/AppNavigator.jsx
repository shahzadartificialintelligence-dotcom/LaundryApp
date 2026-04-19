import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// User Screens
import HomeScreen from "../screens/HomeScreen";
import OrderScreen from "../screens/OrderScreen";
import CustomerDetailsScreen from "../screens/CustomerDetailsScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";

// Admin Screens
import AdminLoginScreen from "../screens/admin/AdminLoginScreen";
import AdminDashboard from "../screens/admin/AdminDashboard";
import ManageCategoriesScreen from "../screens/admin/ManageCategoriesScreen";
import ManageOrdersScreen from "../screens/admin/ManageOrdersScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: "center",
        }}
      >
        {/* User Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetailsScreen}
          options={{ title: "Customer Details" }}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ title: "Your Orders" }}
        />

        {/* Admin Screens */}
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ title: "Admin Login" }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ title: "Admin Panel" }}
        />
        <Stack.Screen
          name="ManageCategories"
          component={ManageCategoriesScreen}
          options={{ title: "Manage Categories" }}
        />
        <Stack.Screen
          name="ManageOrders"
          component={ManageOrdersScreen}
          options={{ title: "Manage Orders" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
