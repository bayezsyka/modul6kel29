// app/src/screens/ControlScreen.js
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function ControlScreen() {
  const navigation = useNavigation();
  const { backendUrl, token, isLoggedIn } = useAuth();
  const [threshold, setThreshold] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentThreshold, setCurrentThreshold] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) {
        Alert.alert(
          "Perlu login",
          "Silakan login terlebih dahulu untuk membuka halaman Control."
        );
        navigation.navigate("Monitoring");
      }
    }, [isLoggedIn, navigation])
  );

  useEffect(() => {
    async function loadCurrentThreshold() {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/threshold`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          Alert.alert(
            "Tidak terautentikasi",
            "Sesi login tidak valid. Silakan login ulang."
          );
          return;
        }

        const data = await response.json();
        if (data && data.value != null) {
          setCurrentThreshold(String(data.value));
        }
      } catch (error) {
        console.error("Gagal memuat threshold", error);
        Alert.alert("Error", "Gagal memuat data threshold.");
      } finally {
        setLoading(false);
      }
    }

    if (isLoggedIn && token) {
      loadCurrentThreshold();
    } else {
      setCurrentThreshold(null);
    }
  }, [backendUrl, isLoggedIn, token]);

  async function submitThreshold() {
    if (!isLoggedIn || !token) {
      Alert.alert(
        "Perlu login",
        "Silakan login terlebih dahulu untuk mengubah threshold."
      );
      navigation.navigate("Monitoring");
      return;
    }

    if (!threshold) {
      Alert.alert("Validasi", "Nilai threshold tidak boleh kosong.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/threshold`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // token dari AuthContext
        },
        body: JSON.stringify({ value: parseFloat(threshold) }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan threshold");
      }

      const data = await response.json();
      setCurrentThreshold(String(data.value));
      setThreshold("");
      Alert.alert("Berhasil", "Threshold berhasil diperbarui.");
    } catch (error) {
      console.error("Error update threshold", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGestureStateChange(event) {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        navigation.navigate("Monitoring");
      } else if (translationX < -50) {
        navigation.navigate("Profile");
      }
    }
  }

  return (
    <PanGestureHandler onHandlerStateChange={handleGestureStateChange}>
      <View style={styles.container}>
        <Text style={styles.title}>Control Threshold</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Threshold saat ini</Text>
          <Text style={styles.current}>
            {currentThreshold != null ? `${currentThreshold} °C` : "-"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Ubah threshold</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Masukkan nilai threshold baru"
            value={threshold}
            onChangeText={setThreshold}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={submitThreshold}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Simpan</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.helper}>
            Aksi ini memanggil API yang dilindungi token pada header
            Authorization.
          </Text>
        </View>

        <Text style={styles.gestureHint}>
          Geser ke kanan untuk Monitoring, geser ke kiri untuk Profil.
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
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#9ca3af",
  },
  current: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: "#f9fafb",
  },
  input: {
    marginTop: 8,
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#f9fafb",
    borderWidth: 1,
    borderColor: "#374151",
  },
  button: {
    marginTop: 12,
    backgroundColor: "#10b981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    color: "#9ca3af",
  },
  gestureHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});
