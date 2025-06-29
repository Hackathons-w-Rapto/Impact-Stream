// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UmiResolver Interface
 * @notice Secure intent processing layer for MEV protection
 * @dev Handles the backend processing that makes staking secure
 */
interface IUmiResolver {
    // Process staking intents from UI
    function processStakeIntent(string calldata projectId, address user, uint256 amount) external;

    // Update projects via admin intents
    function adminUpdateProject(string calldata projectId, uint256 newDeadline, uint256 newGoal) external;

    // Set solver address (for deployment)
    function setSolver(address _solver) external;
}
