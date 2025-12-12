// src/pages/Donation.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import { DonationContext } from "../context/DonationContext";
import { WalletContext } from "../context/WalletContext";
import Loading from "../components/Loading";
import { CURRENCY_SYMBOL } from "../utils/web3.utils.js";
import { LayoutContext } from "../context/LayoutContext.jsx";
import { toast } from "react-toastify";
import { fetchEthToInrRate } from "../utils/ethToInr";

export default function Donation() {
  const { requestId } = useParams();
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
  const { setSideBarSelected } = useContext(LayoutContext);

  const selectedRequestRef = useRef(selectedRequest);
  const navigate = useNavigate();

  const [amountEth, setAmountEth] = useState("");
  const [amountINR, setAmountINR] = useState("");
  const [ethRate, setEthRate] = useState(200000); // fallback
  const [error, setError] = useState(null);
  const [successTx, setSuccessTx] = useState(null);
  const [resolving, setResolving] = useState(false);

  // Sync ref
  useEffect(() => {
    selectedRequestRef.current = selectedRequest;
  }, [selectedRequest]);

  // Fetch request
  useEffect(() => {
    if (requestId) fetchRequest(requestId);
    // eslint-disable-next-line
  }, [requestId]);

  // Fetch ETH rate
  useEffect(() => {
    async function loadRate() {
      const r = await fetchEthToInrRate();
      setEthRate(r);
    }
    loadRate();
  }, []);

  // Prefill amount using target
  useEffect(() => {
    if (!selectedRequest) return;
    const suggested = Number(selectedRequest?.target?.amount || 0);
    if (suggested > 0) {
      setAmountEth(String(suggested));
      setAmountINR(String(Math.round(suggested * ethRate)));
    }
  }, [selectedRequest, ethRate]);

  // When user types ETH -> update INR
  function handleEthChange(v) {
    setAmountEth(v);
    if (!v || isNaN(v)) return setAmountINR("");
    setAmountINR(String(Math.round(Number(v) * ethRate)));
  }

  // When user types INR -> update ETH
  function handleInrChange(v) {
    setAmountINR(v);
    if (!v || isNaN(v)) return setAmountEth("");
    setAmountEth(String((Number(v) / ethRate).toFixed(6)));
  }

  // Wait for selectedRequest
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
      await new Promise((r) => setTimeout(r, 120));
    }
    return selectedRequestRef.current;
  }

  // Resolve recipient
  async function resolveRecipient(request) {
    if (!request) return { toUserId: null, toWallet: null };
    const user = request.user;

    return {
      toUserId: user?._id || null,
      toWallet: user?.walletId || null,
    };
  }

  // DONATE HANDLER
  async function handleDonate(e) {
    e.preventDefault();
    setError(null);
    setSuccessTx(null);

    if (!amountEth || Number(amountEth) <= 0) {
      setError("Enter a valid donation amount.");
      return;
    }

    try {
      await validateBeforeDonation(requestId);
    } catch (err) {
      return setError(err.message || "Donation validation failed");
    }

    let localReq = selectedRequestRef.current || selectedRequest;

    if (!localReq) {
      setResolving(true);
      await fetchRequest(requestId);
      localReq = await waitForSelectedRequest();
      setResolving(false);
    }

    const { toUserId, toWallet } = await resolveRecipient(localReq);

    if (!toWallet)
      return setError("Recipient wallet is missing. Cannot continue.");

    if (!connected) await connectWallet();

    try {
      const result = await donate({
        requestId,
        toUserId,
        toWallet,
        amountEth,
        currencySymbol: localReq?.target?.currencySymbol || CURRENCY_SYMBOL,
        network: localReq?.target?.network || "sepolia",
      });

      setSuccessTx(result.txHash);
      await fetchRequest(requestId);
      setSideBarSelected("donations");
      toast.success("Donation successful");
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  }

  if (reqLoading && !selectedRequest) {
    return <Loading fullScreen={true} />;
  }

  if (!selectedRequest) {
    return (
      <div className="p-6 text-stone-200 bg-zinc-900 rounded-xl">
        Request not found.
      </div>
    );
  }

  const req = selectedRequest;

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Request Info */}
        <div className="bg-zinc-800/30 border border-zinc-700 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold">{req.title}</h2>
          <p className="text-sm text-stone-400 mt-1">{req.description}</p>

          {/* Amount Section */}
          <div className="mt-6 space-y-4">
            {/* ETH INPUT */}
            <div>
              <label className="text-sm mb-2 block">Amount (ETH)</label>
              <input
                value={amountEth}
                onChange={(e) => handleEthChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg"
                placeholder="e.g. 0.05"
              />
            </div>

            {/* INR INPUT */}
            <div>
              <label className="text-sm mb-2 block">Amount (INR)</label>
              <input
                value={amountINR}
                onChange={(e) => handleInrChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg"
                placeholder="e.g. 1500"
              />
            </div>

            {(error || donateError) && (
              <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded-md border border-red-800">
                {error || donateError}
              </div>
            )}

            <button
              onClick={handleDonate}
              disabled={donating || resolving}
              className="w-full py-3 bg-orange-400 text-zinc-900 font-semibold rounded-lg mt-2 hover:opacity-90"
            >
              {donating ? "Processing..." : `Donate ${amountEth} ETH`}
            </button>
          </div>
        </div>

        {/* Recipient Wallet */}
        <p className="text-sm text-stone-400">
          Recipient Wallet:{" "}
          <span className="text-stone-200">{req.user?.walletId || "N/A"}</span>
        </p>
      </div>
    </div>
  );
}
