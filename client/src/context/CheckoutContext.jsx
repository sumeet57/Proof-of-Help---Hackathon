import { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import { paymentApi } from "../interceptors/payment.api";

export const CheckoutContext = createContext();

export const CheckoutContextProvider = ({ children }) => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [OrderId, setOrderId] = useState(null);
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [pointType, setPointType] = useState("request");

  const checkout = async (data) => {
    try {
      setPlaceOrderLoading(true);

      const response = await paymentApi.post("/checkout", JSON.stringify(data));
      setOrderId(response.data.orderId);
      setPlaceOrderLoading(false);
      return {
        sessionId: response.data.paymentSessionId,
        orderId: response.data.orderId,
      };
    } catch (error) {
      console.error("Error during checkout:", error);
      setPlaceOrderLoading(false);
      throw error;
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  const verifyPayment = async (orderId) => {
    setPlaceOrderLoading(true);
    try {
      const response = await paymentApi.post(
        "/verify",
        JSON.stringify({ OrderId: orderId })
      );
      toast.success("Payment verified successfully.");
      return response.data.amount;
    } catch (error) {
      toast.error("Payment verification failed. Please try again.");
      throw error;
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  const userDropped = async (orderId) => {
    console.log("Client dropped called with orderId:", orderId);
    try {
      setPlaceOrderLoading(true);
      await paymentApi.post(
        "/user-dropped",
        JSON.stringify({ OrderId: orderId })
      );
      toast.info("Payment was not completed.");
    } catch (error) {
      toast.error("Error recording dropped payment.");
      throw error;
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        OrderId,

        placeOrderLoading,
        setPlaceOrderLoading,

        checkout,
        verify: verifyPayment,
        userDropped,
        pointType,
        setPointType,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
