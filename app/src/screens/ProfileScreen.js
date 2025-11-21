// app/src/screens/ProfileScreen.js
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, isGuest } = useAuth();

  function handleGestureStateChange(event) {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        navigation.navigate("Control");
      }
    }
  }

  const name = user?.name || (isGuest ? "Tamu" : "Tidak diketahui");
  const username = user?.username || (isGuest ? "-" : "Tidak diketahui");
  const email = user?.email || (isGuest ? "-" : "Tidak diketahui");

  return (
    <PanGestureHandler onHandlerStateChange={handleGestureStateChange}>
      <View style={styles.container}>
        <Text style={styles.title}>Profil</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.value}>{name}</Text>

          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{username}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>

          {isGuest && (
            <Text style={styles.info}>
              Anda sedang menggunakan mode tamu. Silakan login untuk menyimpan
              data profil.
            </Text>
          )}
        </View>

        {!isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.gestureHint}>
          Geser ke kanan untuk kembali ke halaman Control.
        </Text>
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: "#f9fafb",
    fontWeight: "500",
  },
  info: {
    marginTop: 16,
    fontSize: 12,
    color: "#9ca3af",
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  gestureHint: {
    marginTop: 16,
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});
