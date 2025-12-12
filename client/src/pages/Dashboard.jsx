// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import { UserContext } from "../context/UserContext";
import { requestApi } from "../interceptors/request.api";
import { toast } from "react-toastify";
import { FiMoreVertical } from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // ONLY these from context — we will use exactly this:
  const { requests, fetchRequestByUser, updateRequest } =
    useContext(RequestContext);

  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // ✔ Fetch only user's requests
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const a = await fetchRequestByUser(user?._id); // ONLY this as you asked
        console.log("Fetched user requests:", a);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ------------ ACTION HANDLERS -------------

  const handleView = (id) => navigate(`/${id}`);
  const handleAnalytics = (id) => navigate(`/analytics/${id}`);

  async function changeStatus(id, newStatus) {
    setUpdatingId(id);
    const prev = requests.find((r) => r._id === id || r.id === id)?.status;

    try {
      await updateRequest(id, { status: newStatus });
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Your Requests
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Manage your donation requests and view analytics
            </p>
          </div>

          <button
            onClick={() => navigate("/create")}
            className="px-4 py-2 bg-orange-400 text-zinc-900 rounded-lg font-semibold hover:opacity-95"
          >
            New Request
          </button>
        </header>

        {/* Loader */}
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="loader rounded-full border-4 border-t-4 border-zinc-700 h-12 w-12" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 bg-zinc-800/30 border border-zinc-700 rounded-2xl text-stone-300">
            <p className="mb-2">You have no requests yet.</p>
            <button
              onClick={() => navigate("/create")}
              className="px-4 py-2 bg-orange-400 text-zinc-900 rounded-lg font-semibold"
            >
              Create your first request
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop header row */}
            <div className="hidden lg:flex items-center gap-4 text-stone-400 text-sm px-3">
              <div className="w-2/5">Title</div>
              <div className="w-1/5">Category</div>
              <div className="w-1/5">Target</div>
              <div className="w-1/5">Status</div>
              <div className="w-40 text-right">Actions</div>
            </div>

            {requests.map((req) => {
              const id = req._id || req.id;

              return (
                <div
                  key={id}
                  className="bg-zinc-800/20 border border-zinc-700 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                >
                  {/* LEFT */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-stone-100">
                      {req.title}
                    </h3>
                    <p className="text-sm text-stone-400 mt-1 line-clamp-2">
                      {req.description}
                    </p>

                    {/* Desktop details */}
                    <div className="hidden lg:flex items-center gap-6 text-sm text-stone-300 mt-3">
                      <div>Category: {req.category}</div>
                      <div>
                        Target: {req.target?.amount || 0}{" "}
                        {req.target?.currencySymbol || "ETH"}
                      </div>
                      <div>
                        Donors: {req.totals?.donorsCount || 0} •{" "}
                        {req.totals?.totalReceived || 0}
                      </div>
                    </div>

                    {/* Mobile status */}
                    <div className="lg:hidden mt-3">
                      <select
                        value={req.status}
                        disabled={updatingId === id}
                        onChange={(e) => changeStatus(id, e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-2 text-sm"
                      >
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                        <option value="flagged">flagged</option>
                      </select>
                    </div>
                  </div>

                  {/* RIGHT buttons */}
                  <div className="flex items-center gap-3 ml-auto lg:ml-0">
                    {/* Desktop status */}
                    <div className="hidden lg:block">
                      <select
                        value={req.status}
                        disabled={updatingId === id}
                        onChange={(e) => changeStatus(id, e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm"
                      >
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                        <option value="flagged">flagged</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleView(id)}
                      className="px-3 py-2 bg-orange-400 text-zinc-900 rounded-lg text-sm font-semibold"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(id);
                        toast.info("ID copied");
                      }}
                      className="p-2 bg-zinc-800/30 rounded-md hover:bg-zinc-800/50"
                    >
                      <FiMoreVertical />
                    </button>

                    {updatingId === id && (
                      <div className="text-xs text-stone-400">Updating…</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
