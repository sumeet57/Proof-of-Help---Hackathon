// src/pages/Donation.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import { DonationContext } from "../context/DonationContext";
import { WalletContext } from "../context/WalletContext";
import Loading from "../components/Loading";
import { CURRENCY_SYMBOL } from "../utils/web3.utils.js";

export default function Donation() {
  const { requestId } = useParams(); // use requestId (not id)
  const {
    selectedRequest,
    fetchRequest,
    loading: reqLoading,
  } = useContext(RequestContext);
  const {
    donate,
    loading: donating,
    error: donateError,
    validateBeforeDonation,
  } = useContext(DonationContext);
  const { connected, connectWallet } = useContext(WalletContext);

  const selectedRequestRef = useRef(selectedRequest);
  useEffect(() => {
    selectedRequestRef.current = selectedRequest;
  }, [selectedRequest]);

  const [amountEth, setAmountEth] = useState("");
  const [error, setError] = useState(null);
  const [successTx, setSuccessTx] = useState(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (!requestId) return;
    fetchRequest(requestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  useEffect(() => {
    if (!selectedRequest) return;
    const suggested = Number(selectedRequest?.target?.amount || 0);
    setAmountEth(suggested > 0 ? String(suggested) : "");
  }, [selectedRequest]);

  // wait until selectedRequestRef is populated (or timeout)
  async function waitForSelectedRequest(timeoutMs = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (
        selectedRequestRef.current &&
        (selectedRequestRef.current._id === requestId ||
          String(selectedRequestRef.current._id) === String(requestId))
      ) {
        return selectedRequestRef.current;
      }
      // small delay
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 150));
    }
    return selectedRequestRef.current || null;
  }

  // robust resolver using only fetchRequest -> selectedRequest (no direct API call)
  async function resolveRecipient(request) {
    if (!request) return { toUserId: null, toWallet: null };

    let toUserId = null;
    let toWallet = null;

    if (request.user && typeof request.user === "object") {
      toUserId = request.user._id || null;
      toWallet = request.user.walletId || null;
    }

    if (
      (!toUserId || !toWallet) &&
      request.user &&
      typeof request.user === "string"
    ) {
      toUserId = toUserId || request.user;
    }

    toWallet =
      toWallet || request.ownerWalletAddress || request.recipientWallet || null;

    return { toUserId, toWallet };
  }

  async function handleDonate(e) {
    e.preventDefault();
    setError(null);
    setSuccessTx(null);

    if (!requestId) {
      setError("Request ID missing in URL");
      return;
    }

    if (requestId) {
      try {
        await validateBeforeDonation(requestId);
      } catch (error) {
        return setError(error.message || "Donation validation failed");
      }
    }
    console.log("Validated donation for request ID:", requestId);

    // use current selectedRequest first
    let localRequest = selectedRequestRef.current || selectedRequest;
    if (!localRequest) {
      // try to fetch explicitly (fetchRequest already called in useEffect, but call again to be sure)
      setResolving(true);
      await fetchRequest(requestId);
      localRequest = await waitForSelectedRequest(3000);
      setResolving(false);
    }

    if (!localRequest) {
      setError("Request not loaded. Try again.");
      return;
    }

    // Resolve recipient info
    let { toUserId, toWallet } = await resolveRecipient(localRequest);

    // if wallet missing, force a fresh fetch and wait for selectedRequest to populate
    if (!toWallet) {
      setResolving(true);
      await fetchRequest(requestId);
      const updated = await waitForSelectedRequest(3000);
      setResolving(false);
      if (updated) {
        const resolved = await resolveRecipient(updated);
        toUserId = toUserId || resolved.toUserId;
        toWallet = toWallet || resolved.toWallet;
        localRequest = updated;
      }
    }

    if (!toUserId) {
      setError("Recipient user id is missing. Cannot proceed.");
      return;
    }

    if (!toWallet) {
      setError(
        "Recipient wallet is not available. The request owner hasn't added a wallet. Ask them to connect a wallet or provide one."
      );
      return;
    }

    if (!amountEth || Number(amountEth) <= 0) {
      setError("Enter a valid amount in ETH");
      return;
    }

    try {
      if (!connected) {
        await connectWallet();
      }

      const res = await donate({
        requestId,
        toUserId,
        toWallet,
        amountEth,
        currencySymbol: localRequest?.target?.currencySymbol || CURRENCY_SYMBOL,
        network: localRequest?.target?.network || "sepolia",
      });

      setSuccessTx(res.txHash);
      // refresh request details in UI
      await fetchRequest(requestId);
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || "Donation failed";
      setError(msg);
    }
  }

  if (reqLoading && !selectedRequest) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-zinc-900 text-stone-100">
        <Loading fullScreen={false} />
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
  const recipientPreview =
    req.user && typeof req.user === "object"
      ? `${req.user.fullName?.firstName || ""} ${
          req.user.fullName?.lastName || ""
        }`.trim() ||
        req.user.email ||
        req.user._id
      : String(req.user || req.userId || "Unknown");

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{req.title}</h2>
          <p className="text-sm text-stone-400 mt-1">{req.description}</p>

          <div className="mt-4 text-sm text-stone-300">
            Recipient:{" "}
            <span className="text-stone-100 font-medium">
              {recipientPreview}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="bg-zinc-900/20 border border-zinc-800 p-4 rounded-lg">
              <div className="text-sm text-stone-300">Target</div>
              <div className="mt-1 text-lg font-semibold text-stone-100">
                {Number(req.target?.amount || 0)}{" "}
                {req.target?.currencySymbol || CURRENCY_SYMBOL}
              </div>
              <div className="text-xs text-stone-400 mt-1">
                {req.totals?.totalReceived || 0} received •{" "}
                {req.totals?.donorsCount || 0} donors
              </div>
            </div>

            <form onSubmit={handleDonate} className="space-y-4">
              <div>
                <label className="text-sm block mb-2">
                  Amount ({CURRENCY_SYMBOL})
                </label>
                <input
                  value={amountEth}
                  onChange={(e) => setAmountEth(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400/40"
                  placeholder="e.g., 0.05"
                  inputMode="decimal"
                />
              </div>

              {(error || donateError) && (
                <div className="text-red-400 text-sm bg-red-900/10 border border-red-800 p-2 rounded-md">
                  {error || donateError}
                </div>
              )}

              {successTx && (
                <div className="text-sm text-green-400 bg-green-900/10 border border-green-800 p-2 rounded-md">
                  Donation successful • TX:{" "}
                  <span className="text-orange-400 break-words">
                    {successTx}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={donating || resolving}
                  className="px-4 py-2 bg-orange-400 text-zinc-900 rounded-lg font-semibold hover:opacity-95 disabled:opacity-60"
                >
                  {donating || resolving
                    ? "Processing…"
                    : `Donate ${amountEth || ""} ${CURRENCY_SYMBOL}`}
                </button>

                <button
                  type="button"
                  onClick={() => setAmountEth(String(req.target?.amount || ""))}
                  className="px-3 py-2 bg-zinc-800/40 rounded-lg hover:bg-zinc-800/60"
                >
                  Use Target Amount
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAmountEth("");
                    setError(null);
                    setSuccessTx(null);
                  }}
                  className="px-3 py-2 bg-zinc-800/40 rounded-lg hover:bg-zinc-800/60"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-sm text-stone-400">
          Recipient wallet:{" "}
          <span className="text-stone-100 font-medium">
            {req.user?.walletId || req.ownerWalletAddress || "Not available"}
          </span>
        </div>
      </div>
    </div>
  );
}
