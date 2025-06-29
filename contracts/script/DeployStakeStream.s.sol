// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {StakeStream} from "../src/StakeStream.sol";
import {UmiResolver} from "../src/UmiResolver.sol";
import {MockUSDC} from "../test/mocks/MockUSDC.sol";


contract DeployStakeStream is Script {
  function run() external {
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy mock USDC on Anvil
        MockUSDC usdc = new MockUSDC();
        usdc.mint(msg.sender, 1000000 * 10**6); // Mint 1M USDC
        
        // Deploy StakeStream S.C
        StakeStream stakeStream = new StakeStream(address(usdc));
        
        // Deploy UmiResolver
        UmiResolver umiResolver = new UmiResolver(address(stakeStream));
        umiResolver.setSolver(address(umiResolver));
        
        vm.stopBroadcast();
        
    
        console.log("USDC_TOKEN=%s", address(usdc));
        console.log("StakeStream=%s", address(stakeStream));
        console.log("UmiResolver=%s", address(umiResolver));
    }
}
