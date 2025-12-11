// src/pages/Create.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RequestContext } from "../../context/RequestContext";
import { WalletContext } from "../../context/WalletContext";
import Loading from "../../components/Loading";

const CATEGORY_OPTIONS = ["education", "medical", "disaster", "food", "other"];

export default function Create() {
  const navigate = useNavigate();
  const { addRequest } = useContext(RequestContext) || {};
  const { connected, connectWallet, address } = useContext(WalletContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [amount, setAmount] = useState(""); // in ETH (or token units)
  const [currencySymbol, setCurrencySymbol] = useState("ETH");
  const [network, setNetwork] = useState("sepolia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function ensureWalletConnected() {
    if (connected) return true;
    try {
      await connectWallet();
      return true;
    } catch (err) {
      setError(err?.message || "Wallet connection failed");
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    const ok = await ensureWalletConnected();
    if (!ok) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      target: {
        amount: amount ? Number(amount) : 0,
        currencySymbol,
        network,
      },
      // optionally include owner wallet/address if your backend expects it
      ownerWalletAddress: address || null,
    };

    if (typeof addRequest !== "function") {
      setError("Request API not available");
      return;
    }

    try {
      setLoading(true);
      await addRequest(payload);
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create request. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-zinc-800/30 border border-zinc-700 rounded-2xl p-6 shadow-sm">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold">Create Request</h2>
            <p className="text-sm text-stone-400 mt-1">
              Fill details and publish your request. You must connect a wallet
              to create (used as recipient wallet).
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-200 mb-2">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                placeholder="Short, clear title"
                maxLength={150}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-200 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[140px] bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40 resize-vertical"
                placeholder="Describe the help required, context, and how funds will be used"
                maxLength={5000}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Target Amount ({currencySymbol})
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                  placeholder="0 (optional)"
                  inputMode="decimal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-200 mb-2">
                  Network
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                >
                  <option value="sepolia">Sepolia</option>
                  <option value="goerli">Goerli</option>
                  <option value="polygon-mumbai">Polygon Mumbai</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/10 border border-red-800 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-400 text-zinc-900 font-semibold hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="text-sm">Creating…</span>
                  ) : (
                    "Create Request"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setAmount("");
                    setCategory("other");
                    setError(null);
                  }}
                  className="px-3 py-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60 text-stone-200"
                >
                  Reset
                </button>
              </div>

              <div className="text-xs text-stone-400">
                You will be able to receive donations at your connected wallet.
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading && <Loading fullScreen={false} />}
    </div>
  );
}
