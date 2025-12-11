// src/config.js
export const EXPECTED_CHAIN_ID = Number(import.meta.env.VITE_EXPECTED_CHAIN_ID);
export const CONFIRMATIONS_REQUIRED = Number(
  import.meta.env.VITE_CONFIRMATIONS
);
export const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME;
export const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL;
