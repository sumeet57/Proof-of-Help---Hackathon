// src/pages/Details.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { RequestContext } from "../../context/RequestContext";
import Loading from "../../components/Loading";
import { LuBadgePlus } from "react-icons/lu";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { fetchEthToInrRate } from "../../utils/ethToInr";

export default function Details() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { loading, error, selectedRequest, fetchRequest } =
    useContext(RequestContext);

  const [ethRate, setEthRate] = useState(null);

  useEffect(() => {
    if (!requestId) return;
    fetchRequest(requestId).catch(() => navigate("/home"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  useEffect(() => {
    fetchEthToInrRate()
      .then(setEthRate)
      .catch(() => {});
  }, []);

  if (
    window.location.pathname === `/${requestId}/donate` ||
    window.location.pathname === `/${requestId}/donations`
  ) {
    return <Outlet />;
  }

  if (loading && !selectedRequest) {
    return <Loading fullScreen={true} />;
  }

  if (error || !selectedRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-stone-400">
        Request not found
      </div>
    );
  }

  const req = selectedRequest;
  const target = Number(req.target?.amount || 0);
  const received = Number(req.totals?.totalReceived || 0);
  const donors = req.totals?.donorsCount ?? 0;
  const progress = target ? Math.min((received / target) * 100, 100) : 0;

  const owner = req.user?.fullName
    ? `${req.user.fullName.firstName} ${req.user.fullName.lastName}`
    : req.user?.email || "Unknown";

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-5">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-400/20 flex items-center justify-center text-orange-400 text-xl font-bold">
                {owner.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold truncate">
                  {req.title}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-md bg-zinc-800/60">
                    {req.category}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-md ${
                      req.status === "open"
                        ? "bg-green-900/30 text-green-300"
                        : req.status === "closed"
                        ? "bg-red-900/30 text-red-300"
                        : "bg-yellow-900/30 text-yellow-300"
                    }`}
                  >
                    {req.status}
                  </span>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                    className="ml-auto flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800"
                  >
                    <FiCopy /> Copy link
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-stone-200 whitespace-pre-line">
              {req.description}
            </p>
          </div>

          <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-5 space-y-3">
            <div className="w-full bg-zinc-700 h-3 rounded-full overflow-hidden">
              <div
                className="h-3 bg-orange-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-300">
              <span className="font-semibold text-stone-100">
                {received} ETH
              </span>
              <span>• {donors} donors</span>
              <span className="ml-auto">Goal: {target || "—"} ETH</span>

              <button
                onClick={() => navigate(`/${req._id}/donations`)}
                className="px-3 py-1.5 rounded-md bg-orange-400/10 text-orange-400 border border-orange-400/30 hover:bg-orange-400/20"
              >
                View all donations
              </button>
            </div>

            {ethRate && (
              <div className="text-xs text-stone-400">
                ≈ ₹{Math.round(received * ethRate).toLocaleString("en-IN")} / ₹
                {Math.round(target * ethRate).toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-5 space-y-4">
            <div>
              <div className="text-xs text-stone-400">Request Owner</div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <div>
                  <div className="font-semibold">{owner}</div>
                  <div className="text-xs text-stone-400">
                    {req.user?.email}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/profile/${req.user?._id}`)}
                  className="px-3 py-1.5 text-xs rounded-md bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"
                >
                  View Profile
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs text-stone-400">Recipient Wallet</div>
              <div className="text-xs break-all mt-1">
                {req.user?.walletId || "Not available"}
              </div>
            </div>

            <button
              onClick={() => navigate(`/${req._id}/donate`)}
              className="w-full py-3 bg-orange-400 text-zinc-900 font-semibold rounded-lg hover:opacity-95"
            >
              Donate
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(req._id)}
                className="flex-1 px-3 py-2 text-xs bg-zinc-800 rounded-md"
              >
                Copy ID
              </button>

              <a
                href={`https://etherscan.io/address/${
                  req.user?.walletId || ""
                }`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-3 py-2 text-xs bg-zinc-800 rounded-md text-center"
              >
                <FiExternalLink className="inline mr-1" />
                Explorer
              </a>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center lg:hidden">
        <button
          onClick={() => navigate(`/${req._id}/donate`)}
          className="px-6 py-3 bg-orange-400 text-zinc-900 rounded-full font-semibold shadow-xl"
        >
          Donate
        </button>
      </div>
    </div>
  );
}
