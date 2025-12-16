import React from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiGrid,
  FiGift,
  FiUser,
  FiActivity,
  FiMenu,
} from "react-icons/fi";
import { LayoutContext } from "../context/LayoutContext";
import { UserContext } from "../context/UserContext";

const navItems = [
  { key: "home", label: "Home", Icon: FiHome },
  { key: "dashboard", label: "Dashboard", Icon: FiGrid },
  { key: "donations", label: "Donations", Icon: FiGift },

  { key: "profile", label: "Profile", Icon: FiUser },
];

const Aside = () => {
  const { sideBarSelected, setSideBarSelected } =
    React.useContext(LayoutContext);
  const { user } = React.useContext(UserContext);

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-zinc-950 text-stone-100 shadow-xl p-4 gap-6 z-40">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-xl font-semibold">ProOF-Help</h3>
          </div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map(({ key, label, Icon }) => (
              <li key={key}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ x: 6 }}
                  onClick={() => setSideBarSelected(key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors 
                    ${
                      sideBarSelected === key
                        ? "bg-gradient-to-r from-orange-400/10 text-stone-50 border-l-4 border-orange-400"
                        : "text-stone-300 hover:bg-zinc-900/40"
                    }`}
                >
                  <Icon className="text-lg" />
                  <span>{label}</span>
                </motion.button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto text-sm text-stone-400">
          <p>Signed in as</p>
          <p className="text-stone-200 font-semibold">
            {user?.fullName?.firstName || "Not Logged In"}{" "}
            {user?.fullName?.lastName || ""}
          </p>
        </div>
      </aside>

      <aside className="lg:hidden fixed left-0 right-0 bottom-0 bg-zinc-900/95 text-stone-100 z-50 border-t border-zinc-800">
        <nav className="flex items-center justify-between py-2 px-3">
          {navItems.map(({ key, label, Icon }) => (
            <motion.button
              key={key}
              onClick={() => setSideBarSelected(key)}
              whileTap={{ scale: 0.92 }}
              className={`flex-1 flex flex-col items-center gap-1 py-2 
                ${
                  sideBarSelected === key
                    ? "text-stone-50"
                    : "text-stone-300/90 hover:text-stone-50"
                }`}
            >
              <Icon className="text-2xl" />
              <span className="text-[10px]">{label}</span>

              {sideBarSelected === key && (
                <motion.span
                  layoutId="mobile-indicator"
                  className="mt-1 w-6 h-1 rounded-full bg-orange-400"
                />
              )}
            </motion.button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Aside;
