// app/src/context/AuthContext.js
import React, { createContext, useContext, useMemo, useState } from "react";
import { Alert } from "react-native";
import Constants from "expo-constants";

const AuthContext = createContext(null);

// Ambil backendUrl dari app.json
const backendUrl =
  Constants.expoConfig?.extra?.backendUrl ??
  Constants.manifest?.extra?.backendUrl ??
  "http://192.168.0.10:3000"; // ganti dengan IP backend kamu kalau perlu

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const isLoggedIn = !!token;

  async function login({ username, password }) {
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const message =
          response.status === 401
            ? "Username atau password salah"
            : "Gagal login ke server";
        throw new Error(message);
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error("Token tidak ditemukan pada response");
      }

      setToken(data.token);
      setUser(data.user || null);
      setIsGuest(false);
    } catch (err) {
      console.error("Login error", err);
      Alert.alert("Login gagal", err.message);
      throw err;
    }
  }

  function loginAsGuest() {
    setUser(null);
    setToken(null);
    setIsGuest(true);
  }

  function logout() {
    setUser(null);
    setToken(null);
    setIsGuest(false);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isGuest,
      isLoggedIn,
      login,
      loginAsGuest,
      logout,
      backendUrl,
    }),
    [user, token, isGuest, isLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return ctx;
}
