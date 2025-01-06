import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import { API_URL } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    role: null,
    profile: null,
    profilepic: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const profile = Cookies.get("profile");
    const profilepic = Cookies.get("profilepic");

    const fetchAuthStatus = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (token && role) {
          setAuth({ isAuthenticated: true, token, role, profile, profilepic });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, []);

  const login = async (token) => {
    try {
      const profileData = await fetchProfileData(token);

      Cookies.set("token", token, { expires: 7 });
      Cookies.set("role", profileData.user.role, { expires: 7 });

      Cookies.set("profile", JSON.stringify(profileData.user), { expires: 7 });

      Cookies.set("profilepic", profileData.user.photo, { expires: 7 });

      // console.log(profileData);
      setAuth({
        isAuthenticated: true,
        token,
        role: profileData.user.role,
        profile: profileData.user,
        profilepic: profileData.user.photo,
      });
      console.log(auth);
    } catch (error) {
      console.error("Error saat login:", error.message);
      throw error; // Opsional untuk menangani error di `handleSubmit`
    }
  };

  const fetchProfileData = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Axios sudah otomatis mengurai JSON, jadi Anda bisa langsung menggunakan response.data
    } catch (error) {
      console.error("Error fetching profile data:", error);
      throw error; // Menangani error jika ada masalah dengan permintaan
    }
  };
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("profile");
    Cookies.remove("profilepic");
    setAuth({ isAuthenticated: false, token: null, role: null, profile: null, profilepic: null });
  };

  return <AuthContext.Provider value={{ auth, login, logout, loading }}>{children}</AuthContext.Provider>;
};
