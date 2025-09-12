# Revita Chain – Recovery Module MVP

**Revita Chain** is a minimal proof-of-concept for **secure asset recovery** on Base Sepolia.  
It provides a **Recovery Module** that enables users to regain control of their smart account in case of device loss, wallet change, or forgotten keys — without exposing raw biometric or sensitive data.

This MVP was built for the **Aleph Hackathon 2025** ([DoraHacks link](https://dorahacks.io/hackathon/aleph-hackathon/)), aligned with tracks like **Base**, **Filecoin/IPFS**, and **Zama FHE**.

---

## ✨ Features

- **Guardian-based recovery**  
  Up to 2 guardians can approve recovery. Configurable threshold (1-of-2 or 2-of-2).
- **Timelock**  
  Ensures recovery requests can only be executed after a predefined delay.
- **Biometric hash reference**  
  Uses IPFS/Filecoin **CIDs** to store references (hashes) of biometric proofs — never raw data.
- **Modular design**  
  Can be attached as a module to Safe smart accounts, or used standalone.
- **Gas-efficient**  
  Solidity ^0.8.24 with optimizer enabled.
- **Auditable events**  
  Every critical action emits an event for transparency and monitoring.

---

## 📂 Repository Structure

revita-chain/
├── app/ # Next.js 14 front-end (to be integrated with Wagmi)
├── contracts/ # Hardhat project with RecoveryModule.sol
│ ├── contracts/ # Solidity contracts
│ ├── scripts/ # Deployment scripts
│ ├── hardhat.config.ts
│ └── package.json
├── .github/workflows/ # GitHub Actions CI for contracts
├── .env.example # Environment variable template
├── LICENSE # Apache-2.0 license
└── README.md

yaml

---

## ⚙️ Prerequisites

- **Node.js** v18 or v20
- **npm** v9+
- **Hardhat** (installed via package.json)
- **Wallet with Base Sepolia test ETH**

---

## 🔑 Environment Setup

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
Edit .env:

ini

# Deployer private key (with 0x prefix)
PRIVATE_KEY=0x...

# Base Sepolia RPC & Basescan
RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key

# Guardians & module config
GUARDIAN1=0x0000000000000000000000000000000000000001
GUARDIAN2=0x0000000000000000000000000000000000000002
THRESHOLD=2
TIMELOCK_SECONDS=86400
BIOMETRIC_CID_SAMPLE=bafy...

# Frontend config
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
WALLETCONNECT_PROJECT_ID=your_walletconnect_id
🚀 Deployment (Base Sepolia)
Install dependencies and compile:

bash
cd contracts
npm install
npx hardhat compile
Deploy RecoveryModule:

bash
npm run deploy:base
Example output:

csharp
[OK] RecoveryModule deployed at: 0x1234...abcd
Verify on Basescan:

bash
npm run verify:base -- <ADDRESS> "<OWNER>" "<GUARDIAN1>" "<GUARDIAN2>" <THRESHOLD> <TIMELOCK_SECONDS>
🧩 Contract Overview
RecoveryModule.sol

startRecovery(address proposedOwner, string biometricCID)
Guardian starts a recovery process.

approveRecovery(bytes32 requestId)
Other guardian(s) approve recovery.

executeRecovery(bytes32 requestId)
After timelock, ownership is transferred to proposedOwner.

cancelRecovery(bytes32 requestId)
Owner can cancel pending recovery.

Events emitted for every action (auditability and UI integration).

🌐 Frontend Integration
Framework: Next.js 14

Wallet integration: Wagmi / RainbowKit

Chain: Base Sepolia (chainId 84532)

ABI: found in contracts/artifacts/contracts/RecoveryModule.sol/RecoveryModule.json

Frontend flow (to be implemented in app/):

Connect wallet (MetaMask, Coinbase Wallet, etc.).

Call startRecovery with a proposed owner address + IPFS CID.

Guardians approve with approveRecovery.

Execute recovery after timelock with executeRecovery.

🛠️ Development Scripts
bash
# Compile contracts
npx hardhat compile

# Run tests (placeholder)
npx hardhat test

# Deploy to Base Sepolia
npm run deploy:base

# Verify on Basescan
npm run verify:base


