import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendUrl}/api/payment`;
const sessionId = localStorage.getItem("sessionId") || "";

export const paymentApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // "Content-Type": "multipart/form-data",
    "x-session-id": sessionId,
  },
});
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 202) {
        return Promise.reject(error.response.data.error);
      } else if (error.response.status === 401) {
        window.location.href = "/auth";
      } else if (error.response.status === 400) {
        return Promise.reject(error.response.data.error);
      } else if (error.response.status === 404) {
        return Promise.reject(error.response.data.error);
      } else if (error.response.status === 409) {
        return Promise.reject(error.response.data.error);
      } else if (error.response.status === 410) {
        return Promise.reject(error.response.data.error);
      } else if (error.response.status === 500) {
        return Promise.reject("Server error. Please try again later.");
      } else if (error.response.status === 503) {
        return Promise.reject(error.response.data.error);
      }
    }
    return Promise.reject(error);
  }
);
