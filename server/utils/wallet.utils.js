export function normalizeWalletAddress(walletId) {
  if (!walletId) return null;
  const a = String(walletId).trim();
  if (!a) return null;
  return a.toLowerCase();
}
