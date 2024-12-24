import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios"; // Note: Imported `axios` correctly

const API_URL = "http://localhost:3001";

export const useUserStore = defineStore(
  "user",
  () => {
    // State
    const user = ref(null);
    const accessToken = ref(null);
    const refreshToken = ref(null);
    const emailToVerify = ref(null);

    // Actions
    const setUserData = (userData = {}) => {
      console.log("Setting user data:", userData);
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      if (!user.value) {
        user.value = userData;
      } else {
        user.value = { ...user.value, ...userData };
      }
    };

    const setAccessToken = (token) => {
      accessToken.value = token;
      if (token) {
        localStorage.setItem("accessToken", token);
      }
    };

    const getAccessToken = () => {
      return accessToken.value || localStorage.getItem("accessToken");
    };

    const setRefreshToken = (token) => {
      refreshToken.value = token;
    };

    const setEmailToVerify = (email) => {
      emailToVerify.value = email;
    };

    const removeUserData = () => {
      user.value = null;
      accessToken.value = null;
      refreshToken.value = null;
      emailToVerify.value = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("emailToVerify");
    };

    const login = async (email, password) => {
      try {
        const response = await axios.post(`${API_URL}/users/login`, {
          email,
          password,
        });
        if (response.data?.user) {
          setUserData(response.data.user);
        }

        if (response.data.token) {
          setAccessToken(response.data.token);
          return { success: true, data: response.data };
        }

        return { success: false, data: null };
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          error: error.response?.data?.message || "Login failed",
        };
      }
    };

    const logout = () => {
      removeUserData();
    };

    const initializeStore = () => {
      const storedUser = localStorage.getItem("user");
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedEmailToVerify = localStorage.getItem("emailToVerify");

      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }
      if (storedAccessToken) {
        accessToken.value = storedAccessToken;
      }
      if (storedRefreshToken) {
        refreshToken.value = storedRefreshToken;
      }
      if (storedEmailToVerify) {
        emailToVerify.value = storedEmailToVerify;
      }
    };

    // Getters
    const isAuthenticated = () => !!accessToken.value;
    const userRole = () => user.value?.roleId || null;

    return {
      // State
      user,
      accessToken,
      refreshToken,
      emailToVerify,

      // Actions
      setUserData,
      setAccessToken,
      setRefreshToken,
      setEmailToVerify,
      removeUserData,
      login,
      logout,
      initializeStore,

      // Getters
      isAuthenticated,
      userRole,
      getAccessToken
    };
  },
  {
    persist: true,
  }
);
