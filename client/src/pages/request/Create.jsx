// src/pages/Create.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RequestContext } from "../../context/RequestContext.jsx";
import { WalletContext } from "../../context/WalletContext";
import Loading from "../../components/Loading.jsx";
import { CURRENCY_SYMBOL } from "../../utils/web3.utils.js";

const CATEGORY_OPTIONS = ["education", "medical", "disaster", "food", "other"];
const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr";

export default function Create() {
  const navigate = useNavigate();
  const { addRequest } = useContext(RequestContext);
  const { connected, connectWallet } = useContext(WalletContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");

  const [fiatAmount, setFiatAmount] = useState("");
  const [ethPrice, setEthPrice] = useState(null);
  const [ethAmount, setEthAmount] = useState("0");
  const [priceLoading, setPriceLoading] = useState(false);

  const [currencySymbol] = useState(CURRENCY_SYMBOL || "ETH");
  const [network, setNetwork] = useState("sepolia");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function fetchPrice() {
      try {
        setPriceLoading(true);
        const res = await fetch(COINGECKO_URL);
        const json = await res.json();
        const price = json?.ethereum?.inr;
        if (active && price) setEthPrice(price);
      } catch (e) {
        console.warn("Failed to fetch ETH price", e);
      } finally {
        setPriceLoading(false);
      }
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 1000 * 60);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const n = Number(String(fiatAmount).replace(/,/g, "").trim());
      if (!n || !ethPrice) {
        setEthAmount("0");
        return;
      }
      const eth = n / ethPrice;
      setEthAmount(String(Number(eth.toFixed(6))));
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [fiatAmount, ethPrice]);

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

    if (!title.trim()) return setError("Title is required");
    if (!description.trim()) return setError("Description is required");

    const ok = await ensureWalletConnected();
    if (!ok) return;

    const eth = Number(ethAmount);
    if (!eth || eth < 0.01) {
      return setError(`Target must be at least 0.01 ${currencySymbol}`);
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      target: {
        amount: eth,
        currencySymbol,
        network,
      },
    };

    try {
      setLoading(true);
      await addRequest(payload);
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create request";
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
              Enter your request details and the amount you need in INR.
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
                  Target Amount (INR)
                </label>
                <input
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                  placeholder="Enter amount in INR (e.g., 5000)"
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

            <div className="bg-zinc-900/20 border border-zinc-800 rounded-md p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-stone-400">Converted target</div>
                  <div className="mt-1 text-lg font-semibold text-stone-100">
                    {priceLoading ? (
                      <span>Loading price…</span>
                    ) : (
                      <>
                        {ethAmount} {currencySymbol}
                      </>
                    )}
                  </div>
                  <div className="text-xs text-stone-400">
                    {ethPrice
                      ? `1 ${currencySymbol} ≈ ₹${Number(
                          ethPrice
                        ).toLocaleString()}`
                      : "Live price unavailable"}
                  </div>
                </div>
                <div className="text-sm text-stone-400">
                  {fiatAmount ? (
                    <>
                      Fiat: ₹
                      {Number(
                        String(fiatAmount).replace(/,/g, "") || 0
                      ).toLocaleString()}
                    </>
                  ) : (
                    "No fiat amount"
                  )}
                </div>
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
                    setFiatAmount("");
                    setCategory("other");
                    setError(null);
                    setEthAmount("0");
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

      {(loading || priceLoading) && <Loading fullScreen={false} />}
    </div>
  );
}
