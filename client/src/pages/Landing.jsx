import React, { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Heart,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Wallet,
  Lock,
  Eye,
  Activity,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      desc: "No transaction or processing fees - 100% of donations go to those in need",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: Wallet,
      title: "P2P Transfers",
      desc: "Direct peer-to-peer wallet transfers for complete autonomy",
      color: "from-orange-500 to-orange-400",
    },
    {
      icon: Shield,
      title: "Transparent Records",
      desc: "All donation records stored on blockchain for complete transparency",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: Eye,
      title: "Public Profiles",
      desc: "Build trust with transparent user profiles and verified histories",
      color: "from-orange-500 to-orange-400",
    },
    {
      icon: Activity,
      title: "Activity Logs",
      desc: "Complete activity logs for accountability and trust verification",
      color: "from-orange-400 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "Boost System",
      desc: "Use boost points to amplify your requests and reach more donors",
      color: "from-orange-500 to-orange-400",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden bg-zinc-900 text-stone-100 relative">
      {/* Dynamic background with mesh gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-30"
          style={{
            transform: `translate(${mousePos.x * 0.02}px, ${
              mousePos.y * 0.02
            }px)`,
          }}
        ></div>
        <div
          className="absolute top-1/3 right-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-25"
          style={{
            transform: `translate(${-mousePos.x * 0.02}px, ${
              mousePos.y * 0.02
            }px)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-20"
          style={{
            transform: `translate(${mousePos.x * 0.01}px, ${
              -mousePos.y * 0.01
            }px)`,
          }}
        ></div>

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 seed=%222%22 /%3E%3C/filter%3E%3Crect width=%22256%22 height=%22256%22 fill=%22white%22 filter=%22url(%23noise)%22 /%3E%3C/svg%22)',
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-zinc-900/30 border-b border-stone-700/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-stone-100">
              Proof-Of-Help
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm">
            <a
              href="#features"
              className="text-stone-300 hover:text-orange-400 transition"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-stone-300 hover:text-orange-400 transition"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-stone-300 hover:text-orange-400 transition"
            >
              How it Works
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-30 pb-32 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto w-full text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-stone-700/40 backdrop-blur-xl hover:bg-white/10 transition">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-stone-200">
              Web3 Fundraising Platform
            </span>
          </div>

          {/* Main Heading - Split into 3 lines */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
              Help{" "}
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
                Others,
              </span>
              <br />
              <span className="text-stone-400 font-light text-4xl md:text-6xl">
                No Fees. No Limits.
              </span>
            </h1>

            <p className="text-lg text-stone-400 max-w-3xl mx-auto leading-relaxed pt-4">
              A decentralized fundraising platform where every donation reaches
              its destination instantly. Post your needs, boost visibility, and
              build trust through blockchain transparency.
            </p>
          </div>

          {/* CTA Buttons with glass effect */}
          <div className="flex gap-4 justify-center flex-wrap pt-6">
            <button
              onClick={() => {
                navigate("/home");
              }}
              className="group px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition transform hover:scale-105 flex items-center gap-2 backdrop-blur-xl"
            >
              Get Started
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-stone-600/50 rounded-xl font-semibold hover:bg-white/10 backdrop-blur-xl transition">
              Learn More
            </button>
          </div>

          <div className="pt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-stone-700/30 rounded-2xl p-6 hover:border-stone-600/50 transition group">
              <p className="text-4xl font-black bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                0%
              </p>
              <p className="text-xs text-stone-400 mt-3 uppercase tracking-wider">
                Transaction Fees
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-stone-700/30 rounded-2xl p-6 hover:border-stone-600/50 transition">
              <p className="text-4xl font-black text-stone-100">5</p>
              <p className="text-xs text-stone-400 mt-3 uppercase tracking-wider">
                Free Posts
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-stone-700/30 rounded-2xl p-6 hover:border-stone-600/50 transition">
              <p className="text-4xl font-black bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                ∞
              </p>
              <p className="text-xs text-stone-400 mt-3 uppercase tracking-wider">
                Scale Potential
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-12 flex justify-center gap-8 flex-wrap text-xs text-stone-400">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-stone-700/20">
              <Shield className="w-4 h-4 text-orange-400" />
              Blockchain Secure
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-stone-700/20">
              <Lock className="w-4 h-4 text-orange-400" />
              Wallet Protected
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-stone-700/20">
              <Users className="w-4 h-4 text-orange-400" />
              Peer Verified
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-stone-700/30 to-transparent"></div>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-6xl md:text-7xl font-black tracking-tight">
              Powerful Features
            </h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
              Everything you need for modern, decentralized fundraising
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-stone-700/30 rounded-2xl p-8 h-full hover:border-orange-500/50 transition group">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-stone-100">
                    {feature.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-32 px-6 border-t border-stone-700/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-black text-center mb-20 tracking-tight">
            Simple Flow
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Register",
                desc: "Create your account and connect your wallet securely",
              },
              {
                num: "02",
                title: "Post Request",
                desc: "Share your fundraising goal or donation offer",
              },
              {
                num: "03",
                title: "Boost (Optional)",
                desc: "Use boost points for 24hr featured placement",
              },
              {
                num: "04",
                title: "Connect & Help",
                desc: "P2P transfer with complete transparency",
              },
            ].map((step, i) => (
              <div key={i} className="relative group">
                {i < 3 && (
                  <div className="absolute top-8 left-full w-6 h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent hidden md:block"></div>
                )}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-stone-700/30 rounded-2xl p-8 h-full hover:border-orange-500/50 transition">
                  <p className="text-5xl font-black text-stone-700 mb-6 group-hover:text-orange-400/50 transition">
                    {step.num}
                  </p>
                  <h3 className="text-lg font-bold mb-3 text-stone-100">
                    {step.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="relative py-32 px-6 border-t border-stone-700/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-6xl md:text-7xl font-black tracking-tight">
              Simple Pricing
            </h2>
            <p className="text-stone-400 text-lg">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {[
              {
                label: "Request Point",
                price: "100",
                desc: "Post additional fundraising requests beyond free limit",
                unit: "/request",
              },
              {
                label: "Boost Point",
                price: "50",
                desc: "Featured placement for 24 hours to reach more donors",
                unit: "/point",
              },
            ].map((plan, i) => (
              <div key={i} className="group">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-stone-700/30 rounded-2xl p-10 text-center hover:border-orange-500/50 transition h-full hover:bg-white/[0.08]">
                  <h3 className="text-2xl font-bold mb-3 text-stone-100">
                    {plan.label}
                  </h3>
                  <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                    {plan.desc}
                  </p>
                  <div className="mb-8 inline-block">
                    <span className="text-5xl font-black bg-gradient-to-r from-orange-300 to-orange-600 bg-clip-text text-transparent">
                      ₹{plan.price}
                    </span>
                    <span className="text-stone-400 text-sm ml-2">
                      {plan.unit}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/service");
                    }}
                    className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition text-white"
                  >
                    Get Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-br from-white/10 to-white/5 border border-stone-700/30 rounded-2xl p-8 backdrop-blur-xl text-center">
            <p className="text-stone-200 text-sm leading-relaxed">
              <span className="font-bold text-orange-400">5 Free Posts</span>{" "}
              included •{" "}
              <span className="font-bold text-orange-400">
                Unlimited scaling
              </span>{" "}
              with points •{" "}
              <span className="font-bold text-orange-400">
                Zero transaction fees
              </span>{" "}
              •{" "}
              <span className="font-bold text-orange-400">
                100% to recipients
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 border-t border-stone-700/20">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-6xl md:text-7xl font-black tracking-tight">
            Ready to Make a<br />
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              Difference?
            </span>
          </h2>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Join thousands helping others without fees or middlemen. Pure
            peer-to-peer kindness powered by blockchain.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <button
              onClick={() => {
                navigate("/home");
              }}
              className="group px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl font-bold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition flex items-center gap-2"
            >
              Launch App
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
            <a
              href="https://github.com/sumeet57/Proof-of-Help---Hackathon.git"
              className="px-8 py-4 bg-white/5 border border-stone-600/50 rounded-xl font-semibold hover:bg-white/10 backdrop-blur-xl transition flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub Repo
            </a>
            <a
              href="https://sumeet.live"
              className="px-8 py-4 bg-white/5 border border-stone-600/50 rounded-xl font-semibold hover:bg-white/10 backdrop-blur-xl transition flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-stone-700/20 bg-zinc-900/50 backdrop-blur py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="font-bold text-stone-100">Proof-Of-Help</span>
              </div>
              <p className="text-stone-400 text-sm">
                Decentralized fundraising with zero fees.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-stone-100">Product</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-orange-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-orange-400 transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-orange-400 transition"
                  >
                    How it Works
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-stone-100">Resources</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>
                  <a
                    href="https://github.com/sumeet57/Proof-of-Help---Hackathon.git"
                    className="hover:text-orange-400 transition flex items-center gap-2"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://sumeet.live"
                    className="hover:text-orange-400 transition flex items-center gap-2"
                  >
                    Portfolio <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-stone-100">Legal</h4>
              <ul className="space-y-2 text-sm text-stone-400">
                <li>
                  <a href="#" className="hover:text-orange-400 transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-orange-400 transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-700/20 pt-8 flex justify-between items-center flex-wrap gap-4 text-sm text-stone-400">
            <p>&copy; 2025 Proof-Of-Help. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="https://github.com/sumeet57/Proof-of-Help---Hackathon.git"
                className="hover:text-orange-400 transition flex items-center gap-2"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a
                href="https://sumeet.live"
                className="hover:text-orange-400 transition flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> Portfolio
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
