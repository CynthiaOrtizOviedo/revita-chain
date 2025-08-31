// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.24;

/**
 * @title RecoveryModule (MVP)
 * @notice Módulo minimalista de recuperación con hasta 2 guardianes, umbral (1 ó 2),
 *         y timelock. No custodia fondos. Emite eventos para toda acción sensible.
 *         Pensado para integrarse con cuentas/UX externas o como "módulo" acoplable.
 */
library Errors {
    string constant E_ZERO_ADDR = "ZERO_ADDRESS";
    string constant E_INVALID_THRESHOLD = "INVALID_THRESHOLD";
    string constant E_NOT_OWNER = "NOT_OWNER";
    string constant E_NOT_GUARDIAN = "NOT_GUARDIAN";
    string constant E_ALREADY_PENDING = "ALREADY_PENDING";
    string constant E_NO_PENDING = "NO_PENDING";
    string constant E_NOT_APPROVED = "NOT_APPROVED";
    string constant E_TIMELOCK = "TIMELOCK_NOT_PASSED";
}

contract RecoveryModule {
    address public owner;
    address[2] public guardians;
    uint8 public threshold; // 1 o 2
    uint256 public timelockSeconds;

    struct RecoveryRequest {
        address proposedOwner;
        uint8 approvals;
        uint256 startTime;
        string biometricCID; // hash/CID, no datos sensibles en claro
        mapping(address => bool) approvedBy;
        bool exists;
    }

    // requestId => request
    mapping(bytes32 => RecoveryRequest) private _requests;

    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event GuardianSet(uint8 indexed slot, address indexed guardian);
    event ThresholdSet(uint8 indexed newThreshold);
    event TimelockSet(uint256 indexed newTimelock);
    event RecoveryStarted(bytes32 indexed requestId, address indexed proposedOwner, string biometricCID);
    event RecoveryApproved(bytes32 indexed requestId, address indexed guardian, uint8 approvals);
    event RecoveryExecuted(bytes32 indexed requestId, address indexed newOwner);
    event RecoveryCancelled(bytes32 indexed requestId, address indexed by);

    modifier onlyOwner() {
        require(msg.sender == owner, Errors.E_NOT_OWNER);
        _;
    }

    modifier onlyGuardian() {
        require(_isGuardian(msg.sender), Errors.E_NOT_GUARDIAN);
        _;
    }

    constructor(
        address _owner,
        address _g1,
        address _g2,
        uint8 _threshold,
        uint256 _timelockSeconds
    ) {
        require(_owner != address(0), Errors.E_ZERO_ADDR);
        owner = _owner;
        guardians[0] = _g1;
        guardians[1] = _g2;
        require(_threshold == 1 || _threshold == 2, Errors.E_INVALID_THRESHOLD);
        threshold = _threshold;
        timelockSeconds = _timelockSeconds;
        emit GuardianSet(0, _g1);
        emit GuardianSet(1, _g2);
        emit ThresholdSet(_threshold);
        emit TimelockSet(_timelockSeconds);
    }

    function _isGuardian(address a) internal view returns (bool) {
        return (a != address(0) && (a == guardians[0] || a == guardians[1]));
    }

    function setGuardian(uint8 slot, address g) external onlyOwner {
        require(slot < 2, "SLOT_OUT_OF_RANGE");
        guardians[slot] = g;
        emit GuardianSet(slot, g);
    }

    function setThreshold(uint8 t) external onlyOwner {
        require(t == 1 || t == 2, Errors.E_INVALID_THRESHOLD);
        threshold = t;
        emit ThresholdSet(t);
    }

    function setTimelock(uint256 t) external onlyOwner {
        timelockSeconds = t;
        emit TimelockSet(t);
    }

    function _id(address proposedOwner, string memory cid) private view returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), proposedOwner, cid));
    }

    function startRecovery(address proposedOwner, string calldata biometricCID) external onlyGuardian returns (bytes32) {
        require(proposedOwner != address(0), Errors.E_ZERO_ADDR);
        bytes32 requestId = _id(proposedOwner, biometricCID);
        RecoveryRequest storage r = _requests[requestId];
        require(!r.exists, Errors.E_ALREADY_PENDING);
        r.proposedOwner = proposedOwner;
        r.startTime = block.timestamp;
        r.biometricCID = biometricCID;
        r.exists = true;
        emit RecoveryStarted(requestId, proposedOwner, biometricCID);
        _approveInternal(r, msg.sender, requestId);
        return requestId;
    }

    function approveRecovery(bytes32 requestId) external onlyGuardian {
        RecoveryRequest storage r = _requests[requestId];
        require(r.exists, Errors.E_NO_PENDING);
        _approveInternal(r, msg.sender, requestId);
    }

    function _approveInternal(RecoveryRequest storage r, address g, bytes32 requestId) private {
        if (!r.approvedBy[g]) {
            r.approvedBy[g] = true;
            unchecked { r.approvals += 1; }
            emit RecoveryApproved(requestId, g, r.approvals);
        }
    }

    function executeRecovery(bytes32 requestId) external {
        RecoveryRequest storage r = _requests[requestId];
        require(r.exists, Errors.E_NO_PENDING);
        require(r.approvals >= threshold, Errors.E_NOT_APPROVED);
        require(block.timestamp >= r.startTime + timelockSeconds, Errors.E_TIMELOCK);

        address old = owner;
        owner = r.proposedOwner; // CEI: estado antes de eventos/llamadas
        delete _requests[requestId]; // cleanup

        emit OwnerChanged(old, owner);
        emit RecoveryExecuted(requestId, owner);
    }

    function cancelRecovery(bytes32 requestId) external onlyOwner {
        RecoveryRequest storage r = _requests[requestId];
        require(r.exists, Errors.E_NO_PENDING);
        delete _requests[requestId];
        emit RecoveryCancelled(requestId, msg.sender);
    }
}
