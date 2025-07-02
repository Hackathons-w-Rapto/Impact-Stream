// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StakeStream.sol";

contract StakeStreamFactory {
    address[] public allCampaigns;

    event CampaignCreated(address campaign, address owner);

    function createCampaign(string calldata title, string calldata description, uint256 goal, uint256 deadline)
        external
    {
        StakeStream campaign = new StakeStream();
        campaign.createProject(title, description, goal, deadline);
        allCampaigns.push(address(campaign));

        emit CampaignCreated(address(campaign), msg.sender);
    }

    function getAllCampaigns() external view returns (address[] memory) {
        return allCampaigns;
    }
}
