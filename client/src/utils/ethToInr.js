export async function fetchEthToInrRate() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
    );

    if (!res.ok) throw new Error("Failed to fetch conversion rate");

    const data = await res.json();
    return data.ethereum?.inr || 200000; // fallback 2 lakh
  } catch (err) {
    console.warn("ETH→INR conversion failed, using fallback", err);
    return 200000; // fallback rate
  }
}
