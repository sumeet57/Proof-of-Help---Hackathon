import React from "react";
import { LuBadgePlus, LuZap } from "react-icons/lu";

export default function Service() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-stone-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
            Services
          </h1>
          <p className="text-stone-400 text-lg">
            Unlock premium features to maximize your impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-orange-500/20 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <LuBadgePlus className="text-orange-400 text-2xl" />
                </div>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded-full">
                  Coming Soon
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">Request Points</h2>
              <p className="text-stone-400 text-sm mb-6">
                Buy extra request points for creating new donation requests.
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-400">₹100</p>
                  <p className="text-xs text-stone-500 mt-1">per pack</p>
                </div>
                <button className="px-4 py-2 bg-zinc-700/40 rounded-lg text-stone-400 text-sm font-medium cursor-not-allowed hover:bg-zinc-700/60 transition-colors">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-orange-500/20 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <LuZap className="text-orange-400 text-2xl" />
                </div>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded-full">
                  Coming Soon
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">Boast Points</h2>
              <p className="text-stone-400 text-sm mb-6">
                Highlight your request to get more visibility on the platform.
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-orange-400">₹50</p>
                  <p className="text-xs text-stone-500 mt-1">per boost</p>
                </div>
                <button className="px-4 py-2 bg-zinc-700/40 rounded-lg text-stone-400 text-sm font-medium cursor-not-allowed hover:bg-zinc-700/60 transition-colors">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-orange-500/20 rounded-2xl p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <LuZap className="text-orange-400" />
                <h3 className="text-2xl font-bold">Auto-Boost Subscription</h3>
              </div>
              <p className="text-stone-400 text-sm">
                Automatically boost your requests every week for maximum
                visibility and impact.
              </p>
            </div>

            <div className="text-right">
              <label className="flex items-center cursor-not-allowed opacity-50">
                <div className="relative">
                  <input type="checkbox" disabled className="hidden" />
                  <div className="w-14 h-8 bg-zinc-700 rounded-full transition-colors"></div>
                  <div className="absolute w-6 h-6 bg-stone-300 rounded-full top-1 left-1 transition-transform"></div>
                </div>
              </label>
              <p className="text-xs text-stone-400 mt-2">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
