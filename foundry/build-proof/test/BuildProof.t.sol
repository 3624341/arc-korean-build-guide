// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;
import {Test} from "forge-std/Test.sol";
import {BuildProof} from "../src/BuildProof.sol";

contract BuildProofTest is Test {
    BuildProof registry; address builder = makeAddr("builder");
    function setUp() public { registry = new BuildProof(); }
    function test_RegisterProject() public {
        vm.prank(builder); uint256 id = registry.registerProject("Arc Korea Guide", "https://example.com/arc");
        assertEq(id, 0); assertEq(registry.projectCount(), 1);
        (address owner, string memory name, string memory url,) = registry.projects(0);
        assertEq(owner, builder); assertEq(name, "Arc Korea Guide"); assertEq(url, "https://example.com/arc");
    }
    function test_EmitsProjectRegistered() public {
        vm.expectEmit(true, true, false, true);
        emit BuildProof.ProjectRegistered(0, builder, "Arc Tool", "https://example.com/tool");
        vm.prank(builder); registry.registerProject("Arc Tool", "https://example.com/tool");
    }
    function test_RevertEmptyName() public { vm.expectRevert(BuildProof.EmptyName.selector); registry.registerProject("", "https://example.com"); }
    function test_RevertHttpUrl() public { vm.expectRevert(BuildProof.InvalidUrl.selector); registry.registerProject("Unsafe", "http://example.com"); }
    function test_RegisterMultipleProjects() public { registry.registerProject("One", "https://example.com/1"); registry.registerProject("Two", "https://example.com/2"); assertEq(registry.projectCount(), 2); }
}
