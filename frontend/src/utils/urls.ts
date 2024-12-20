export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
export const BASE_URL_API_V1 = import.meta.env.VITE_APP_BASE_URL + "/api/v1";

export const AUTH_URLS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  LOGOUT: `${BASE_URL}/auth/logout`,
};

// User-related endpoints
export const USER_URLS = {
  GET_ALL_USERS: `${BASE_URL_API_V1}/users`,
  GET_USER_BY_EMAIL: (email: string) =>
    `${BASE_URL_API_V1}/getUser/${encodeURIComponent(email)}`,
  CREATE_USER: `${BASE_URL_API_V1}/users/create`,
  UPDATE_USER: (userId: string) => `${BASE_URL_API_V1}/users/${userId}/update`,
};
