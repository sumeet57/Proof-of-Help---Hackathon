import React, { useEffect, useState, createContext } from "react";
import { userApi } from "../interceptors/user.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
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
        navigate(-1);
        getUser();
        saveToLocalStorage("sessionId", response.data.sessionId);
        toast.success(response.data.message);
      }
      return response;
    } catch (error) {
      toast.error(error);
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
        navigate(-1);
        getUser();
        saveToLocalStorage("sessionId", response.data.sessionId);
        toast.success(response.data.message);
      }
      return response;
    } catch (error) {
      toast.error(error);
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await userApi.post("/logout");
      if (response.status === 200) {
        setUser(null);
        removeFromLocalStorage("sessionId");
        toast.success(response.data.message);
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
      value={{ user, loading, setLoading, register, login, getUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
