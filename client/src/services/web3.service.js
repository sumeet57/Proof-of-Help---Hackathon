import { ethers } from "ethers";

const ETHERS_DEFAULT_OPTIONS = {}; // can add pollingInterval etc.

export function hasEthereum() {
  return typeof window !== "undefined" && !!window.ethereum;
}

export function createProvider() {
  if (!hasEthereum()) return null;
  try {
    return new ethers.BrowserProvider(window.ethereum);
  } catch (err) {
    console.warn("BrowserProvider failed to initialize:", err);
    return null;
  }
}

export async function requestAccounts() {
  if (!hasEthereum()) throw new Error("No Ethereum provider found");
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  return accounts.map((a) => a.toLowerCase());
}

export async function getAccounts() {
  if (!hasEthereum()) return [];
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts.map((a) => a.toLowerCase());
}

export async function getNetwork(provider) {
  if (!provider) provider = createProvider();
  if (!provider) return null;
  const network = await provider.getNetwork();
  // network.chainId (number), network.name, network.ensAddress (maybe)
  return network;
}

export async function getBalance(providerOrSigner, address) {
  try {
    if (!providerOrSigner) providerOrSigner = createProvider();
    if (!address) return 0;
    const balanceBig = await providerOrSigner.getBalance(address);
    // return as string in ETH (not wei)
    return ethers.formatEther(balanceBig);
  } catch (e) {
    console.error("getBalance error", e);
    return "0";
  }
}

export async function switchNetwork(chainIdHex) {
  // chainIdHex e.g. "0xaa36a7" for Sepolia (11155111 -> 0xaa36a7)
  if (!hasEthereum()) throw new Error("No wallet provider");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    return true;
  } catch (switchError) {
    // 4001 user rejected, 4902 chain not added
    throw switchError;
  }
}

export async function signMessage(signer, message) {
  if (!signer) throw new Error("No signer");
  return signer.signMessage(message);
}
