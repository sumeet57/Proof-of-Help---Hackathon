import React, { useEffect, useState } from "react";
import { fetchEthToInrRate } from "../utils/ethToInr";

export default function RequestCard({ request, onDonate = () => {} }) {
  const {
    _id,
    title,
    category,
    totals = {},
    target = {},
    createdAt,
    user,
    description,
  } = request;

  const [ethToInr, setEthToInr] = useState(200000);

  useEffect(() => {
    async function load() {
      const rate = await fetchEthToInrRate();
      setEthToInr(rate);
    }
    load();
  }, []);

  const received = Number(totals.totalReceived || 0);
  const targetAmount = Number(target.amount || 0);
  const progress =
    targetAmount > 0 ? Math.min((received / targetAmount) * 100, 100) : 0;

  const ownerName = user?.fullName
    ? `${user.fullName.firstName} ${user.fullName.lastName}`
    : user?.email || "Unknown";

  const receivedINR = (received * ethToInr).toLocaleString("en-IN");
  const targetINR = (targetAmount * ethToInr).toLocaleString("en-IN");

  return (
    <article className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 mb-3 shadow-sm hover:bg-zinc-800/70 transition">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 flex items-center justify-center rounded-md bg-orange-400/20 text-orange-400 text-lg font-semibold">
          {ownerName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold text-stone-100 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-stone-400">
            {category} • {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-stone-300 line-clamp-2">
        {description?.substring(0, 90)}...
      </p>

      {/* PROGRESS BAR */}
      <div className="mt-3 w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-1.5 bg-orange-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* NEW — COMPACT METRICS + DONATE BUTTON IN 1 ROW */}
      <div className="mt-2 flex items-center justify-between">
        {/* Left side: ETH + INR compact */}
        <div className="flex flex-col text-xs leading-tight">
          <span className="text-stone-200 font-medium">
            {received} {target.currencySymbol || "ETH"}
            {" | "}(₹{receivedINR})
          </span>

          <span className="text-stone-400">
            Target: {targetAmount} {" | "}
            {target.currencySymbol || "ETH"} (₹
            {targetINR})
          </span>
        </div>

        {/* Right side: Donate button (Large and crisp) */}
        <button
          onClick={() => onDonate(request)}
          className="px-4 py-2 bg-orange-400 text-zinc-900 text-sm font-semibold rounded-md hover:opacity-90 whitespace-nowrap ml-3"
        >
          Donate
        </button>
      </div>
    </article>
  );
}
