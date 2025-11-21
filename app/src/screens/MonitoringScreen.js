// app/src/screens/MonitoringScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useAuth } from "../context/AuthContext";

export default function MonitoringScreen() {
  const navigation = useNavigation();
  const { backendUrl, isLoggedIn } = useAuth();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        // Sesuaikan endpoint ini dengan backend kamu
        const response = await fetch(`${backendUrl}/api/sensor-readings`);
        const data = await response.json();

        if (isMounted) {
          setReadings(Array.isArray(data) ? data : []);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Gagal memuat data sensor", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [backendUrl]);

  const totalPages = Math.max(1, Math.ceil(readings.length / pageSize));

  const pageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return readings.slice(startIndex, startIndex + pageSize);
  }, [readings, currentPage]);

  function goPrevious() {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }

  function goNext() {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }

  function handleGestureStateChange(event) {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      // Geser ke kiri pindah ke halaman Control
      if (translationX < -50) {
        if (!isLoggedIn) {
          Alert.alert(
            "Perlu login",
            "Silakan login terlebih dahulu untuk membuka halaman Control."
          );
          return;
        }

        navigation.navigate("Control");
      }
    }
  }

  return (
    <PanGestureHandler onHandlerStateChange={handleGestureStateChange}>
      <View style={styles.container}>
        <Text style={styles.title}>Monitoring Suhu</Text>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <FlatList
              data={pageData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.temperature}>{item.temperature} °C</Text>
                  <Text style={styles.meta}>
                    Threshold: {item.threshold_value ?? "-"}
                  </Text>
                  <Text style={styles.meta}>
                    Waktu: {new Date(item.recorded_at).toLocaleString()}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>Belum ada data sensor</Text>
              }
            />

            <View style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={goPrevious}
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.pageButtonDisabled,
                ]}
                disabled={currentPage === 1}
              >
                <Text style={styles.pageButtonText}>Sebelumnya</Text>
              </TouchableOpacity>

              <Text style={styles.pageInfo}>
                Halaman {currentPage} dari {totalPages}
              </Text>

              <TouchableOpacity
                onPress={goNext}
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.pageButtonDisabled,
                ]}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.pageButtonText}>Berikutnya</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.gestureHint}>
              Geser ke kiri untuk pindah ke halaman Control
            </Text>
          </>
        )}
      </View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f172a",
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
    padding: 12,
    marginBottom: 8,
  },
  temperature: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: "#9ca3af",
  },
  empty: {
    marginTop: 24,
    textAlign: "center",
    color: "#9ca3af",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: "#1f2937",
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  pageInfo: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  gestureHint: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
  },
});
