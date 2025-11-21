// app/src/screens/CustomSplashScreen.js
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function CustomSplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splash.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>IoT Temperature Monitor</Text>
      <Text style={styles.subtitle}>Modul 6 - PPB</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
  },
});
