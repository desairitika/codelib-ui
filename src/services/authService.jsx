import http, { publicPost } from "./apiService";

const authUrl = "/api/v1/auth";

export const validate = async () => {
  return http.get("/validate");
};

export const login = async (payload) => {
  // suppress global toast so calling component/action can display its own message
  return publicPost(authUrl + "/login", payload, { suppressGlobalErrorToast: true });
};

export const logout = async () => {
  return http.get(authUrl + "/logout");
};

export const register = async (payload) => {
  return publicPost(authUrl + "/register", payload, { suppressGlobalErrorToast: true });
};

export const forgetPassword = async (payload) => {
  return publicPost(authUrl + "/forgot-password", payload, { suppressGlobalErrorToast: true });
};

export const resetPassword = async (payload) => {
  return publicPost(authUrl + "/reset-password", payload, { suppressGlobalErrorToast: true });
};
