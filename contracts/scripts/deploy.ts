import { ethers } from "hardhat";
import { SafeFactory } from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // 1. Desplegar el RecoveryModule
  // Los argumentos del constructor para RecoveryModule son _safeAddress, _subscriptionId, _functionsRouter, _donId
  // Para el despliegue inicial, _safeAddress puede ser un placeholder (ZeroAddress) y se actualizará después
  // o se asume que el Safe ya existe y se pasa su dirección real.
  // Para este ejemplo, usaremos un placeholder y asumiremos que la inicialización real se hará off-chain o en otro script.
  const MOCK_SUBSCRIPTION_ID = 123; // Reemplazar con un ID real de Chainlink Functions Subscription
  const MOCK_FUNCTIONS_ROUTER = "0xYourFunctionsRouterAddress"; // Reemplazar con la dirección real del router
  const MOCK_DON_ID = "0xYourDonId"; // Reemplazar con el ID real del DON

  const RecoveryModule = await ethers.getContractFactory("RecoveryModule");
  const recoveryModule = await RecoveryModule.deploy(
    ethers.ZeroAddress, // Placeholder para _safeAddress
    MOCK_SUBSCRIPTION_ID,
    MOCK_FUNCTIONS_ROUTER,
    MOCK_DON_ID
  );
  await recoveryModule.waitForDeployment();
  const recoveryModuleAddress = await recoveryModule.getAddress();
  console.log("RecoveryModule desplegado en:", recoveryModuleAddress);

  // 2. Desplegar una nueva Safe Smart Account
  // Usar direcciones pre-desplegadas de Safe para Base Sepolia
  // Consulta https://docs.safe.global/safe-core-protocol/safe-addresses para las direcciones correctas
  // Estas son direcciones de ejemplo, DEBEN SER REEMPLAZADAS por las reales de Base Sepolia
  const safeSingletonAddress = "0x3E5c63644E683549055b9Be8653de26E0B4CD36E"; // Ejemplo para Sepolia
  const safeProxyFactoryAddress = "0x4e1DCf7AD4Ee468079bcBleaa06B7a00Cc6bc.sol"; // Ejemplo para Sepolia

  const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: deployer });
  const safeFactory = await SafeFactory.create({ ethAdapter });

  const safeAccountConfig: SafeAccountConfig = {
    owners: [deployer.address], // El desplegador será el primer propietario
    threshold: 1, // Para simplificar el MVP, 1 de 1 propietario
  };

  const safeSdk = await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce: Date.now().toString(), // Usar un nonce único para cada despliegue
  });

  const safeAddress = await safeSdk.getAddress();
  console.log("Safe Smart Account desplegada en:", safeAddress);

  // 3. Habilitar el RecoveryModule en el Safe
  // En un escenario real, el Safe debería ser el propietario del RecoveryModule
  // o el RecoveryModule debería tener una función para ser inicializado por el Safe.
  // Aquí, se asume que el Safe será el que habilite el módulo.
  // Este paso es conceptual y requeriría una transacción real desde el Safe.
  console.log("\n¡Despliegue de Smart Contracts completado!");
  console.log("Dirección del RecoveryModule:", recoveryModuleAddress);
  console.log("Dirección del Safe Smart Account:", safeAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


