import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const owner = (await ethers.getSigners())[0].address;
  const g1 = process.env.GUARDIAN1 ?? ethers.ZeroAddress;
  const g2 = process.env.GUARDIAN2 ?? ethers.ZeroAddress;
  const threshold = Number(process.env.THRESHOLD ?? 1);
  const timelock = Number(process.env.TIMELOCK_SECONDS ?? 86400);
  const cid = process.env.BIOMETRIC_CID_SAMPLE ?? "";

  console.log("[*] Params:", { owner, g1, g2, threshold, timelock });

  const Factory = await ethers.getContractFactory("RecoveryModule");
  const c = await Factory.deploy(owner, g1, g2, threshold as any, timelock);
  await c.waitForDeployment();
  const addr = await c.getAddress();
  console.log("[OK] RecoveryModule deployed at:", addr);

  if (cid) {
    try {
      const id = await c.startRecovery.staticCall(owner, cid);
      console.log("[INFO] Sample requestId:", id);
    } catch {
      console.log("[INFO] Sample request skipped (staticCall failed without guardians set)");
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
