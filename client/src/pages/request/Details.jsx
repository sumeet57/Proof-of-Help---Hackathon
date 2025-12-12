// src/pages/Details.jsx
import React, { useContext, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { RequestContext } from "../../context/RequestContext";
import Loading from "../../components/Loading";
import { LuBadgePlus } from "react-icons/lu";

export default function Details() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { loading, error, selectedRequest, fetchRequest } =
    useContext(RequestContext);
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
    return () => {};
  }, [requestId]);

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

  return window.location.pathname === `/${requestId}/donate` ? (
    <Outlet />
  ) : (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-stone-100 truncate">
                {req.title}
              </h1>
              <div className="mt-2 text-sm text-stone-300">
                <span className="inline-block mr-3">
                  Category:{" "}
                  <span className="font-medium text-stone-100">
                    {req.category}
                  </span>
                </span>
                <span className="inline-block mr-3">
                  Status:{" "}
                  <span className="font-medium text-stone-100">
                    {req.status}
                  </span>
                </span>
                <span className="inline-block">
                  Created:{" "}
                  <span className="font-medium text-stone-100">
                    {createdAt ? createdAt.toLocaleString() : "—"}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-end gap-3">
              <div className="inline-flex items-center gap-2 bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="p-2 rounded-md bg-orange-400/10 text-orange-400">
                  <LuBadgePlus />
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-300">Requests</div>
                  <div className="text-sm font-semibold text-stone-100">
                    {req.user
                      ? req.user.fullName
                        ? `${req.user.fullName.firstName} ${req.user.fullName.lastName}`
                        : req.user.email
                      : "Unknown"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/${req._id}/donate`)}
                className="px-4 py-2 bg-orange-400 text-zinc-900 rounded-lg font-semibold hover:opacity-95"
              >
                Donate
              </button>
            </div>
          </div>

          <div className="mt-6 text-stone-200">
            <p className="whitespace-pre-line">{req.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-orange-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-stone-300 flex items-center justify-between">
                <div>
                  {received} {req.target?.currencySymbol || "ETH"} received
                </div>
                <div>
                  {targetAmount > 0
                    ? `${targetAmount} ${req.target?.currencySymbol || "ETH"}`
                    : "No target"}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-stone-300">
              <div>
                <div className="text-xs">Donors</div>
                <div className="text-stone-100 font-medium">{donors}</div>
              </div>
              <div>
                <div className="text-xs">Last donation</div>
                <div className="text-stone-100 font-medium">
                  {lastDonationAt ? lastDonationAt.toLocaleString() : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
