// src/pages/Details.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { RequestContext } from "../../context/RequestContext";
import Loading from "../../components/Loading";
import { LuBadgePlus } from "react-icons/lu";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { fetchEthToInrRate } from "../../utils/ethToInr"; // optional util you already added

export default function Details() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { loading, error, selectedRequest, fetchRequest } =
    useContext(RequestContext);

  const [ethRate, setEthRate] = useState(null);

  useEffect(() => {
    if (!requestId) return;
    const fetchData = async () => {
      try {
        await fetchRequest(requestId);
      } catch (err) {
        console.error("Error fetching request:", err);
        navigate("/home");
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  useEffect(() => {
    let mounted = true;
    async function loadRate() {
      try {
        const r = await fetchEthToInrRate();
        if (mounted) setEthRate(r);
      } catch (e) {
        // ignore, ethRate remains null
      }
    }
    loadRate();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading && !selectedRequest) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-zinc-900 text-stone-100">
        <Loading fullScreen={false} />
      </div>
    );
  }

  if (error && !selectedRequest) {
    return (
      <div className="min-h-[200px] p-6 bg-zinc-900 text-stone-100 rounded-md border border-zinc-800">
        <p className="text-red-400">Error: {String(error?.message || error)}</p>
      </div>
    );
  }

  if (!selectedRequest) {
    return (
      <div className="min-h-[200px] p-6 bg-zinc-900 text-stone-100 rounded-md border border-zinc-800">
        <p className="text-stone-300">Request not found.</p>
      </div>
    );
  }

  // if user navigated to the donate sub-route, render children (Outlet)
  if (window.location.pathname === `/${requestId}/donate`) {
    return <Outlet />;
  }

  const req = selectedRequest;
  const targetAmount = Number(req?.target?.amount || 0);
  const received = Number(req?.totals?.totalReceived || 0);
  const donors = req?.totals?.donorsCount ?? 0;
  const lastDonationAt = req?.totals?.lastDonationAt
    ? new Date(req.totals.lastDonationAt)
    : null;
  const createdAt = req?.createdAt ? new Date(req.createdAt) : null;
  const progress =
    targetAmount > 0 ? Math.min((received / targetAmount) * 100, 100) : 0;

  const ownerDisplay =
    req.user && typeof req.user === "object"
      ? req.user.fullName
        ? `${req.user.fullName.firstName} ${req.user.fullName.lastName}`
        : req.user.email
      : String(req.user || req.userId || "Unknown");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // small visual feedback (toast not imported here to keep minimal)
      // you can replace with your toast: toast.success("Link copied")
      // using alert is obtrusive; prefer your toast lib
      console.log("Link copied");
    } catch (e) {
      console.warn("copy failed", e);
    }
  };

  const formattedEth = (val) =>
    Number.isFinite(val) ? String(val).replace(/\.0+$/, "") : val;

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <header className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-orange-400/20 text-orange-400 text-2xl font-semibold">
                  {ownerDisplay?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-semibold text-stone-100 leading-tight">
                    {req.title}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-2 bg-zinc-800/50 px-2 py-1 rounded-md text-stone-300">
                      <LuBadgePlus className="text-orange-400" />
                      <span className="font-medium text-stone-100">
                        {ownerDisplay}
                      </span>
                    </span>

                    <span
                      className={`text-xs px-2 py-1 rounded-md ${
                        req.status === "open"
                          ? "bg-green-900/30 text-green-300"
                          : req.status === "closed"
                          ? "bg-red-900/20 text-red-300"
                          : "bg-yellow-900/20 text-yellow-300"
                      }`}
                    >
                      {req.status}
                    </span>

                    <span className="text-xs text-stone-400">
                      • {req.category}
                    </span>

                    <button
                      onClick={copyLink}
                      className="ml-auto inline-flex items-center gap-2 bg-zinc-800/40 px-2 py-1 rounded-md text-stone-300 hover:bg-zinc-800/60"
                      title="Copy link"
                    >
                      <FiCopy />
                      <span className="text-xs">Copy link</span>
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-stone-200 leading-relaxed whitespace-pre-line">
                {req.description}
              </p>
            </header>

            {/* Details panels */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-stone-400">Progress</div>
                    <div className="mt-2 w-full max-w-xl">
                      <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 bg-orange-400 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="mt-2 text-sm text-stone-300 flex items-center gap-3">
                        <div className="font-medium text-stone-100">
                          {formattedEth(received)}{" "}
                          {req.target?.currencySymbol || "ETH"}
                        </div>
                        <div className="text-sm text-stone-400">
                          • {donors} donors
                        </div>
                        <div className="text-sm text-stone-400 ml-auto">
                          {targetAmount > 0
                            ? `Goal: ${formattedEth(targetAmount)} ${
                                req.target?.currencySymbol || "ETH"
                              }`
                            : "No goal"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* show INR equivalents if rate loaded */}
                  <div className="hidden sm:flex flex-col items-end text-right">
                    <div className="text-xs text-stone-400">Approx (INR)</div>
                    <div className="mt-1 text-sm text-stone-100 font-medium">
                      {ethRate ? (
                        <>
                          ₹{Number(received * ethRate).toLocaleString("en-IN")}
                          <span className="text-stone-400 block text-xs mt-1">
                            Goal:{" "}
                            {targetAmount > 0
                              ? `₹${Number(
                                  targetAmount * ethRate
                                ).toLocaleString("en-IN")}`
                              : "—"}
                          </span>
                        </>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-stone-400">Created</div>
                  <div className="text-sm text-stone-100 font-medium mt-1">
                    {createdAt ? createdAt.toLocaleString() : "—"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-stone-400">Last donation</div>
                  <div className="text-sm text-stone-100 font-medium mt-1">
                    {lastDonationAt ? lastDonationAt.toLocaleString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / actions */}
          <aside className="space-y-4">
            <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-4 flex flex-col gap-4">
              <div>
                <div className="text-xs text-stone-400">Request Owner</div>
                <div className="mt-2 text-sm font-semibold text-stone-100">
                  {ownerDisplay}
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  {req.user?.email || "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-stone-400">Recipient wallet</div>
                <div className="mt-2 text-sm text-stone-100 break-words">
                  {req.user?.walletId ||
                    req.ownerWalletAddress ||
                    "Not available"}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/${req._id}/donate`)}
                  className="w-full px-4 py-3 bg-orange-400 text-zinc-900 font-semibold rounded-lg hover:opacity-95"
                >
                  Donate
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard?.writeText(req._id)}
                  className="flex-1 px-3 py-2 bg-zinc-800/40 rounded-md text-sm text-stone-200 hover:bg-zinc-800/60"
                >
                  Copy ID
                </button>
                <a
                  className="flex-1 px-3 py-2 bg-zinc-800/40 rounded-md text-sm text-stone-200 text-center hover:bg-zinc-800/60"
                  href={`https://etherscan.io/address/${
                    req.user?.walletId || ""
                  }`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open on explorer"
                >
                  <span className="inline-flex items-center gap-2">
                    <FiExternalLink />
                    Explorer
                  </span>
                </a>
              </div>
            </div>

            {/* small stats card */}
            <div className="bg-zinc-800/20 border border-zinc-700 rounded-2xl p-4 text-sm text-stone-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs">Donors</div>
                  <div className="font-semibold text-stone-100">{donors}</div>
                </div>

                <div>
                  <div className="text-xs">Received</div>
                  <div className="font-semibold text-stone-100">
                    {formattedEth(received)}{" "}
                    {req.target?.currencySymbol || "ETH"}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile floating donate button */}
        <div className="fixed left-0 right-0 bottom-6 lg:bottom-12 flex justify-center lg:hidden pointer-events-auto">
          <button
            onClick={() => navigate(`/${req._id}/donate`)}
            className="px-6 py-3 bg-orange-400 text-zinc-900 rounded-full font-semibold shadow-2xl"
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
}
