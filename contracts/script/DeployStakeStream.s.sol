// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/StakeStreamFactory.sol";

contract DeployStakeStreamFactory is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        StakeStreamFactory factory = new StakeStreamFactory();
        console.log(" StakeStreamFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
