import React, { useEffect, useState, createContext } from "react";
import { userApi } from "../interceptors/userApi.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "../utils/storage.utils";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await userApi.get("/");
      if (response) {
        setUser(response.data);
      }
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await userApi.post("/register", userData);
      if (response.status === 201) {
        // Save sessionId BEFORE fetching user so the next request includes it
        saveToLocalStorage("sessionId", response.data.sessionId);
        await getUser();
        navigate(-1);
        toast.success(response.data.message);
      }
      return response;
    } catch (error) {
      toast.error(error.error || error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setLoading(true);
      const response = await userApi.post("/login", userData);
      if (response.status === 200) {
        saveToLocalStorage("sessionId", response.data.sessionId);
        await getUser();
        navigate(-1);
        toast.success(response.data.message);
      }
      return response;
    } catch (error) {
      toast.error(error.error || error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await userApi.post("/logout");
      removeFromLocalStorage("sessionId");
      setUser(null);
      window.location.href = "/";
      return response;
    } catch (err) {
      if (err?.status === 401) {
        removeFromLocalStorage("sessionId");
        setUser(null);
        window.location.href = "/auth";
      } else {
        toast.error(err?.error || err?.message || "Logout failed");
      }
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const update = async (userData) => {
    try {
      setLoading(true);
      const response = await userApi.put("/", userData);

      if (response.status === 200) {
        setUser(response.data);
        toast.success("Profile updated successfully");
      }
      return response;
    } catch (error) {
      toast.error(error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setLoading,
        register,
        login,
        getUser,
        update,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
