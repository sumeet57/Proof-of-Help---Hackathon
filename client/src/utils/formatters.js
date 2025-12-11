// src/utils/formatters.js
export function ellipsifyAddress(addr = "", start = 6, end = 4) {
  if (!addr) return "";
  const a = String(addr);
  if (a.length <= start + end) return a;
  return `${a.slice(0, start)}...${a.slice(-end)}`;
}
