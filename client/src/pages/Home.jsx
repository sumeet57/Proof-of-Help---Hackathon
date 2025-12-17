import React, { useEffect, useContext } from "react";
import { RequestContext } from "../context/RequestContext";
import RequestCard from "../components/RequestCard";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { loading, error, requests, fetchAllRequests } =
    useContext(RequestContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100">
      <div className="w-full">
        {/* Header actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Create request */}
            <button
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-sm text-stone-100 hover:bg-zinc-800/90"
              onClick={() => navigate("/create")}
            >
              + Create Request
            </button>

            {/* Buy credits (desktop only) */}
            <button
              className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-md border border-orange-400/40 text-sm text-orange-300 hover:bg-orange-400/10 transition"
              onClick={() => navigate("/service")}
            >
              Buy Credits
            </button>
          </div>
        </div>

        {/* Content */}
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
              onClick={() => navigate("/create")}
            >
              + Create Request
            </button>
          </div>
        ) : (
          <main>
            <section className="flex flex-col gap-2">
              {requests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onDonate={(r) => navigate(`/${r._id}`)}
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
