import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
// import { CheckoutContext } from "../context/CheckoutContext.jsx";
import { toast } from "react-toastify";
import { load } from "@cashfreepayments/cashfree-js";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../utils/storage.utils.js";
import { CheckoutContext } from "../context/CheckoutContext.jsx";

const POINT_PRICING = {
  request: 50,
  boost: 20,
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user, setLoading } = useContext(UserContext);
  const {
    checkout,
    verify,
    userDropped,
    placeOrderLoading,
    setPlaceOrderLoading,
    pointType,
    setPointType,
  } = useContext(CheckoutContext);

  /* Cashfree */
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    load({ mode: import.meta.env.VITE_CF_ENV }).then(setCashfree);
  }, []);

  const [currentOrderId, setCurrentOrderId] = useState(
    getFromLocalStorage("orderId")
  );

  useEffect(() => {
    if (currentOrderId) saveToLocalStorage("orderId", currentOrderId);
  }, [currentOrderId]);

  /* Checkout form */
  const [pointCount, setPointCount] = useState(1);

  const pricePerUnit = POINT_PRICING[pointType];
  const totalAmount = pricePerUnit * pointCount;

  const handleBuyNow = async () => {
    setPlaceOrderLoading(true);

    try {
      const { sessionId, orderId } = await checkout({
        pointType,
        pointCount,
      });

      setCurrentOrderId(orderId);

      await cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
        mode: import.meta.env.VITE_CF_ENV,
      });

      await verify(orderId);

      localStorage.removeItem("orderId");
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      toast.error(err);
      if (currentOrderId) {
        console.log("Calling userDropped with orderId:", currentOrderId);
        await userDropped(currentOrderId);
      }
    } finally {
      setPlaceOrderLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 pt-20 pb-10">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT – SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-zinc-800/70 border border-zinc-700 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-orange-400 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Point Type</span>
                <span className="capitalize">{pointType}</span>
              </div>

              <div className="flex justify-between">
                <span>Price / point</span>
                <span>₹{pricePerUnit}</span>
              </div>

              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{pointCount}</span>
              </div>

              <div className="border-t border-zinc-700 pt-3 flex justify-between text-lg font-bold text-orange-400">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT – CONFIG */}
        <div className="lg:col-span-2 bg-zinc-800/70 border border-zinc-700 rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">
            Buy Points
          </h2>

          {/* POINT TYPE */}
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">
              Select Point Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["request", "boost"].map((type) => (
                <button
                  key={type}
                  onClick={() => setPointType(type)}
                  className={`p-4 rounded-xl border text-left transition ${
                    pointType === type
                      ? "border-orange-400 bg-orange-400/10"
                      : "border-zinc-700 bg-zinc-900"
                  }`}
                >
                  <p className="font-semibold capitalize">{type} Points</p>
                  <p className="text-sm text-zinc-400">
                    ₹{POINT_PRICING[type]} / point
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-2">
              Select Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPointCount((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-zinc-700 hover:bg-zinc-600"
              >
                −
              </button>
              <span className="text-xl font-semibold">{pointCount}</span>
              <button
                onClick={() => setPointCount((q) => q + 1)}
                className="w-10 h-10 rounded-lg bg-zinc-700 hover:bg-zinc-600"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={placeOrderLoading}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-lg transition disabled:opacity-50"
          >
            {placeOrderLoading ? "Processing…" : `Pay ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
