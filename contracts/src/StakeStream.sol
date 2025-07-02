// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

error NotOwner();
error AlreadyInitialized();
error InvalidDeadline();
error NotActive();
error DeadlinePassed();
error ZeroETH();
error CampaignFunded();
error RefundNotAvailable();
error NothingToWithdraw();

contract StakeStream {
    enum Status {
        INACTIVE,
        ACTIVE,
        COMPLETED,
        FAILED
    }

    struct Project {
        string title;
        string description;
        uint256 fundingGoal;
        uint256 deadline;
        address owner;
        Status status;
    }

    Project public project;
    bool public isInitialized;

    mapping(address => uint256) public userStakes;
    uint256 public totalStaked;

    receive() external payable {}

    modifier onlyOwner() {
        if (msg.sender != project.owner) revert NotOwner();
        _;
    }

    function createProject(string calldata _title, string calldata _description, uint256 _goal, uint256 _deadline)
        external
    {
        if (isInitialized) revert AlreadyInitialized();
        if (_deadline <= block.timestamp) revert InvalidDeadline();

        project = Project({
            title: _title,
            description: _description,
            fundingGoal: _goal,
            deadline: _deadline,
            owner: msg.sender,
            status: Status.ACTIVE
        });

        isInitialized = true;
    }

    function stake() external payable {
        if (project.status != Status.ACTIVE) revert NotActive();
        if (block.timestamp > project.deadline) revert DeadlinePassed();
        if (msg.value == 0) revert ZeroETH();

        userStakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        if (totalStaked >= project.fundingGoal) {
            project.status = Status.COMPLETED;
        }
    }

    function withdrawFunds() external onlyOwner {
        if (project.status != Status.COMPLETED) revert CampaignFunded();
        uint256 balance = address(this).balance;
        if (balance == 0) revert NothingToWithdraw();

        payable(project.owner).transfer(balance);
    }

    function refund() external {
        if (block.timestamp < project.deadline) revert RefundNotAvailable();
        if (project.status == Status.COMPLETED) revert CampaignFunded();
        if (userStakes[msg.sender] == 0) revert NothingToWithdraw();

        uint256 amount = userStakes[msg.sender];
        userStakes[msg.sender] = 0;

        payable(msg.sender).transfer(amount);
        project.status = Status.FAILED;
    }

    function getUserStake(address user) external view returns (uint256) {
        return userStakes[user];
    }

    function getProject() external view returns (Project memory, uint256, uint256) {
        return (project, totalStaked, address(this).balance);
    }
}
