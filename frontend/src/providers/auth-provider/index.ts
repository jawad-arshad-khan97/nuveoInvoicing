import type { AuthProvider } from "@refinedev/core";
import { USER_URLS } from "@/utils/urls";
import axios from "axios";

export const authProvider = (
  user: any,
  logout: any,
  getIdTokenClaims: any
): AuthProvider => ({
  login: async () => {
    return {
      success: true,
    };
  },
  logout: async () => {
    logout({ returnTo: window.location.origin });
    return {
      success: true,
    };
  },
  onError: async (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      const token = await getIdTokenClaims();
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token.__raw}`;
        return {
          authenticated: true,
        };
      } else {
        return {
          authenticated: false,
          redirectTo: "/login",
          logout: true,
        };
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    if (user) {
      handleUserCreationInDb(user);
      return {
        ...user,
        avatar: user.picture,
      };
    }
    return null;
  },
});

const handleUserCreationInDb = async (user: any) => {
  try {
    const response = await fetch(USER_URLS.USERS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        avatar: user.picture,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          avatar: user.picture,
          userid: data._id,
        })
      );
    }
  } catch (error) {
    console.error("Error handling user login:", error);
  }
};
