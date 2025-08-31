
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { RECOVERY_MODULE_ABI, CONTRACT_ADDRESSES } from '../app/config/wagmi';
import { registerBiometricCredential, verifyBiometricCredential } from '../lib/webauthn';

export function BiometricSetup() {
  const [biometricHash, setBiometricHash] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  const { data: hash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const handleRegisterBiometric = async () => {
    setStatus('Registrando credencial biométrica...');
    try {
      const rawIdHex = await registerBiometricCredential();
      if (rawIdHex) {
        // En un escenario real, aquí harías un hash criptográfico de rawIdHex
        // Para este ejemplo, usamos el rawIdHex directamente como el hash conceptual
        setBiometricHash(rawIdHex);
        setStatus('Credencial biométrica registrada. Enviando hash al contrato...');
        writeContract({
          address: CONTRACT_ADDRESSES.recoveryModule,
          abi: RECOVERY_MODULE_ABI,
          functionName: 'setBiometricHash',
          args: [rawIdHex as `0x${string}`],
        });
      } else {
        setStatus('Fallo al registrar credencial biométrica.');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.error(error);
    }
  };

  const handleVerifyBiometric = async () => {
    setStatus('Verificando credencial biométrica...');
    try {
      const isValid = await verifyBiometricCredential();
      if (isValid) {
        setStatus('Verificación biométrica exitosa!');
        // Aquí podrías llamar a una función del contrato para registrar el acceso
      } else {
        setStatus('Verificación biométrica fallida.');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-800 mb-4">
      <h2 className="text-2xl font-semibold mb-4">Configurar y Verificar Biometría</h2>
      <div className="flex space-x-4">
        <button
          onClick={handleRegisterBiometric}
          disabled={isConfirming}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {isConfirming ? 'Confirmando...' : 'Registrar Biometría'}
        </button>
        <button
          onClick={handleVerifyBiometric}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Verificar Biometría
        </button>
      </div>
      {status && <p className="mt-2 text-sm text-gray-300">{status}</p>}
      {isConfirmed && <p className="mt-2 text-green-500">Hash biométrico guardado con éxito!</p>}
      {hash && <p className="mt-2 text-sm text-gray-400">Hash de Transacción: {hash}</p>}
    </div>
  );
}


