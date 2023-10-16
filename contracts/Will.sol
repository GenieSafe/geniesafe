// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract WillManager {
    struct Will {
        address owner;
        address[] beneficiaries;
        uint256[] shares;
        bool activated;
        bool validated;
    }

    mapping(uint256 => Will) public wills;

    constructor() {}

    function createWill(
        uint256 id,
        address[] memory _beneficiaries,
        uint256[] memory _shares
    ) public {
        require(
            wills[id].owner == address(0),
            "Will with this ID already exists"
        );
        require(_beneficiaries.length == _shares.length, "Invalid input data");

        wills[id] = Will({
            owner: msg.sender,
            beneficiaries: _beneficiaries,
            shares: _shares,
            activated: false,
            validated: false
        });
    }

    function activateWill(uint256 id) public {
        Will storage will = wills[id];
        require(
            will.owner == msg.sender,
            "Only the owner can activate the will"
        );

        will.activated = true;
    }

    function validateWill(uint256 id) public {
        Will storage will = wills[id];
        require(
            will.owner == msg.sender,
            "Only the owner can validate the will"
        );
        require(will.activated, "Will must be activated first");

        will.validated = true;
    }

    function executeWill(uint256 id) public payable {
        Will storage will = wills[id];
        require(will.validated, "Will must be validated");
        require(will.activated, "Will must be activated");

        uint256 totalShares = 0;
        for (uint256 i = 0; i < will.shares.length; i++) {
            totalShares += will.shares[i];
        }

        require(totalShares == 100, "Shares must total 100");

        for (uint256 i = 0; i < will.beneficiaries.length; i++) {
            uint256 amount = (msg.value * will.shares[i]) / 100;
            payable(will.beneficiaries[i]).transfer(amount);
        }
    }
}
