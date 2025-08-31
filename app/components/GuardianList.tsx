
'use client';

import { useState } from 'react';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { RECOVERY_MODULE_ABI, CONTRACT_ADDRESSES } from '../app/config/wagmi';

export function GuardianList() {
  const { address } = useAccount();
  const [newGuardianAddress, setNewGuardianAddress] = useState('');
  const [newGuardianFarcaster, setNewGuardianFarcaster] = useState('');
  const [guardianToRemove, setGuardianToRemove] = useState('');

  const { data: guardians, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.recoveryModule,
    abi: RECOVERY_MODULE_ABI,
    functionName: 'getGuardians',
    args: [address!], // El usuario conectado
    query: { enabled: !!address }, // Solo ejecutar si hay una dirección conectada
  });

  const { data: addHash, writeContract: addGuardianContract } = useWriteContract();
  const { isLoading: isAdding, isSuccess: isAdded } = useWaitForTransactionReceipt({ hash: addHash });

  const { data: removeHash, writeContract: removeGuardianContract } = useWriteContract();
  const { isLoading: isRemoving, isSuccess: isRemoved } = useWaitForTransactionReceipt({ hash: removeHash });

  const handleAddGuardian = async () => {
    if (!newGuardianAddress || !newGuardianFarcaster) return;
    addGuardianContract({
      address: CONTRACT_ADDRESSES.recoveryModule,
      abi: RECOVERY_MODULE_ABI,
      functionName: 'addGuardian',
      args: [newGuardianAddress as `0x${string}`, newGuardianFarcaster],
    });
  };

  const handleRemoveGuardian = async () => {
    if (!guardianToRemove) return;
    removeGuardianContract({
      address: CONTRACT_ADDRESSES.recoveryModule,
      abi: RECOVERY_MODULE_ABI,
      functionName: 'removeGuardian',
      args: [guardianToRemove as `0x${string}`],
    });
  };

  // Refetch guardians after add/remove operations
  React.useEffect(() => {
    if (isAdded || isRemoved) {
      refetch();
      setNewGuardianAddress('');
      setNewGuardianFarcaster('');
      setGuardianToRemove('');
    }
  }, [isAdded, isRemoved, refetch]);

  if (isLoading) return <p className="text-gray-300">Cargando guardianes...</p>;
  if (isError) return <p className="text-red-500">Error al cargar guardianes.</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-800 mt-4">
      <h2 className="text-2xl font-semibold mb-4">Tus Guardianes Sociales</h2>
      {guardians && guardians.length > 0 ? (
        <ul>
          {guardians.map((guardian, index) => (
            <li key={index} className="mb-2 p-2 bg-gray-700 rounded-md flex justify-between items-center">
              <span className="break-all">{guardian}</span>
              <button
                onClick={() => setGuardianToRemove(guardian)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-2 rounded"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300">No tienes guardianes configurados. ¡Añade algunos!</p>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Añadir Guardián</h3>
        <input
          type="text"
          placeholder="Dirección del Guardián (0x...)"
          value={newGuardianAddress}
          onChange={(e) => setNewGuardianAddress(e.target.value)}
          className="w-full p-2 mb-2 border rounded-md bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Handle de Farcaster"
          value={newGuardianFarcaster}
          onChange={(e) => setNewGuardianFarcaster(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md bg-gray-700 text-white"
        />
        <button
          onClick={handleAddGuardian}
          disabled={isAdding || guardians.length >= 2}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {isAdding ? 'Añadiendo...' : 'Añadir Guardián'}
        </button>
        {guardians.length >= 2 && <p className="text-red-400 mt-2">Máximo 2 guardianes permitidos.</p>}
        {addHash && <p className="mt-2 text-sm text-gray-400">Hash de Transacción: {addHash}</p>}
      </div>

      {guardianToRemove && (
        <div className="mt-6 p-4 border rounded-lg shadow-md bg-gray-700">
          <h3 className="text-xl font-semibold mb-3">Confirmar Eliminación</h3>
          <p className="mb-4">¿Estás seguro de que quieres quitar al guardián: <span className="font-bold break-all">{guardianToRemove}</span>?</p>
          <button
            onClick={handleRemoveGuardian}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            {isRemoving ? 'Quitando...' : 'Confirmar Eliminación'}
          </button>
          <button
            onClick={() => setGuardianToRemove('')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
          {removeHash && <p className="mt-2 text-sm text-gray-400">Hash de Transacción: {removeHash}</p>}
        </div>
      )}
    </div>
  );
}


