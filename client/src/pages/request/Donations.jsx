import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DonationContext } from "../../context/DonationContext.jsx";

const Donations = () => {
  const { requestId } = useParams();

  const { requestDonations, loading, fetchDonationsForRequest } =
    useContext(DonationContext);

  useEffect(() => {
    if (requestId) {
      fetchDonationsForRequest(requestId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-stone-300">
        Loading donations…
      </div>
    );
  }

  if (!requestDonations || requestDonations.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-stone-400">
        No donations found for this request.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Donations</h2>

        <div className="space-y-3">
          {requestDonations.map((d) => (
            <div
              key={d._id}
              className="bg-zinc-800/40 border border-zinc-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              {/* Amount */}
              <div>
                <div className="text-sm font-semibold text-stone-100">
                  {d.amount?.value} {d.amount?.currencySymbol}
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  From{" "}
                  <span className="font-mono text-stone-300">
                    {d.fromWallet.slice(0, 6)}…{d.fromWallet.slice(-4)}
                  </span>
                </div>
              </div>

              {/* Network info */}
              <div className="text-xs text-stone-400">
                Network: {d.amount?.networkName}
                <br />
                Block: {d.blockNumber}
              </div>

              {/* Status */}
              <div className="text-right">
                <div
                  className={`text-xs font-semibold ${
                    d.txStatus === "confirmed"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {d.txStatus}
                </div>

                <a
                  href={`https://sepolia.etherscan.io/tx/${d.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-orange-400 hover:underline block mt-1"
                >
                  View Transaction
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donations;
