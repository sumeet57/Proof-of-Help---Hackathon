import React, { useEffect, useContext } from "react";
import { DonationContext } from "../context/DonationContext";

const UserDonation = () => {
  const { myDonations, fetchDonationsByUser, loading, error } =
    useContext(DonationContext);

  // Load donations once on component mount
  useEffect(() => {
    const load = async () => {
      await fetchDonationsByUser();
    };
    load();
    // Dependency array ensures this runs once and cleans up if needed
  }, []); // Added fetchDonationsByUser to dependencies

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight mb-6">
          Your Donations
        </h1>
        {/* Loading */}
        {loading && (
          <div className="py-12 flex justify-center">
            <div className="loader rounded-full border-4 border-t-4 border-zinc-700 h-12 w-12"></div>
          </div>
        )}
        {/* Error */}
        {error && (
          <p className="text-red-400 mb-4">Failed to load donations.</p>
        )}
        {/* Empty: Check if not loading AND myDonations is an empty array */}
        {!loading && myDonations && myDonations.length === 0 && (
          <p className="text-stone-400">You haven't donated yet.</p>
        )}

        {/* Donation List */}
        <div className="space-y-4">
          {/* Ensure myDonations exists before mapping */}
          {myDonations &&
            myDonations.map((d) => {
              const id = d._id || d.id;

              // Determine the Etherscan base URL based on network
              const isSepolia = d.amount?.network === "sepolia";
              const explorerUrl = `https://${
                isSepolia ? "sepolia." : ""
              }etherscan.io/tx/${d.txHash}`;

              return (
                <div
                  key={id}
                  className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700 hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-stone-100 truncate max-w-[70%]">
                      {d.request?.title || "Donation Request"}
                    </h3>

                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-400 hover:text-orange-300 transition-colors shrink-0"
                    >
                      View TX
                    </a>
                  </div>

                  <p className="text-sm text-stone-400 mt-1">
                    You donated{" "}
                    <span className="text-orange-400 font-semibold">
                      {d.amount?.value} {d.amount?.currencySymbol}
                    </span>{" "}
                    to {d.toWallet?.slice(0, 6)}...
                  </p>

                  <div className="flex justify-between text-xs text-stone-500 mt-2">
                    <p>TxHash: {d.txHash?.slice(0, 10)}...</p>
                    <p>At: {new Date(d.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default UserDonation;
