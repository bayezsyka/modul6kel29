// app/App.js
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import MonitoringScreen from "./src/screens/MonitoringScreen";
import ControlScreen from "./src/screens/ControlScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CustomSplashScreen from "./src/screens/CustomSplashScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Tab = createBottomTabNavigator();

function MainTabs() {
  const { isLoggedIn } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Monitoring") iconName = "stats-chart";
          if (route.name === "Control") iconName = "options";
          if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Monitoring" component={MonitoringScreen} />
      <Tab.Screen
        name="Control"
        component={ControlScreen}
        listeners={{
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              Alert.alert(
                "Perlu login",
                "Silakan login terlebih dahulu untuk membuka halaman Control."
              );
            }
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={{
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              Alert.alert(
                "Perlu login",
                "Silakan login terlebih dahulu untuk membuka halaman Profil."
              );
            }
          },
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { isLoggedIn, isGuest } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // 2 detik
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <CustomSplashScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn || isGuest ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
