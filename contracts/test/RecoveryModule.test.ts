import { expect } from "chai";
import { ethers } from "hardhat";
import { RecoveryModule } from "../typechain-types"; // Asegúrate de que Hardhat Typechain esté configurado

describe("RecoveryModule", function () {
  let recoveryModule: RecoveryModule;
  let owner: any; // Signer
  let safeAddress: string;
  let guardian1: any; // Signer
  let guardian2: any; // Signer

  // Mock values for constructor arguments
  const MOCK_SUBSCRIPTION_ID = 123;
  const MOCK_FUNCTIONS_ROUTER = "0x0000000000000000000000000000000000000001"; // Dummy address
  const MOCK_DON_ID = "0x0000000000000000000000000000000000000000000000000000000000000002"; // Dummy bytes32

  beforeEach(async function () {
    [owner, guardian1, guardian2] = await ethers.getSigners();
    safeAddress = owner.address; // Para simplificar, el owner es el Safe por ahora

    const RecoveryModuleFactory = await ethers.getContractFactory("RecoveryModule");
    recoveryModule = await RecoveryModuleFactory.deploy(
      safeAddress,
      MOCK_SUBSCRIPTION_ID,
      MOCK_FUNCTIONS_ROUTER,
      MOCK_DON_ID
    );
    await recoveryModule.waitForDeployment();

    // Simular que el owner es el Safe y que el módulo está habilitado
    // En un escenario real, el Safe llamaría a estas funciones
    await recoveryModule.connect(owner).setBiometricHash(ethers.keccak256(ethers.toUtf8Bytes("test_biometric_hash")));
    // Add guardians with dummy Farcaster handles
    await recoveryModule.connect(owner).addGuardian(guardian1.address, "guardian1_farcaster");
    await recoveryModule.connect(owner).addGuardian(guardian2.address, "guardian2_farcaster");
  });

  it("Should set biometric hash correctly", async function () {
    const testHash = ethers.keccak256(ethers.toUtf8Bytes("new_biometric_hash"));
    await recoveryModule.connect(owner).setBiometricHash(testHash);
    expect(await recoveryModule.biometricHashes(owner.address)).to.equal(testHash);
  });

  it("Should add guardians correctly", async function () {
    const newGuardian = ethers.Wallet.createRandom().address;
    // Note: Max 2 guardians allowed by contract, so this test will fail if we try to add a 3rd without removing one.
    // The contract logic needs to be adjusted for the 

