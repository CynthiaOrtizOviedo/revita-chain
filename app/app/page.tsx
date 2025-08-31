
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { BiometricSetup } from '../components/BiometricSetup';
import { GuardianList } from '../components/GuardianList';

export default function HomePage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a Revita Chain</h1>
      <ConnectButton />
      {isConnected && (
        <p className="mt-4 text-lg">Conectado con la dirección: {address}</p>
      )}
      
      {isConnected && (
        <div className="mt-8 w-full max-w-md">
          <BiometricSetup />
          <GuardianList />
        </div>
      )}
    </div>
  );
}


