// src/context/WalletContext.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  hasEthereum,
  createProvider,
  requestAccounts,
  getAccounts,
  getNetwork,
  getBalance,
} from "../services/web3.service.js";
import { userApi } from "../interceptors/User.api.js";
import {
  EXPECTED_CHAIN_ID,
  NETWORK_NAME,
  CURRENCY_SYMBOL,
} from "../utils/web3.utils.js";

const MANUAL_DISCONNECT_KEY = "wallet:manuallyDisconnected";
const MANUAL_DISCONNECT_TTL_MS = 1000 * 60 * 60 * 24; // 24h

function setManualDisconnectFlag() {
  const payload = { ts: Date.now() };
  try {
    localStorage.setItem(MANUAL_DISCONNECT_KEY, JSON.stringify(payload));
  } catch (e) {}
}
function clearManualDisconnectFlag() {
  try {
    localStorage.removeItem(MANUAL_DISCONNECT_KEY);
  } catch (e) {}
}
function isManualDisconnectActive() {
  try {
    const raw = localStorage.getItem(MANUAL_DISCONNECT_KEY);
    if (!raw) return false;
    const obj = JSON.parse(raw);
    if (!obj?.ts) return false;
    return Date.now() - obj.ts < MANUAL_DISCONNECT_TTL_MS;
  } catch (e) {
    return false;
  }
}

export const WalletContext = createContext({
  connected: false,
  address: null,
  ensName: null,
  chain: null,
  balance: "0",
  provider: null,
  signer: null,
  loading: false,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  refreshBalance: async () => {},
  switchNetwork: async (chainIdHex) => {},
});

export const WalletContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [ensName, setEnsName] = useState(null);
  const [chain, setChain] = useState(null);
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasEthereum()) return;
    (async () => {
      try {
        if (isManualDisconnectActive()) return;
        const accts = await getAccounts();
        if (!accts || accts.length === 0) return;
        const acct = accts[0];
        const p = createProvider();
        if (!p) return;
        const s = await p.getSigner().catch(() => null);
        setProvider(p);
        setSigner(s);
        setAddress(acct);
        const net = await getNetwork(p).catch(() => null);
        setChain(net);
        const bal = await getBalance(p, acct).catch(() => "0");
        setBalance(bal);
        setConnected(true);
        await linkWalletToBackendIfAllowed(acct);
      } catch (err) {
        console.warn("Wallet auto-connect check failed", err);
      }
    })();
  }, []);

  async function linkWalletToBackendIfAllowed(addressToSave) {
    try {
      if (!userApi) return null;
      if (isManualDisconnectActive() && addressToSave) return null;
      const res = await userApi.post("/wallet", { walletId: addressToSave });
      return res.data;
    } catch (err) {
      console.warn(
        "linkWalletToBackend failed",
        err?.response?.data || err?.message
      );
      return null;
    }
  }

  async function handleAccountsChanged(newAccounts) {
    try {
      if (isManualDisconnectActive()) {
        console.log("Ignoring accountsChanged due to manual disconnect flag");
        return;
      }
      const normalized = (newAccounts || []).map((a) => a.toLowerCase());
      if (!normalized.length) {
        await disconnectWallet();
        return;
      }
      const acct = normalized[0];
      setAddress(acct);
      const p = createProvider();
      if (!p) {
        setProvider(null);
        setSigner(null);
        setChain(null);
        setBalance("0");
        return;
      }
      setProvider(p);
      const s = await p.getSigner().catch(() => null);
      setSigner(s);
      const bal = await getBalance(p, acct).catch(() => "0");
      setBalance(bal);
      const net = await getNetwork(p).catch(() => null);
      setChain(net);
      await linkWalletToBackendIfAllowed(acct);
      setConnected(true);
    } catch (err) {
      console.warn("handleAccountsChanged error", err);
    }
  }

  async function handleChainChanged(chainId) {
    try {
      const p = createProvider();
      if (!p) {
        setProvider(null);
        setChain(null);
        return;
      }
      setProvider(p);
      const net = await getNetwork(p).catch(() => null);
      setChain(net);
      if (address) {
        const bal = await getBalance(p, address).catch(() => "0");
        setBalance(bal);
      }
    } catch (e) {
      console.warn("handleChainChanged error", e);
    }
  }

  useEffect(() => {
    if (!hasEthereum()) return;
    const eth = window.ethereum;
    const accountsHandler = (accounts) => {
      handleAccountsChanged(accounts).catch(console.error);
    };
    const chainHandler = (chainId) => {
      handleChainChanged(chainId).catch(console.error);
    };
    eth.on("accountsChanged", accountsHandler);
    eth.on("chainChanged", chainHandler);
    (async () => {
      try {
        const accts = await getAccounts();
        if (accts && accts.length) {
          await handleAccountsChanged(accts);
        }
      } catch (e) {}
    })();
    return () => {
      try {
        if (eth.removeListener) {
          eth.removeListener("accountsChanged", accountsHandler);
          eth.removeListener("chainChanged", chainHandler);
        }
      } catch (e) {}
    };
  }, []);

  async function connectWallet() {
    if (!hasEthereum()) throw new Error("No Ethereum provider found");
    setLoading(true);
    try {
      const accounts = await requestAccounts();
      const acct = accounts[0];
      const p = createProvider();
      if (!p) throw new Error("Provider initialization failed");
      const s = await p.getSigner().catch(() => null);
      const net = await getNetwork(p).catch(() => null);
      const bal = await getBalance(p, acct).catch(() => "0");
      setProvider(p);
      setSigner(s);
      setAddress(acct);
      setChain(net);
      setBalance(bal);
      setConnected(true);
      clearManualDisconnectFlag();
      await linkWalletToBackendIfAllowed(acct);
      return { address: acct, chain: net };
    } catch (err) {
      console.error("connectWallet error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function disconnectWallet() {
    setManualDisconnectFlag();
    setConnected(false);
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setChain(null);
    setBalance("0");
    try {
      await userApi.post("/wallet", { walletId: null });
    } catch (e) {}
  }

  async function refreshBalance() {
    try {
      if (!address) return "0";
      const p = provider || createProvider();
      const bal = await getBalance(p, address);
      setBalance(bal);
      return bal;
    } catch (e) {
      console.warn("refreshBalance failed", e);
      return balance;
    }
  }

  async function switchNetwork(chainIdHex) {
    try {
      if (!hasEthereum()) throw new Error("No wallet provider");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
      return true;
    } catch (err) {
      throw err;
    }
  }

  const value = useMemo(
    () => ({
      connected,
      address,
      ensName,
      chain,
      balance,
      provider,
      signer,
      loading,
      connectWallet,
      disconnectWallet,
      refreshBalance,
      switchNetwork,
      EXPECTED_CHAIN_ID,
      NETWORK_NAME,
      CURRENCY_SYMBOL,
    }),
    [connected, address, ensName, chain, balance, provider, signer, loading]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
