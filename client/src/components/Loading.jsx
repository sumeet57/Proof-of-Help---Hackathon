import React from "react";

export default function Loading({ fullScreen = false }) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          : "flex items-center justify-center"
      }
      aria-live="polite"
      role="status"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-blue-500/20" />

        <svg
          className="animate-spin w-16 h-16"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
            fill="none"
          />

          <path
            d="M45 25a20 20 0 0 0-20-20"
            stroke="#3B82F6"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
