import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Context
import { OrderProvider } from "./context/OrderContext";

// User Screens
import HomeScreen from "./screens/HomeScreen";
import OrderScreen from "./screens/OrderScreen";
import CustomerDetailsScreen from "./screens/CustomerDetailsScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";

// Admin Screens
import AdminLoginScreen from "./screens/admin/AdminLoginScreen";
import AdminDashboard from "./screens/admin/AdminDashboard";
import ManageCategoriesScreen from "./screens/admin/ManageCategoriesScreen";
import ManageOrdersScreen from "./screens/admin/ManageOrdersScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <OrderProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#fff", // Clean white header
            },
            headerShadowVisible: false, // Removes the ugly border line
            headerTintColor: "#1a2a6c", // Navy Blue text to match your theme
            headerTitleStyle: {
              fontWeight: "800",
              fontSize: 18,
            },
          }}
        >
          {/* ================= USER SCREENS ================= */}

          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ 
              headerShown: false // Hide header on Home to use your custom design
            }}
          />

          <Stack.Screen
            name="Order"
            component={OrderScreen}
            options={{ title: "Create New Order" }}
          />

          <Stack.Screen
            name="CustomerDetails"
            component={CustomerDetailsScreen}
            options={{ title: "Checkout" }}
          />

          <Stack.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{ title: "My Orders" }}
          />

          {/* ================= ADMIN SCREENS ================= */}

          <Stack.Screen
            name="AdminLogin"
            component={AdminLoginScreen}
            options={{ 
                headerShown: false // Hide header for full-screen login look
            }}
          />

          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{ 
              title: "Admin Panel",
              headerLeft: () => null, // Prevent going back to login
            }}
          />

          <Stack.Screen
            name="ManageCategories"
            component={ManageCategoriesScreen}
            options={{ title: "Service Rates" }}
          />

          <Stack.Screen
            name="ManageOrders"
            component={ManageOrdersScreen}
            options={{ title: "Active Orders" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </OrderProvider>
  );
};

export default App;