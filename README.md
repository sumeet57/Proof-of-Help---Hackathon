# Proof-of-Help 🧡

**A transparent, zero-fee, Web3-powered peer-to-peer fundraising platform**

---

## 🚀 Overview

**Proof-of-Help** is a decentralized fundraising platform that enables users to request and donate help **directly wallet-to-wallet**, without intermediaries, platform fees, or trust issues.

Every donation is **verifiable on the blockchain** using transaction hashes, ensuring complete transparency and accountability.

> **Mission:**  
> Build trust in online help using blockchain-backed proof.

---

## ✨ Key Features

- 🔗 **Direct P2P Donations** (Wallet → Wallet)
- 💸 **0% Platform Commission**
- 🧾 **Blockchain-backed Proof** (TxHash stored per donation)
- 👤 **User Trust Profiles**
- 📊 **Live Progress Tracking**
- 🚀 **Boost System** for visibility
- 🔐 **Session-based Authentication**
- 🌐 **Web3 + Web2 Hybrid Architecture**

---

## 🧠 Problem Statement

Traditional fundraising platforms suffer from:

- ❌ No verification of genuine requests
- ❌ Lack of donor transparency
- ❌ High platform commissions
- ❌ Centralized control & delayed transfers

**Proof-of-Help solves this by using Web3 as a trust layer.**

---

## 🛠 Tech Stack

### Frontend

- **React (Vite)**
- **Tailwind CSS**
- **Framer Motion**
- **Context API**
- **MetaMask / ethers.js**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB**
- **Session-based Authentication**
- **JWT (Access + Refresh Tokens)**

### Blockchain

- **Ethereum (Sepolia / Hardhat for local)**
- **MetaMask**
- **ethers.js**

---

## 🏗 System Architecture

```
Client (React)
   |
   |-- REST API (Axios)
   |
Backend (Node + Express)
   |
   |-- MongoDB (Users, Requests, Donations)
   |
   |-- Blockchain (ETH transfer)
   |
   └── TxHash stored as proof
```

---

## 🔐 Authentication Flow

- User register / login
- Server generates:
  - Access Token (cookie)
  - Refresh Token (cookie)
  - Session ID (stored in DB, sent to client)
- Client stores `sessionId` in localStorage
- Every request validates:
  - Cookies + sessionId header
- Supports **multiple active sessions per user (max 5)**

---

## 💰 Monetization Model

**We never take money from donations.**

| Feature        | Price                             |
| -------------- | --------------------------------- |
| Request Credit | ₹50 / request                     |
| Boost Credit   | ₹20 / boost (active for 24 hours) |

- First **5 requests are FREE**
- Boosting increases visibility, not donation amount

---

## 🔁 User Flow

1. User registers & connects wallet
2. Creates a help request
3. Optionally boosts request
4. Donor sends ETH via MetaMask
5. TxHash is saved in database
6. Progress updates in real-time

---

## 📦 Environment Variables

### Frontend (`.env`)

```env
VITE_BACKEND_URL=https://your-backend-url.com
VITE_EXPECTED_CHAIN_ID=1
VITE_CONFIRMATIONS=3
VITE_NETWORK_NAME=Ethereum
VITE_CURRENCY_SYMBOL=ETH

// dev
VITE_CF_ENV=SANDBOX

// prod
VITE_CF_ENV=PRODUCTION
```

### Backend (`.env`)

```env
PORT=5000
CLIENT_URL=http://your-frontend-url
JWT_SECRET=jwt_secret_key
MONGO_URI=mongodb://your-db-host/db-name
SALT_ROUNDS=10
SESSION_SECRET=your_session_secret

// enable / disable payment service
PAYMENT_SERVICE_ENABLED=false

// dev
CF_ENV=DEVELOPMENT
CASHFREE_CLIENT_ID=cashfree_client_id
CASHFREE_SECRET_ID=cashfree_secret_id

// prod
CF_ENV=PRODUCTION
CASHFREE_CLIENT_ID=cashfree_client_id
CASHFREE_SECRET_ID=cashfree_secret_id
```

---

## 🧪 Local Development

### 1️⃣ Clone Repository

```bash
git clone
cd proof-of-help
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm start
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

### 4️⃣ Local Blockchain (Optional)

```bash

# Supported : Sepolia, polygon mumbai, Mainnet, hardhat (local)

npx hardhat node
```

Import one of the Hardhat accounts into MetaMask.

---

## 🔮 Future Roadmap

- 🔐 Smart-contract escrow donations
- ⭐ Reputation & trust score
- 🏢 NGO / Organization accounts
- 📱 Mobile apps (iOS / Android)
- 🌍 Multi-chain support (Polygon, Base, BSC)
- 🤖 AI fraud detection (future)

---

## 🏆 Why Proof-of-Help?

- ✅ Real-world problem
- ✅ Real blockchain utility
- ✅ Transparent by design
- ✅ No hidden fees
- ✅ Scalable architecture
- ✅ Hackathon + production ready

---

## 👨‍💻 Author

**Sumeet Umbalkar**  
Full Stack + Web3 Developer

- 🌐 Portfolio: https://sumeet.live
- 💻 GitHub: https://github.com/sumeet57

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

**Proof-of-Help**  
Trustless transparency for human generosity.
