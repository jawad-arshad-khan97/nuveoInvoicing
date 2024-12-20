export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export const BASE_URL_API_V1 = import.meta.env.VITE_APP_BASE_URL + "/api/v1";

export const AUTH_URLS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  LOGOUT: `${BASE_URL}/auth/logout`,
};

// User-related endpoints
export const USER_URLS = {
  USERS: `${BASE_URL_API_V1}/users`,
  GET_USER_BY_EMAIL: (email: string) =>
    `${USER_URLS.USERS}/getUser?email=${encodeURIComponent(email)}`,
};
