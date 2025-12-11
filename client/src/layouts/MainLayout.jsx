import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiHome, FiGrid, FiGift, FiUser, FiActivity } from "react-icons/fi";
import { LayoutContext } from "../context/LayoutContext";
import { UserContext } from "../context/UserContext";
import Aside from "../components/Aside";
import { CiCirclePlus } from "react-icons/ci";
import { LuBadgePlus } from "react-icons/lu";
import Home from "../pages/Home";
import WalletButton from "../components/WalletButton";
import { FiX } from "react-icons/fi";
import { CiWallet } from "react-icons/ci";
const navItems = [
  { key: "home", label: "Home", Icon: FiHome },
  { key: "dashboard", label: "Dashboard", Icon: FiGrid },
  { key: "donations", label: "Donations", Icon: FiGift },
  { key: "profile", label: "Profile", Icon: FiUser },
  { key: "activity", label: "Activity", Icon: FiActivity },
];

const MainLayout = ({ children }) => {
  const { sideBarSelected } = React.useContext(LayoutContext);
  const { user } = React.useContext(UserContext);

  const [showWallet, setShowWallet] = useState(false);

  const requestsCount = user?.requests ?? user?.requestsCount ?? 0;
  const boastsCount = user?.boasts ?? user?.boastCount ?? 0;

  return (
    <div className="min-h-screen bg-zinc-900 text-stone-100 flex">
      <Aside />

      <main className="flex-1 min-h-screen px-2 sm:px-5 lg:pl-80 lg:pr-12 pt-2 lg:pt-6 pb-32 lg:pb-12 transition-all">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold capitalize tracking-tight">
              {sideBarSelected}
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Quick overview and actions
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60">
              <LuBadgePlus className="text-xl text-orange-400" />
              <span className="text-sm font-semibold">{requestsCount}</span>
              <span className="text-sm text-stone-300">Requests</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60">
              <LuBadgePlus className="text-xl text-orange-400" />
              <span className="text-sm font-semibold">{boastsCount}</span>
              <span className="text-sm text-stone-300">Boasts</span>
            </button>

            <WalletButton />
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60">
              <LuBadgePlus className="text-lg text-orange-400" />
              <span className="text-sm font-semibold">{requestsCount}</span>
              <span className="text-xs text-stone-300">Requests</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/60">
              <LuBadgePlus className="text-lg text-orange-400" />
              <span className="text-sm font-semibold">{boastsCount}</span>
              <span className="text-xs text-stone-300">Boasts</span>
            </button>
          </div>
        </div>

        <section>
          {sideBarSelected === "home" && <Home />}
          {sideBarSelected === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="p-4 sm:p-6 rounded-2xl bg-zinc-800/30">
                Dashboard content
              </div>
            </motion.div>
          )}
          {sideBarSelected === "donations" && (
            <div className="space-y-4">
              <div className="p-4 sm:p-6 rounded-2xl bg-zinc-800/30">
                Donations list
              </div>
              <div className="p-4 sm:p-6 rounded-2xl bg-zinc-800/30">
                Donation details
              </div>
            </div>
          )}
          {sideBarSelected === "profile" && (
            <div className="p-4 sm:p-6 rounded-2xl bg-zinc-800/30">
              Profile settings
            </div>
          )}
          {sideBarSelected === "activity" && (
            <div className="p-4 sm:p-6 rounded-2xl bg-zinc-800/30">
              Recent activity
            </div>
          )}
          {children}
        </section>

        <div className="lg:hidden fixed right-4 bottom-24 z-50">
          <button
            onClick={() => setShowWallet((s) => !s)}
            className="w-14 h-14 rounded-full bg-orange-400 shadow-xl flex items-center justify-center text-zinc-900"
          >
            {showWallet ? (
              <FiX className="text-2xl" />
            ) : (
              <CiWallet className="text-2xl" />
            )}
          </button>
        </div>

        {showWallet && (
          <div
            className="lg:hidden h-screen fixed inset-0 z-100 flex items-center justify-center"
            onClick={() => setShowWallet(false)}
          >
            <div className="absolute inset-0 bg-black/80" />

            <div
              className="w-full max-w-sm mb-6 mx-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-stone-100 text-lg font-semibold">Wallet</h3>

                <button onClick={() => setShowWallet(false)}>
                  <FiX className="text-stone-300" size={20} />
                </button>
              </div>

              <WalletButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainLayout;
