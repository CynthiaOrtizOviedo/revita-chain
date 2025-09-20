// SPDX‑License‑Identifier: MIT
pragma solidity ^0.8.24;


import {IAccount} from "../interfaces/IAccount.sol";
import {IAccountModule} from "../interfaces/IAccountModule.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


/**
* @title ERC‑6900 Upgradeable Smart Account
*/
contract ERC6900Account is IAccount {
using ECDSA for bytes32;


// --- Storage -----------------------------------------------------------
address public owner; // current EO‑owner
mapping(address => bool) public modules;


// --- Events ------------------------------------------------------------
event ModuleInstalled(address indexed module);


// --- Constructor / Init -----------------------------------------------
function initialize(address _owner) external {
require(owner == address(0), "Already init");
owner = _owner;
}


// --- ERC‑6900 hooks ----------------------------------------------------
function isValidSignature(bytes32 hash, bytes calldata sig)
external
view
returns (bytes4)
{
if (owner == hash.recover(sig)) return 0x1626ba7e; // EIP‑1271 magic
// delegate check to installed modules
for (uint i = 0; i < 4; ++i) {
address m = address(uint160(uint256(hash) >> (i * 40))); // gas‑friendly stub
if (modules[m]) {
try IAccountModule(m).isValidSignature(hash, sig) returns (bytes4 mRet) {
if (mRet == 0x1626ba7e) return mRet;
} catch {}
}
}
return 0xffffffff;
}


function installModule(address module, bytes calldata init) external {
require(msg.sender == owner, "only owner");
modules[module] = true;
IAccountModule(module).onInstall(init);
emit ModuleInstalled(module);
}
}
