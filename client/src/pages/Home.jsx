// src/pages/Home.jsx
import React, { useEffect, useContext } from "react";
import { RequestContext } from "../context/RequestContext";
import RequestCard from "../components/RequestCard";
import Loading from "../components/Loading";

const Home = () => {
  const { loading, error, requests, fetchAllRequests } =
    useContext(RequestContext);

  useEffect(() => {
    fetchAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 py-2 lg:py-8 px-2 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-stone-100 hover:bg-zinc-800/90"
              onClick={() => (window.location.href = "/requests/create")}
            >
              + Create Request
            </button>
          </div>
        </div>

        {loading ? (
          <div className="pt-12">
            <Loading fullScreen={false} />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-zinc-800/40 p-4">
            <p className="text-sm text-red-400">
              Error: {error.message || String(error)}
            </p>
          </div>
        ) : requests?.length === 0 ? (
          <div className="rounded-lg bg-zinc-800/40 p-8 text-center">
            <p className="text-stone-300">
              No requests found. Create the first request!
            </p>
            <button
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-400 text-zinc-900 font-semibold"
              onClick={() => (window.location.href = "/requests/create")}
            >
              + Create Request
            </button>
          </div>
        ) : (
          <main>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onBoost={(r) => {
                    // open boost modal or call boost API
                    console.log("Boost", r._id);
                  }}
                  onDonate={(r) => {
                    // navigate to request detail or donation modal
                    window.location.href = `/requests/${r._id}`;
                  }}
                />
              ))}
            </section>
          </main>
        )}
      </div>
    </div>
  );
};

export default Home;
