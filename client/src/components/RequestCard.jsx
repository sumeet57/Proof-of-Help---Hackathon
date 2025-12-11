// src/components/RequestCard.jsx
import React from "react";

export default function RequestCard({
  request,
  onView = () => {},
  onBoost = () => {},
  onDonate = () => {},
}) {
  const {
    _id,
    title,
    category,
    totals = {},
    target = {},
    createdAt,
    user,
  } = request;

  const received = Number(totals.totalReceived || 0);
  const targetAmount = Number(target.amount || 0);
  const progress =
    targetAmount > 0 ? Math.min((received / targetAmount) * 100, 100) : 0;

  // owner display fallback
  const ownerName = user?.fullName
    ? `${user.fullName.firstName} ${user.fullName.lastName}`
    : user?.email || "Unknown";

  return (
    <article
      className="bg-zinc-800/60 border border-zinc-700 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
      role="article"
      aria-labelledby={`req-${_id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-400/20 text-orange-400 font-semibold">
              {ownerName ? ownerName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <h3
                id={`req-${_id}`}
                className="text-lg font-semibold text-stone-100 truncate"
              >
                {title}
              </h3>
              <p className="text-sm text-stone-300 truncate">
                {category} • {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm text-stone-300 line-clamp-3">
            {request.description}
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 mr-4">
                <div className="w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-orange-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-stone-300">
                  <span>
                    {received} {target.currencySymbol || "ETH"} received
                  </span>
                  <span>
                    {targetAmount > 0
                      ? `${targetAmount} ${target.currencySymbol}`
                      : "No target"}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 flex gap-2 items-center">
                <button
                  onClick={() => onBoost(request)}
                  className="px-3 py-1.5 text-xs rounded-md bg-zinc-700 border border-zinc-600 text-stone-100 hover:bg-zinc-700/80"
                >
                  Boost
                </button>

                <button
                  onClick={() => onDonate(request)}
                  className="px-3 py-1.5 text-xs rounded-md bg-orange-400 text-zinc-900 font-semibold hover:opacity-95"
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
