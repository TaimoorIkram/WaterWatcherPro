import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


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
        // const decodedToken = jwtDecode(token)
        localStorage.setItem("accessToken", token);
      }
    };

    const getAccessToken = () => {
      return accessToken.value || localStorage.getItem("accessToken");
    }

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
