import axios from "axios";
import { getFromLocalStorage } from "../utils/storage.utils.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/user";

export const userApi = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use((cfg) => {
  try {
    const sid = getFromLocalStorage("sessionId");
    if (sid) {
      cfg.headers["x-session-id"] = sid;
    } else {
      delete cfg.headers["x-session-id"];
    }
  } catch (e) {
    console.error("Error attaching x-session-id:", e);
  }
  return cfg;
});

userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const path = window.location.pathname;
        const allowedPaths = ["/auth", "/logout", "/"];

        if (!allowedPaths.includes(path)) {
          window.location.href = "/auth";
        }

        return Promise.reject({
          status: 401,
          error: error.response.data?.error || "Unauthorized",
        });
      }
      return Promise.reject({
        status: error.response.status,
        error:
          error.response.data?.error || error.response.data || error.message,
      });
    }

    return Promise.reject({
      status: 0,
      error: error.message || "Network error",
    });
  }
);
