// src/pages/Landing.jsx
import React, { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Heart,
  Zap,
  Wallet,
  Shield,
  Eye,
  Activity,
  TrendingUp,
  Lock,
  Users,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Zero Fees",
      desc: "No processing fees — full amount reaches recipient.",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: Wallet,
      title: "P2P Transfers",
      desc: "Direct wallet transfers for immediate delivery.",
      color: "from-orange-500 to-orange-400",
    },
    {
      icon: Shield,
      title: "Transparent Records",
      desc: "Donation records are visible on-chain for trust.",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: Eye,
      title: "Public Profiles",
      desc: "Verified profiles to build donor confidence.",
      color: "from-orange-500 to-orange-400",
    },
    {
      icon: Activity,
      title: "Activity Logs",
      desc: "Complete logs for accountability and auditing.",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Boost System",
      desc: "Spend boost points to feature your request.",
      color: "from-orange-500 to-orange-400",
    },
  ];

  return (
    <div className="w-full bg-zinc-900 text-stone-100 relative overflow-x-hidden">
      {/* subtle dynamic orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className="absolute top-6 left-1/4 w-72 h-72 bg-gradient-to-br from-orange-500/18 to-transparent rounded-full filter blur-2xl opacity-25"
          style={{
            transform: `translate(${mousePos.x * 0.01}px, ${
              mousePos.y * 0.01
            }px)`,
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-72 h-72 bg-gradient-to-br from-orange-400/14 to-transparent rounded-full filter blur-2xl opacity-18"
          style={{
            transform: `translate(${-mousePos.x * 0.01}px, ${
              mousePos.y * 0.01
            }px)`,
          }}
        />
        <div
          className="absolute bottom-10 left-1/2 w-72 h-72 bg-gradient-to-br from-orange-500/12 to-transparent rounded-full filter blur-2xl opacity-14"
          style={{
            transform: `translate(${mousePos.x * 0.005}px, ${
              -mousePos.y * 0.005
            }px)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 seed=%222%22 /%3E%3C/filter%3E%3Crect width=%22256%22 height=%22256%22 fill=%22white%22 filter=%22url(%23noise)%22 /%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm bg-zinc-900/40 border-b border-stone-800/20">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">Proof-Of-Help</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-stone-300">
            <a href="#features" className="hover:text-orange-400 transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-orange-400 transition">
              Pricing
            </a>
            <a
              href="#how-it-works"
              className="hover:text-orange-400 transition"
            >
              How it Works
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-24 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-stone-700/30 text-sm mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-stone-200">Web3 Fundraising</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-stone-100">
              Help others - transparently, instantly.
            </h1>

            <p className="mt-3 text-stone-300 text-base md:text-lg">
              The lightweight Block-chain based fundraising & donation platform
              with 0% transaction fees. Receive instant, peer-to-peer funding
              and build donor trust with transparent, verifiable records
              ensuring visibility via web3.
            </p>

            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  window.scrollTo({ top: 700, behavior: "smooth" })
                }
                className="px-4 py-2 bg-zinc-800/40 rounded-lg border border-stone-700/30 text-stone-200"
              >
                Learn more
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                  0%
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  Transaction fees
                </div>
              </div>
              <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold text-stone-100">5</div>
                <div className="text-xs text-stone-400 mt-1">Free posts</div>
              </div>
              <div className="bg-zinc-800/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                  ∞
                </div>
                <div className="text-xs text-stone-400 mt-1">
                  Scale potential
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* FEATURES */}
        <section id="features" className="py-16 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">
                Powerful features
              </h2>
              <p className="text-stone-400 mt-2 max-w-2xl mx-auto">
                Everything you need for modern decentralized fundraising.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredFeature(i)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className="relative bg-zinc-800/30 border border-stone-700/20 rounded-xl p-4 flex gap-3 items-start hover:scale-[1.01] transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${f.color} text-white`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,140,0,0.12), rgba(255,120,0,0.06))",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-stone-100">
                        {f.title}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1 leading-snug">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-12 px-5 border-t border-stone-800/20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">How it works</h3>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  n: "01",
                  t: "Register",
                  d: "Create account and (optional) connect wallet",
                },
                {
                  n: "02",
                  t: "Post Request",
                  d: "Share your need with a clear target",
                },
                {
                  n: "03",
                  t: "Boost",
                  d: "Use boost points to get featured (optional)",
                },
                {
                  n: "04",
                  t: "Donate",
                  d: "P2P transfers with transparent records",
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-800/25 border border-stone-700/20 rounded-xl p-4 text-sm"
                >
                  <div className="text-lg font-bold text-orange-300">{s.n}</div>
                  <div className="font-semibold text-stone-100 mt-2">{s.t}</div>
                  <div className="text-xs text-stone-400 mt-1">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="py-12 px-5 border-t border-stone-800/20"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">Simple pricing</h3>
              <p className="text-stone-400 mt-2">
                Buy request or boost points as needed.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                {
                  label: "Request Point",
                  price: "100",
                  unit: "/request",
                  desc: "Post additional requests",
                },
                {
                  label: "Boost Point",
                  price: "50",
                  unit: "/point",
                  desc: "Featured placement for 24h",
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className="bg-zinc-800/30 border border-stone-700/20 rounded-xl p-5 text-center"
                >
                  <div className="text-lg font-semibold text-stone-100">
                    {plan.label}
                  </div>
                  <div className="text-sm text-stone-400 mt-2">{plan.desc}</div>
                  <div className="mt-4 text-2xl font-extrabold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                    ₹{plan.price}
                    <span className="text-sm text-stone-400 font-medium ml-2">
                      {plan.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/service")}
                    className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 font-semibold"
                  >
                    Get Now
                  </button>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto mt-8 bg-zinc-800/25 border border-stone-700/20 rounded-xl p-4 text-center text-sm text-stone-300">
              <strong className="text-orange-400">5 Free Posts</strong> included
              • Zero platform fees • 100% to recipients
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 px-5 border-t border-stone-800/20">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold">Ready to help?</h3>
            <p className="text-stone-400 mt-2">
              Launch the app and start making an impact.
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => navigate("/home")}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 font-semibold"
              >
                Launch App
              </button>
              <a
                href="https://github.com/sumeet57/Proof-of-Help---Hackathon.git"
                className="px-6 py-2 rounded-lg bg-zinc-800/30 border border-stone-700/20"
              >
                <Github className="inline-block w-4 h-4 mr-2" /> GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 px-5 border-t border-stone-800/20 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold">Proof-Of-Help</div>
              <div className="text-xs text-stone-400">
                Decentralized fundraising
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-stone-400">
            <a
              href="https://github.com/sumeet57/Proof-of-Help---Hackathon.git"
              className="hover:text-orange-400"
            >
              GitHub
            </a>
            <a href="https://sumeet.live" className="hover:text-orange-400">
              Portfolio
            </a>
            <span className="text-xs">© 2025 Proof-Of-Help</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
