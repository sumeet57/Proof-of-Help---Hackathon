// src/pages/Donation.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import { DonationContext } from "../context/DonationContext";
import { WalletContext } from "../context/WalletContext";
import Loading from "../components/Loading";
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

  // --- START OF CHANGE: Consuming Wallet Context Details ---
  const { connected, connectWallet, address, chain } =
    useContext(WalletContext);
  // --- END OF CHANGE ---

  const { setSideBarSelected } = useContext(LayoutContext);

  const selectedRequestRef = useRef(selectedRequest);
  const navigate = useNavigate();

  const [amountEth, setAmountEth] = useState("");
  const [amountINR, setAmountINR] = useState("");
  const [ethRate, setEthRate] = useState(200000);
  const [error, setError] = useState(null);
  const [successTx, setSuccessTx] = useState(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    selectedRequestRef.current = selectedRequest;
  }, [selectedRequest]);

  useEffect(() => {
    if (requestId) fetchRequest(requestId);
  }, [requestId]);

  useEffect(() => {
    async function loadRate() {
      const r = await fetchEthToInrRate();
      setEthRate(r);
    }
    loadRate();
  }, []);

  useEffect(() => {
    if (!selectedRequest) return;
    const suggested = Number(selectedRequest?.target?.amount || 0);
    if (suggested > 0) {
      setAmountEth(String(suggested));
      setAmountINR(String(Math.round(suggested * ethRate)));
    }
  }, [selectedRequest, ethRate]);

  function handleEthChange(v) {
    setAmountEth(v);
    if (!v || isNaN(v)) return setAmountINR("");
    setAmountINR(String(Math.round(Number(v) * ethRate)));
  }

  function handleInrChange(v) {
    setAmountINR(v);
    if (!v || isNaN(v)) return setAmountEth("");
    setAmountEth(String((Number(v) / ethRate).toFixed(6)));
  }

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

  async function resolveRecipient(request) {
    if (!request) return { toUserId: null, toWallet: null };
    const user = request.user;

    return {
      toUserId: user?._id || null,
      toWallet: user?.walletId || null,
    };
  }

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
        currencySymbol: localReq?.target?.currencySymbol,
        networkName: localReq?.target?.networkName,
        expectedChainId: localReq?.target?.expectedChainId,
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

  // Helper for truncated address
  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Not connected";

  // Helper to display chain info
  const chainName = chain?.name || "Unknown Network";
  const chainId = chain?.chainId || "N/A";

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
              disabled={donating || resolving || !connected}
              className="w-full py-3 bg-orange-400 text-zinc-900 font-semibold rounded-lg mt-2 hover:opacity-90 disabled:opacity-50"
            >
              {donating
                ? "Processing..."
                : !connected
                ? "Connect Wallet to Donate"
                : `Donate ${amountEth} ${req.target?.currencySymbol || "ETH"}`}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-stone-200">
            Transaction Details
          </h3>

          {/* Donor Wallet Status */}
          <div className="bg-zinc-800/30 border border-zinc-700 p-4 rounded-lg text-sm">
            <h4 className="font-medium text-stone-300 mb-2">
              Your Wallet Status (Sender)
            </h4>
            <p
              className={`mb-1 ${
                connected ? "text-green-400" : "text-red-400"
              }`}
            >
              Wallet: {connected ? truncateAddress(address) : "Disconnected"}
            </p>
            <p className="text-stone-400">
              Current Network: {chainName} (Chain ID: {chainId})
            </p>
            <p className="text-stone-400">
              Required Network: {req.target?.networkName} (Chain ID:{" "}
              {req.target?.expectedChainId})
            </p>
          </div>

          {/* Recipient Wallet */}
          <div className="text-sm text-stone-400">
            <h4 className="font-medium text-stone-300 mb-2">
              Recipient Information
            </h4>
            <p>
              Recipient Wallet:{" "}
              <span className="text-stone-200 break-all">
                {req.user?.walletId || "N/A"}
              </span>
            </p>
            <p>
              Donation Network:{" "}
              <span className="text-stone-200">
                {req.target?.networkName || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
