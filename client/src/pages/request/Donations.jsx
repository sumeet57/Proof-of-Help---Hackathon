import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DonationContext } from "../../context/DonationContext.jsx";
import { FiExternalLink, FiUser, FiArrowDown } from "react-icons/fi";

const SORTS = {
  latest: "Latest",
  oldest: "Oldest",
  high: "Amount ↓",
  low: "Amount ↑",
};

const Donations = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const { requestDonations, loading, fetchDonationsForRequest } =
    useContext(DonationContext);

  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    if (requestId) fetchDonationsForRequest(requestId);
  }, [requestId]);

  const donations = useMemo(() => {
    if (!requestDonations) return [];

    const list = [...requestDonations];
    switch (sortBy) {
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.txTimestamp) - new Date(b.txTimestamp)
        );
      case "high":
        return list.sort((a, b) => b.amount.value - a.amount.value);
      case "low":
        return list.sort((a, b) => a.amount.value - b.amount.value);
      default:
        return list.sort(
          (a, b) => new Date(b.txTimestamp) - new Date(a.txTimestamp)
        );
    }
  }, [requestDonations, sortBy]);

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center text-stone-400">
        Loading donations…
      </div>
    );
  }

  if (!donations.length) {
    return (
      <div className="h-40 flex items-center justify-center text-stone-500">
        No donations yet
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-stone-100 bg-red-500 px-3 py-1.5 rounded-md hover:text-stone-200 flex items-center gap-1"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold tracking-tight">
            All Donations
          </h2>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-zinc-800/70 border border-zinc-700 text-sm px-4 py-2 pr-8 rounded-lg focus:outline-none"
            >
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <FiArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Donation list */}
        <div className="space-y-3">
          {donations.map((d) => (
            <div
              key={d._id}
              className="group bg-zinc-800/40 backdrop-blur border border-zinc-700/70 rounded-xl p-4 hover:bg-zinc-800/60 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Amount */}
                <div className="flex-1">
                  <div className="text-lg font-semibold text-stone-100">
                    {d.amount.value}{" "}
                    <span className="text-sm text-stone-400">
                      {d.amount.currencySymbol}
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-stone-400">
                    From{" "}
                    <span className="font-mono">
                      {d.fromWallet.slice(0, 6)}…{d.fromWallet.slice(-4)}
                    </span>
                  </div>

                  <div className="text-xs text-stone-500 mt-1">
                    {new Date(d.txTimestamp).toLocaleString()}
                  </div>
                </div>

                {/* Meta */}
                <div className="text-xs text-stone-400">
                  Network: {d.amount.networkName}
                  <br />
                  Block: {d.blockNumber}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      d.txStatus === "confirmed"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {d.txStatus}
                  </span>

                  <div className="flex gap-2">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${d.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-zinc-900/60 hover:bg-zinc-900"
                    >
                      Tx <FiExternalLink />
                    </a>

                    <button
                      onClick={() => navigate(`/profile/${d.fromUser}`)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-zinc-900/60 hover:bg-zinc-900"
                    >
                      <FiUser /> Donor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donations;
