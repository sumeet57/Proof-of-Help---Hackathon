import React from "react";
import useWallet from "../hooks/useWallet";
import { ellipsifyAddress } from "../utils/formatters";

export default function WalletButton({ small = false }) {
  const {
    connected,
    address,
    balance,
    chain,
    loading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWallet();

  const onConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      alert(err?.message || "Failed to connect wallet");
    }
  };

  const onDisconnect = async () => {
    await disconnectWallet();
  };

  if (loading)
    return (
      <button
        className={`px-3 py-1.5 rounded-md bg-zinc-800 text-stone-100 ${
          small ? "text-xs" : "text-sm"
        }`}
      >
        Connecting…
      </button>
    );

  if (!connected) {
    return (
      <button
        onClick={onConnect}
        className={`px-3 py-2 rounded-md bg-orange-400 text-zinc-900 font-semibold ${
          small ? "text-xs" : "text-sm"
        }`}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-stone-300 text-right">
        <div className="font-medium text-stone-100">
          {ellipsifyAddress(address)}
        </div>
        <div className="text-[11px]">
          {Number(balance).toFixed(4)} {chain?.nativeCurrency?.symbol || "ETH"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigator.clipboard?.writeText(address)}
          className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-stone-200 text-xs"
          title="Copy address"
        >
          Copy
        </button>

        <button
          onClick={onDisconnect}
          className="px-2 py-1 rounded-md bg-zinc-700 text-stone-100 text-xs hover:bg-zinc-700/90"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
