import React from "react";
import { LuBadgePlus, LuZap } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { CheckoutContext } from "../context/CheckoutContext";

export default function Service() {
  const navigate = useNavigate();
  const { setPointType } = React.useContext(CheckoutContext);

  const handleBuy = (type) => {
    setPointType(type);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-stone-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
            Services
          </h1>
          <p className="text-stone-400 text-lg">
            Unlock premium features to maximize your impact
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Request Points */}
          <div className="group relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-orange-500/20 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-4">
                <LuBadgePlus className="text-orange-400 text-2xl" />
              </div>

              <h2 className="text-xl font-bold mb-2">Request Points</h2>
              <p className="text-stone-400 text-sm mb-6">
                Create more donation requests without limits.
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-400">₹50</p>
                  <p className="text-xs text-stone-500 mt-1">per request</p>
                </div>

                <button
                  onClick={() => handleBuy("request")}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-zinc-900 font-semibold rounded-lg transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Boost Points */}
          <div className="group relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-orange-500/20 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="p-3 bg-orange-500/10 rounded-xl w-fit mb-4">
                <LuZap className="text-orange-400 text-2xl" />
              </div>

              <h2 className="text-xl font-bold mb-2">Boost Points</h2>
              <p className="text-stone-400 text-sm mb-6">
                Boost your request visibility and reach more donors.
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-400">₹20</p>
                  <p className="text-xs text-stone-500 mt-1">per boost</p>
                </div>

                <button
                  onClick={() => handleBuy("boost")}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-zinc-900 font-semibold rounded-lg transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription (still coming soon) */}
        <div className="relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-orange-500/20 rounded-2xl p-8 overflow-hidden opacity-60">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LuZap className="text-orange-400" />
                <h3 className="text-2xl font-bold">Auto-Boost Subscription</h3>
              </div>
              <p className="text-stone-400 text-sm">
                Automatically boost your requests every week.
              </p>
            </div>

            <p className="text-sm text-stone-400">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
