import axios from "axios";
import { getFromLocalStorage } from "../utils/storage.utils";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/api/request";

const sessionId = getFromLocalStorage("sessionId") || "";

export const requestApi = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
requestApi.interceptors.request.use((cfg) => {
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

requestApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("API Error Response:", error.response);
      if (error.response.status === 401) {
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
      } else {
        return Promise.reject(error.response.data.error);
      }
    }
    return Promise.reject(error);
  }
);
