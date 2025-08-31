/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@safe-global/safe-contracts/contracts/interfaces/ISafe.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/interfaces/FunctionsRequest.sol";

contract RecoveryModule is Ownable, Context, KeeperCompatibleInterface, FunctionsClient {
    ISafe public immutable safe;
    mapping(address => bytes32) public biometricHashes;
    mapping(address => address[]) public guardians;
    mapping(address => uint256) public operationTimelocks;
    mapping(address => uint256) public lastActivityTime;
    uint256 public inactivityThreshold = 30 days;
    uint64 public s_subscriptionId;
    address public s_functionsRouter;
    bytes32 public s_donId;
    mapping(string => address) public farcasterHandleToAddress;

    event BiometricHashUpdated(address indexed user, bytes32 newHash);
    event GuardianAdded(address indexed user, address indexed guardian);
    event GuardianRemoved(address indexed user, address indexed guardian);
    event RecoveryInitiated(address indexed user, address indexed newOwner);
    event RecoveryExecuted(address indexed user, address indexed newOwner);
    event InactivityDetected(address indexed user, uint256 inactiveDuration);
    event NotificationRequested(bytes32 indexed requestId, address indexed user, string message);
    event OCR2Response(bytes32 indexed requestId, bytes response);
    event OCR2Errors(bytes32 indexed requestId, bytes err);
    event GuardianAddedWithFarcaster(address indexed user, address indexed guardian, string farcasterHandle);

    constructor(address _safeAddress, uint64 _subscriptionId, address _functionsRouter, bytes32 _donId) 
        Ownable(msg.sender) FunctionsClient(_functionsRouter) {
        require(_safeAddress != address(0), "Invalid Safe address");
        safe = ISafe(_safeAddress);
        lastActivityTime[msg.sender] = block.timestamp;
        s_subscriptionId = _subscriptionId;
        s_functionsRouter = _functionsRouter;
        s_donId = _donId;
    }

    function setBiometricHash(bytes32 _newHash) public {
        biometricHashes[_msgSender()] = _newHash;
        emit BiometricHashUpdated(_msgSender(), _newHash);
    }

    function verifyBiometricHash(address _user, bytes32 _hashToVerify) public view returns (bool) {
        return biometricHashes[_user] == _hashToVerify;
    }

    function addGuardian(address _guardian, string memory _farcasterHandle) public {
        address user = _msgSender();
        require(guardians[user].length < 2, "Max 2 guardians allowed");
        require(block.timestamp >= operationTimelocks[user] + 2 hours, "Timelock active");
        operationTimelocks[user] = block.timestamp;
        farcasterHandleToAddress[_farcasterHandle] = _guardian;
        guardians[user].push(_guardian);
        emit GuardianAddedWithFarcaster(user, _guardian, _farcasterHandle);
    }

    function removeGuardian(address _guardian) public {
        address user = _msgSender();
        bool found = false;
        for (uint i = 0; i < guardians[user].length; i++) {
            if (guardians[user][i] == _guardian) {
                guardians[user][i] = guardians[user][guardians[user].length - 1];
                guardians[user].pop();
                found = true;
                break;
            }
        }
        require(found, "Guardian not found");
        require(block.timestamp >= operationTimelocks[user] + 2 hours, "Timelock active");
        operationTimelocks[user] = block.timestamp;
        emit GuardianRemoved(user, _guardian);
    }

    function getGuardians(address _user) public view returns (address[] memory) {
        return guardians[_user];
    }

    function initiateRecovery(address _newOwner) public {
        bool isGuardian = false;
        for (uint i = 0; i < guardians[safe.owner()].length; i++) {
            if (guardians[safe.owner()][i] == _msgSender()) {
                isGuardian = true;
                break;
            }
        }
        require(msg.sender is not a guardian");
        emit RecoveryInitiated(safe.owner(), _newOwner);
    }

    function executeRecovery(address _user, address _newOwner) public {
        emit RecoveryExecuted(_user, _newOwner);
    }

    function userCheckIn() public {
        lastActivityTime[_msgSender()] = block.timestamp;
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData) {
        address userToCheck = safe.owner();
        upkeepNeeded = (block.timestamp - lastActivityTime[userToCheck]) > inactivityThreshold;
        performData = abi.encode(userToCheck);
    }

    function performUpkeep(bytes calldata performData) external override {
        address user = abi.decode(performData, (address));
        require((block.timestamp - lastActivityTime[user]) > inactivityThreshold, "Not inactive yet");
        emit InactivityDetected(user, block.timestamp - lastActivityTime[user]);
    }

    function requestNotification(address _user, string memory _message) public onlyOwner returns (bytes32 requestId) {
        string[] memory args = new string[](2);
        args[0] = _user.toHexString();
        args[1] = _message;
        string memory source = "\n\nconst userAddress = args[0];\nconst message = args[1];\n\nconsole.log(`Sending notification to ${userAddress}: ${message}`);\n\nFunctions.encodeString(\"Notification sent successfully!\");\n";
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        req.setArgs(args);
        requestId = _sendRequest(req, s_subscriptionId, s_donId);
        emit NotificationRequested(requestId, _user, _message);
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            emit OCR2Errors(requestId, err);
        } else {
            emit OCR2Response(requestId, response);
        }
    }

    function collectFee(address _user) public payable {
    }
}


