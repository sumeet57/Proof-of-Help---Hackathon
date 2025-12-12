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

// Attach dynamic x-session-id for every request (reads localStorage at request time)
// userApi.interceptors.request.use((cfg) => {
//   try {
//     const sid = getFromLocalStorage("sessionId");
//     if (sid) {
//       cfg.headers["x-session-id"] = sid;
//     } else {
//       // ensure header removed if not set
//       delete cfg.headers["x-session-id"];
//     }
//   } catch (e) {
//     // ignore
//   }
//   return cfg;
// });

// Response handler (propagate useful error shape)
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // If server responded
    if (error.response) {
      // If 401 explicitly redirect to auth (you can also emit an event instead)
      if (error.response.status === 401) {
        const path = window.location.pathname;

        // pages where we don't want to force-redirect
        const allowedPaths = ["/auth", "/logout"];

        if (!allowedPaths.includes(path)) {
          window.location.href = "/auth";
        }

        return Promise.reject({
          status: 401,
          error: error.response.data?.error || "Unauthorized",
        });
      }

      // propagate server error body (consistent)
      return Promise.reject({
        status: error.response.status,
        error:
          error.response.data?.error || error.response.data || error.message,
      });
    }
    // network / other error
    return Promise.reject({
      status: 0,
      error: error.message || "Network error",
    });
  }
);
