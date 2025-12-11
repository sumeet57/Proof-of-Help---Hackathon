import { createContext, useState, useEffect } from "react";
import { requestApi } from "../interceptors/request.api";
import { toast } from "react-toastify";

export const RequestContext = createContext();

export const RequestContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const response = await requestApi.get("/");
      console.log(response);
      setRequests(response.data.items);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequest = async (requestId) => {
    try {
      setLoading(true);
      console.log("Fetching request with ID:", requestId);
      const response = await requestApi.get(`/${requestId}`);
      console.log(response);
      setSelectedRequest(response.data.request);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addRequest = async (requestData) => {
    try {
      setLoading(true);
      const res = await requestApi.post("/", requestData);
      toast.success("Request created successfully");
      return res;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequestContext.Provider
      value={{
        loading,
        error,
        requests,
        selectedRequest,
        setSelectedRequest,
        fetchAllRequests,
        fetchRequest,
        addRequest,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
