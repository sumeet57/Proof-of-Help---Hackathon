import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
const NavLinkItem = ({ to, label, index, closeMenu }) => (
  <motion.div
    variants={{
      open: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      },
      closed: { opacity: 0, y: 25, transition: { duration: 0.2 } },
    }}
    className="overflow-hidden"
  >
    <NavLink
      to={to}
      onClick={closeMenu}
      className="group flex items-center gap-4 text-4xl font-bold text-zinc-400 transition-colors hover:text-white sm:text-5xl"
    >
      <span className="text-xl text-zinc-600 transition-colors group-hover:text-emerald-500">{`0${
        index + 1
      }`}</span>
      {label}
    </NavLink>
  </motion.div>
);

const Header = () => {
  const { user } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { to: "/home", label: "Home" },
    ...(user
      ? [{ to: "/logout", label: "Logout" }]
      : [{ to: "/auth", label: "Sign In" }]),
  ];

  const socialLinks = [
    { href: "https://github.com/sumeet57", label: "Github" },
    { href: "#", label: "Instagram" },
    { href: "www.linkedin.com/in/sumeet-umbalkar", label: "LinkedIn" },
    { href: "https://www.sumeet.live/", label: "Portfolio" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-90 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-105 hover:bg-orange-400 hover:cursor-pointer active:scale-95"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isMenuOpen ? "close" : "menu"}
            initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isMenuOpen ? (
              <FiX size={20} className="text-white-500" />
            ) : (
              <FiMenu size={20} className="text-zinc-100" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-80 bg-black/80 backdrop-blur-lg"
          >
            <motion.div
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
                closed: {
                  transition: { staggerChildren: 0.07, staggerDirection: -1 },
                },
              }}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex h-full flex-col"
            >
              <div className="flex-1" />
              <nav className="flex flex-col items-start px-4 justify-center gap-6">
                {navItems.map((item, index) => (
                  <NavLinkItem
                    key={item.to}
                    index={index}
                    to={item.to}
                    label={item.label}
                    closeMenu={closeMenu}
                  />
                ))}
              </nav>
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.5, duration: 0.4 },
                  },
                  closed: { opacity: 0, y: 20 },
                }}
                className="flex flex-1 items-end justify-center p-8"
              >
                <div className="flex items-center gap-4 flex-wrap justify-center">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-zinc-500 transition-colors hover:text-emerald-500"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
