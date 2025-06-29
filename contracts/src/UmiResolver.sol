// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IUmiResolver.sol";
import "./StakeStream.sol";

/**
 * @title UmiResolver Contract
 * @notice Secure intent processor for MEV protection
 * @dev Handles backend processing for user staking intents
 */
contract UmiResolver is IUmiResolver {
    address public solver;

    // Reference to main contract
    StakeStream public immutable stakeStream;

    // Events for tracking
    event IntentProcessed(string indexed intentType, string projectId, address user);
    event SolverUpdated(address newSolver);

    constructor(address _stakeStream) {
        stakeStream = StakeStream(_stakeStream);
        solver = msg.sender;
    }

    modifier onlySolver() {
        require(msg.sender == solver, "Only solver can call");
        _;
    }

    /**
     * @notice Process stake intent (From UI via Umi network)
     * @dev Securely processes user staking with MEV protection
     */
    function processStakeIntent(string calldata projectId, address user, uint256 amount) public override onlySolver {
        // Forward to main contract
        stakeStream.stake(projectId, amount);

        emit IntentProcessed("STAKE", projectId, user);
    }

    /**
     * @notice Update project via admin intent
     * @dev Securely processes admin actions
     */
    function adminUpdateProject(string calldata projectId, uint256 newDeadline, uint256 newGoal)
        public
        override
        onlySolver
    {
        stakeStream.adminUpdateProject(projectId, newDeadline, newGoal);
        emit IntentProcessed("UPDATE", projectId, address(0));
    }

    /**
     * @notice Set solver address (Deployment only)
     * @dev Initial setup function
     */
    function setSolver(address _solver) external override onlySolver {
        solver = _solver;
        emit SolverUpdated(_solver);
    }

    /**
     * @notice Batch process intents (Gas optimization)
     * @dev Processes multiple stakes/updates in one transaction
     */
    function batchProcess(
        string[] calldata projectIds,
        address[] calldata users,
        uint256[] calldata amounts,
        uint256[] calldata newDeadlines,
        uint256[] calldata newGoals
    ) external onlySolver {
        require(projectIds.length == users.length, "Array length mismatch");
        require(projectIds.length == amounts.length, "Array length mismatch");

        for (uint256 i = 0; i < projectIds.length; i++) {
            if (amounts[i] > 0) {
                processStakeIntent(projectIds[i], users[i], amounts[i]);
            }

            if (newDeadlines[i] > 0 || newGoals[i] > 0) {
                adminUpdateProject(projectIds[i], newDeadlines[i], newGoals[i]);
            }
        }
    }
}
