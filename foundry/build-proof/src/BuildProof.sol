// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract BuildProof {
    uint256 public constant MAX_NAME_LENGTH = 64;
    uint256 public constant MAX_URL_LENGTH = 200;
    struct Project { address builder; string name; string url; uint64 createdAt; }
    Project[] public projects;
    event ProjectRegistered(uint256 indexed projectId, address indexed builder, string name, string url);
    error EmptyName(); error InvalidUrl(); error NameTooLong(); error UrlTooLong();

    function registerProject(string calldata name, string calldata url) external returns (uint256 projectId) {
        bytes memory n = bytes(name); bytes memory u = bytes(url);
        if (n.length == 0) revert EmptyName();
        if (n.length > MAX_NAME_LENGTH) revert NameTooLong();
        if (u.length < 8 || !_startsWithHttps(u)) revert InvalidUrl();
        if (u.length > MAX_URL_LENGTH) revert UrlTooLong();
        projectId = projects.length;
        projects.push(Project(msg.sender, name, url, uint64(block.timestamp)));
        emit ProjectRegistered(projectId, msg.sender, name, url);
    }
    function projectCount() external view returns (uint256) { return projects.length; }
    function _startsWithHttps(bytes memory value) private pure returns (bool) {
        bytes memory prefix = bytes("https://");
        if (value.length < prefix.length) return false;
        for (uint256 i; i < prefix.length; ++i) if (value[i] != prefix[i]) return false;
        return true;
    }
}
