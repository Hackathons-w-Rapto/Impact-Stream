// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IStakeStream.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakeStream is IStakeStream, Ownable {
    // Project ID => Project details
    mapping(string => Project) public projects;

    // Project ID => User address => Stake amount
    mapping(string => mapping(address => uint256)) public userStakes;

    // List of all project IDs
    string[] public allProjectIds;

    // USDC token interface
    IERC20 public immutable usdcToken;

    // Reward percentage (15% in basis points)
    uint256 public constant REWARD_PERCENT_BP = 1500;

    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @notice Create a new project (Admin dashboard)
     * @dev Called when admin creates a new project
     */
    function createProject(
        string calldata id,
        string calldata title,
        string calldata description,
        uint256 fundingGoal,
        uint256 deadline
    ) external override onlyOwner {
        require(deadline > block.timestamp, "Deadline must be in future");
        require(bytes(id).length > 0, "Project ID required");
        require(projects[id].createdAt == 0, "Project ID exists");

        projects[id] = Project({
            id: id,
            title: title,
            description: description,
            fundingGoal: fundingGoal,
            currentStake: 0,
            deadline: deadline,
            owner: msg.sender,
            status: ProjectStatus.ACTIVE,
            listed: true,
            createdAt: block.timestamp
        });

        // Add to project list and emit event
        allProjectIds.push(id);
        emit ProjectCreated(id, msg.sender);
        emit ProjectListed(id);
    }

    /**
     * @notice Stake on a project (User dashboard)
     * @dev Direct staking method
     */
    function stake(string calldata projectId, uint256 amount) external override {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.ACTIVE, "Project not active");
        require(block.timestamp < project.deadline, "Funding ended");
        require(project.listed, "Project not listed");

        // Transfer USDC from user to contract
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Update stakes
        project.currentStake += amount;
        userStakes[projectId][msg.sender] += amount;

        emit Staked(projectId, msg.sender, amount);

        // Update project status if funded
        if (project.currentStake >= project.fundingGoal) {
            project.status = ProjectStatus.COMPLETED;
            emit ProjectCompleted(projectId);
        }
    }

    /**
     * @notice Claim staking rewards (User dashboard)
     * @dev Called when user clicks "Claim Rewards"
     */
    function claimRewards(string calldata projectId) external override {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.COMPLETED, "Project not completed");

        uint256 userStake = userStakes[projectId][msg.sender];
        require(userStake > 0, "No stake to claim");

        // Calculate rewards (15% of stake)
        uint256 rewards = (userStake * REWARD_PERCENT_BP) / 10000;
        uint256 totalAmount = userStake + rewards;

        // Reset user stake
        userStakes[projectId][msg.sender] = 0;

        // Transfer funds to user
        require(usdcToken.transfer(msg.sender, totalAmount), "Transfer failed");

        emit RewardsDistributed(projectId, msg.sender, rewards);
    }

    /**
     * @notice Update project parameters (Admin dashboard)
     * @dev Called via UmiResolver for MEV protection
     */
    function adminUpdateProject(string calldata projectId, uint256 newDeadline, uint256 newGoal)
        external
        override
        onlyOwner
    {
        Project storage project = projects[projectId];
        require(project.createdAt > 0, "Project doesn't exist");

        if (newDeadline > 0) {
            require(newDeadline > block.timestamp, "Invalid deadline");
            project.deadline = newDeadline;
        }

        if (newGoal > 0) {
            require(newGoal > project.currentStake, "Goal below current stake");
            project.fundingGoal = newGoal;
        }

        emit ProjectUpdated(projectId, newDeadline, newGoal);
    }

    /**
     * @notice Cancel a project (Admin dashboard)
     * @dev Stops further staking on the project
     */
    function cancelProject(string calldata projectId) external onlyOwner {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.ACTIVE, "Project not active");

        project.status = ProjectStatus.CANCELED;
        emit ProjectCanceled(projectId);
    }

    /**
     * @notice Hide a project from listings (Admin dashboard)
     * @dev Doesn't remove data, just hides from public view
     */
    function hideProject(string calldata projectId) external onlyOwner {
        require(projects[projectId].createdAt > 0, "Project doesn't exist");
        projects[projectId].listed = false;
        emit ProjectHidden(projectId);
    }

    /**
     * @notice Get all listed projects (Dashboard display)
     * @dev Used to populate project lists in UI
     */
    function getAllProjects() external view returns (Project[] memory) {
        // First count how many projects are listed
        uint256 listedCount = 0;
        for (uint256 i = 0; i < allProjectIds.length; i++) {
            if (projects[allProjectIds[i]].listed) {
                listedCount++;
            }
        }

        // Create array with proper size
        Project[] memory listedProjects = new Project[](listedCount);
        uint256 currentIndex = 0;

        // Populate the array
        for (uint256 i = 0; i < allProjectIds.length; i++) {
            string memory id = allProjectIds[i];
            if (projects[id].listed) {
                listedProjects[currentIndex] = projects[id];
                currentIndex++;
            }
        }

        return listedProjects;
    }

    /**
     * @notice Get project details (Dashboard display)
     * @dev Used to populate project cards in UI
     */
    function getProject(string calldata projectId) external view override returns (Project memory) {
        return projects[projectId];
    }

    /**
     * @notice Get user's stake in a project (Dashboard display)
     * @dev Shows in "Your Stakes" section
     */
    function getUserStake(string calldata projectId, address user) external view override returns (uint256) {
        return userStakes[projectId][user];
    }

    /**
     * @notice Calculate progress percentage (UI helper)
     * @dev Not in interface but useful for frontend
     */
    function getProjectProgress(string calldata projectId) external view returns (uint256) {
        Project memory project = projects[projectId];
        if (project.fundingGoal == 0) return 0;
        return (project.currentStake * 100) / project.fundingGoal;
    }


}
