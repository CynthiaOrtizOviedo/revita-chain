import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'viem';

const baseChain = {
  ...base,
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
};

const baseSepoliaChain = {
  ...baseSepolia,
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
};

export const config = getDefaultConfig({
  appName: 'Revita Chain',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [baseChain, baseSepoliaChain],
  transports: {
    [baseChain.id]: http(),
    [baseSepoliaChain.id]: http(),
  },
  ssr: true,
});

export const CONTRACT_ADDRESSES = {
  recoveryModule: '0xYourRecoveryModuleAddressHere', 
  safeProxyFactory: '0xYourSafeProxyFactoryAddressHere', 
} as const;

export const RECOVERY_MODULE_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [ { "internalType": "bytes32", "name": "_newHash", "type": "bytes32" } ], "name": "setBiometricHash", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "bytes32", "name": "_hashToVerify", "type": "bytes32" } ], "name": "verifyBiometricHash", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_guardian", "type": "address" }, { "internalType": "string", "name": "_farcasterHandle", "type": "string" } ], "name": "addGuardian", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_guardian", "type": "address" } ], "name": "removeGuardian", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_user", "type": "address" } ], "name": "getGuardians", "outputs": [ { "internalType": "address[]", "name": "", "type": "address[]" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_newOwner", "type": "address" } ], "name": "initiateRecovery", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "address", "name": "_newOwner", "type": "address" } ], "name": "executeRecovery", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "userCheckIn", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_user", "type": "address" }, { "internalType": "string", "name": "_message", "type": "string" } ], "name": "requestNotification", "outputs": [ { "internalType": "bytes32", "name": "requestId", "type": "bytes32" } ], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "_user", "type": "address" } ], "name": "collectFee", "outputs": [], "stateMutability": "payable", "type": "function" }
];

export const SAFE_ABI = [
  { "inputs": [ { "internalType": "address", "name": "_module", "type": "address" } ], "name": "enableModule", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
];


