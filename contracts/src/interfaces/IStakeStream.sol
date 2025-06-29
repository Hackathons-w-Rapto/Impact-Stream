// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StakeStream Interface
 * @notice Defines the core functionality visible to users in the dashboard
 * @dev This is what the frontend interacts with for project/stake operations
 */
interface IStakeStream {
    // Project status visible in UI
    enum ProjectStatus {
        ACTIVE,
        COMPLETED,
        CANCELED
    }

    // Updated project structure shown in dashboard
    struct Project {
        string id; // Unique project ID
        string title; // Displayed in project card
        string description; // Project details
        uint256 fundingGoal; // Funding target (USDC)
        uint256 currentStake; // Current funding amount
        uint256 deadline; // Funding end timestamp
        address owner; // Project creator
        ProjectStatus status; // Current status
        bool listed; // New: indicates if project is shown in lists
        uint256 createdAt; // Creation timestamp
    }

  
    event ProjectCreated(string indexed projectId, address owner);
    event ProjectUpdated(string indexed projectId, uint256 newDeadline, uint256 newGoal);
    event Staked(string indexed projectId, address user, uint256 amount);
    event RewardsDistributed(string indexed projectId, address user, uint256 amount);
    event ProjectCompleted(string indexed projectId);


    event ProjectCanceled(string indexed projectId);
    event ProjectListed(string indexed projectId);
    event ProjectHidden(string indexed projectId);


    function createProject(
        string calldata id,
        string calldata title,
        string calldata description,
        uint256 fundingGoal,
        uint256 deadline
    ) external;

    function stake(string calldata projectId, uint256 amount) external;

    function claimRewards(string calldata projectId) external;

    function getProject(string calldata projectId) external view returns (Project memory);

    function getUserStake(string calldata projectId, address user) external view returns (uint256);

   
    function cancelProject(string calldata projectId) external;

    function hideProject(string calldata projectId) external;

    function getAllProjects() external view returns (Project[] memory);

    function adminUpdateProject(string calldata projectId, uint256 newDeadline, uint256 newGoal) external;
}
