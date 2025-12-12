// src/context/DonationContext.jsx
import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { userApi } from "../interceptors/User.api.js";
import { WalletContext } from "./WalletContext";
import {
  EXPECTED_CHAIN_ID,
  CONFIRMATIONS_REQUIRED,
  CURRENCY_SYMBOL,
  NETWORK_NAME,
} from "../utils/web3.utils.js";
import { donationApi } from "../interceptors/donation.api.js";
import { toast } from "react-toastify";

export const DonationContext = createContext({
  loading: false,
  error: null,
  donate: async () => {},
  fetchDonationsForRequest: async () => [],
});

export const DonationContextProvider = ({ children }) => {
  const { connected, connectWallet } = useContext(WalletContext);
  const [myDonations, setMyDonations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // create fresh provider & signer from injected wallet each time to avoid stale signers

  async function createFreshProviderAndSigner() {
    if (typeof window === "undefined" || !window.ethereum)
      return { provider: null, signer: null };
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner().catch(() => null);
    return { provider, signer };
  }

  async function ensureConnected() {
    if (connected) return true;
    try {
      await connectWallet();
      return true;
    } catch (err) {
      setError("Wallet connection required");
      return false;
    }
  }

  async function donate(opts = {}) {
    setError(null);
    setLoading(true);
    const debug = (...a) => console.log("[donate]", ...a);

    try {
      const ok = await ensureConnected();
      if (!ok) throw new Error("Wallet not connected");

      const {
        requestId,
        toUserId,
        toWallet,
        amountEth,
        currencySymbol = CURRENCY_SYMBOL,
        network = NETWORK_NAME,
      } = opts;

      if (!requestId || !toUserId || !toWallet)
        throw new Error("Missing donation target information");
      if (!amountEth || Number(amountEth) <= 0)
        throw new Error("Invalid donation amount");

      const { provider, signer } = await createFreshProviderAndSigner();
      if (!provider || !signer)
        throw new Error("Wallet provider/signer not available");

      // ensure network
      const net = await provider.getNetwork();
      if (Number(net.chainId) !== Number(EXPECTED_CHAIN_ID)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              { chainId: "0x" + Number(EXPECTED_CHAIN_ID).toString(16) },
            ],
          });
          await new Promise((r) => setTimeout(r, 400));
        } catch (e) {
          throw new Error(`Please switch wallet to ${NETWORK_NAME}`);
        }
      }

      const from = await signer.getAddress();
      debug("from", from);

      const valueWei = ethers.parseEther(String(amountEth));
      const balance = await provider.getBalance(from);
      debug("balance", ethers.formatEther(balance));

      // estimate cost
      let gasEstimate;
      try {
        gasEstimate = await provider.estimateGas({
          from,
          to: toWallet,
          value: valueWei,
        });
      } catch (e) {
        debug("estimateGas failed, using 21000", e);
        gasEstimate = ethers.BigInt(21000);
      }
      const feeData = await provider.getFeeData();
      const gasPrice =
        feeData?.maxFeePerGas ??
        feeData?.gasPrice ??
        ethers.parseUnits("1", "gwei");
      const totalNeeded =
        BigInt(valueWei) + BigInt(gasEstimate) * BigInt(gasPrice);
      if (BigInt(balance) < BigInt(totalNeeded)) {
        throw new Error(
          `Insufficient funds. Balance: ${ethers.formatEther(
            balance
          )} ${currencySymbol}`
        );
      }

      // send tx
      debug("sending tx to", toWallet, "amount", amountEth);
      const txResponse = await signer.sendTransaction({
        to: toWallet,
        value: valueWei,
      });
      debug("txResponse (immediate):", txResponse);
      const immediateHash =
        txResponse.hash || txResponse.transactionHash || null;

      // show pending hash in console/UI
      debug("pending tx hash:", immediateHash);

      // wait for receipt
      const receipt = await txResponse.wait(Number(CONFIRMATIONS_REQUIRED));
      debug("receipt:", receipt);

      // choose txHash: prefer receipt.transactionHash, fallback to txResponse.hash
      const txHash = receipt?.transactionHash || immediateHash;
      if (!txHash)
        throw new Error("txHash missing after transaction confirmation");

      // ensure success status
      const status = receipt.status;
      if (!(status === 1 || String(status) === "0x1")) {
        throw new Error("Transaction reverted on-chain");
      }

      // prepare payload
      const body = {
        requestId,
        toUserId,
        fromWallet: from.toLowerCase(),
        toWallet: toWallet.toLowerCase(),
        amountValue: Number(amountEth),
        currencySymbol,
        network,
        txHash,
        blockNumber: receipt.blockNumber,
        txTimestamp: new Date().toISOString(),
      };

      // debug - log payload before POST
      debug("POST /donations body:", JSON.stringify(body, null, 2));

      // post to server
      let serverRes;
      try {
        serverRes = await donationApi.post("/", body);
        debug("server response:", serverRes?.status, serverRes?.data);
      } catch (serverErr) {
        debug(
          "server POST failed:",
          serverErr?.response?.data || serverErr?.message || serverErr
        );
        // bubble up server response if available
        const msg =
          serverErr?.response?.data?.error ||
          serverErr?.message ||
          "Server post failed";
        throw new Error(msg);
      }

      setLoading(false);
      return { success: true, txHash };
    } catch (err) {
      debug("donate error final:", err);
      const msg =
        err?.response?.data?.error || err?.message || "Donation failed";
      setError(msg);
      setLoading(false);
      throw err;
    }
  }

  // fetch donations for a request
  async function fetchDonationsForRequest(requestId) {
    try {
      const res = await userApi.get(`/donations/request/${requestId}`);
      return res.data.items || [];
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("fetchDonationsForRequest failed", err);
      return [];
    }
  }
  async function fetchDonationsByUser(userId) {
    try {
      setLoading(true);
      const res = await donationApi.get("/my");
      console.log("fetchDonationsByUser", res.data.items);
      setMyDonations(res.data.items || []);
    } catch (err) {
      console.warn("fetchDonationsByUser failed", err);
      setMyDonations([]);
    } finally {
      setLoading(false);
    }
  }
  async function validateBeforeDonation(requestId) {
    try {
      setLoading(true);
      const res = await donationApi.post(`/validate/${requestId}`);
      return res.data;
    } catch (error) {
      setError(error);
      console.error("Validation before donation failed", error);
      toast.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    loading,
    error,
    donate,
    fetchDonationsForRequest,
    fetchDonationsByUser,
    myDonations,
    validateBeforeDonation,
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};
