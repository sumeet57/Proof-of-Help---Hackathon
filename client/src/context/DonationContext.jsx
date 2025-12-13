// src/context/DonationContext.jsx
import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import { userApi } from "../interceptors/userApi.js";
import { WalletContext } from "./WalletContext";
import { CONFIRMATIONS_REQUIRED } from "../utils/web3.utils.js";
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

    try {
      const ok = await ensureConnected();
      if (!ok) throw new Error("Wallet not connected");

      const {
        requestId,
        toUserId,
        toWallet,
        amountEth,
        currencySymbol,
        networkName,
        expectedChainId,
      } = opts;

      if (
        !requestId ||
        !toUserId ||
        !toWallet ||
        !expectedChainId ||
        !networkName ||
        !currencySymbol
      )
        throw new Error(
          "Missing donation target information, including required network details."
        );
      if (!amountEth || Number(amountEth) <= 0)
        throw new Error("Invalid donation amount");

      const { provider, signer } = await createFreshProviderAndSigner();
      if (!provider || !signer)
        throw new Error("Wallet provider/signer not available");

      const net = await provider.getNetwork();

      if (Number(net.chainId) !== Number(expectedChainId)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + Number(expectedChainId).toString(16) }],
          });
          await new Promise((r) => setTimeout(r, 400));
        } catch (e) {
          throw new Error(`Please switch wallet to ${networkName}`);
        }
      }

      const from = await signer.getAddress();
      const valueWei = ethers.parseEther(String(amountEth));
      const balance = await provider.getBalance(from);

      let gasEstimate;
      try {
        gasEstimate = await provider.estimateGas({
          from,
          to: toWallet,
          value: valueWei,
        });
      } catch (e) {
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

      const txResponse = await signer.sendTransaction({
        to: toWallet,
        value: valueWei,
      });
      const immediateHash =
        txResponse.hash || txResponse.transactionHash || null;

      const receipt = await txResponse.wait(Number(CONFIRMATIONS_REQUIRED));

      const txHash = receipt?.transactionHash || immediateHash;
      if (!txHash)
        throw new Error("txHash missing after transaction confirmation");

      const status = receipt.status;
      if (!(status === 1 || String(status) === "0x1")) {
        throw new Error("Transaction reverted on-chain");
      }

      const body = {
        requestId,
        toUserId,
        fromWallet: from.toLowerCase(),
        toWallet: toWallet.toLowerCase(),
        amountValue: Number(amountEth),
        currencySymbol,
        network: networkName,
        txHash,
        blockNumber: receipt.blockNumber,
        txTimestamp: new Date().toISOString(),
      };

      let serverRes;
      try {
        serverRes = await donationApi.post("/", body);
      } catch (serverErr) {
        const msg =
          serverErr?.response?.data?.error ||
          serverErr?.message ||
          "Server post failed";
        throw new Error(msg);
      }

      setLoading(false);
      return { success: true, txHash };
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.message || "Donation failed";
      setError(msg);
      setLoading(false);
      throw err;
    }
  }

  async function fetchDonationsForRequest(requestId) {
    try {
      const res = await userApi.get(`/donations/request/${requestId}`);
      return res.data.items || [];
    } catch (err) {
      console.warn("fetchDonationsForRequest failed", err);
      return [];
    }
  }
  async function fetchDonationsByUser(userId) {
    try {
      setLoading(true);
      const res = await donationApi.get("/my");
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
