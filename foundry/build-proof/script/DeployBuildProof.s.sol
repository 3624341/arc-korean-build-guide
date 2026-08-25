// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {Script} from "forge-std/Script.sol";
import {BuildProof} from "../src/BuildProof.sol";
contract DeployBuildProof is Script {
    function run() external returns (BuildProof registry) { vm.startBroadcast(); registry = new BuildProof(); vm.stopBroadcast(); }
}
