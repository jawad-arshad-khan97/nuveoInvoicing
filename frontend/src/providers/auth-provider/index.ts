import type { AuthProvider } from "@refinedev/core";
import { USER_URLS } from "@/utils/urls";
import axios from "axios";

export const authProvider = (
  user: any,
  logout: any,
  getIdTokenClaims: any
): AuthProvider => ({
  login: async () => {
    if (user) {
      handleUserLogin(user);
    }
    return {
      success: true,
    };
  },
  logout: async () => {
    logout({ logoutParams: { returnTo: "/login" } });
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
      return {
        ...user,
        avatar: user.picture,
      };
    }
    return null;
  },
});

const handleUserLogin = async (user: any) => {
  try {
    const userExistsResponse = await fetch(
      USER_URLS.GET_USER_BY_EMAIL(user.email)
    );
    if (userExistsResponse.ok) {
      const responseData = await userExistsResponse.json();

      if (responseData.message.toLowerCase() === "user does not exist") {
        const response = await fetch(USER_URLS.CREATE_USER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.nickname,
            email: user.name,
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
              email: user.name,
            })
          );
        }
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            avatar: user.picture,
            userid: responseData._id,
            email: user.name,
          })
        );
        console.log("else:" + responseData._id);
      }
    }
  } catch (error) {
    console.error("Error handling user login:", error);
  }
};
