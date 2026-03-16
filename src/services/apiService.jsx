import axios from "axios";
import { Navigate } from "react-router-dom";
import { getToken, removeItem } from "../utils/TokenUtil";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Utility to create a cancel token source
export const createCancelTokenSource = () => {
  return axios.CancelToken.source();
};

// Error handler callback (set by app during initialization)
let errorHandler = null;

export const setApiErrorHandler = (handler) => {
  errorHandler = handler;
};

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // 10s timeout avoids hanging if backend is unresponsive
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Allow explicitly public requests by setting `config.skipAuth = true`
    if (!token && !(config && (config.skipAuth || config.headers?.skipAuth))) {
      // redirect to login and cancel the request to avoid hitting the API
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject({ message: "No token available - redirecting to login", __noToken: true });
    }

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Extract error message from various sources
    let errorMessage = "An error occurred";
    
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else if (error.response?.status === 401) {
      // don't redirect on 401 for explicitly public/skipAuth requests
      if (error.config && (error.config.skipAuth || error.config.headers?.skipAuth)) {
        errorMessage = error.response?.data?.error || "Unauthorized";
      } else {
        errorMessage = "Unauthorized - redirecting to login";
        removeItem("token", true);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } else if (error.response?.status === 403) {
      errorMessage = error.response?.data?.error || "Access denied";
    } else if (error.response?.status === 404) {
      errorMessage = error.response?.data?.error || "Resource not found";
    } else if (error.response?.status === 400) {
      errorMessage = error.response?.data?.error || error.response?.data?.message || "Invalid request";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server error - please try again later";
    } else if (error.message === "No token available - redirecting to login") {
      // Skip error notification for auth redirect
      return Promise.reject(error);
    } else if (error.request && !error.response) {
      errorMessage = "Network error - please check your connection";
    } else {
      errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Unknown error";
    }

    // Call registered error handler (typically dispatches toast)
    // allow callers to suppress global toasts by passing `suppressGlobalErrorToast: true`
    if (
      errorHandler &&
      !axios.isCancel(error) &&
      !(error.config && error.config.suppressGlobalErrorToast)
    ) {
      errorHandler(errorMessage);
    }

    console.error("API Error:", errorMessage, error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Helper methods for public endpoints (skip auth check)
export const publicGet = (url, config = {}) => axiosInstance.get(url, { skipAuth: true, ...config });
export const publicPost = (url, data, config = {}) => axiosInstance.post(url, data, { skipAuth: true, ...config });
export const publicPut = (url, data, config = {}) => axiosInstance.put(url, data, { skipAuth: true, ...config });
export const publicDelete = (url, config = {}) => axiosInstance.delete(url, { skipAuth: true, ...config });
