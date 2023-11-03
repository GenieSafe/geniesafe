// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract WillContract {
    struct Will {
        address owner;
        address[] beneficiaries;
        uint256[] percentages;
        bool validated;
    }

    mapping(bytes32 => Will) public wills;

    constructor() {}

    function stringToBytes32(
        string memory source
    ) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function createWill(
        string memory id,
        address owner,
        address[] memory _beneficiaries,
        uint256[] memory _percentages
    ) public {
        bytes32 idBytes = stringToBytes32(id);
        require(
            wills[idBytes].owner == address(0),
            "Will with this ID already exists"
        );
        require(
            _beneficiaries.length == _percentages.length,
            "Invalid input data"
        );

        wills[idBytes] = Will({
            owner: owner,
            beneficiaries: _beneficiaries,
            percentages: _percentages,
            validated: false
        });
    }

    function validateWill(string memory id) public {
        bytes32 idBytes = stringToBytes32(id);
        wills[idBytes].validated = true;
    }

    function executeWill(string memory id) public payable {
        bytes32 idBytes = stringToBytes32(id);
        Will storage will = wills[idBytes];
        require(will.validated, "Will must be validated");

        uint256 totalpercentages = 0;
        for (uint256 i = 0; i < will.percentages.length; i++) {
            totalpercentages += will.percentages[i];
        }

        require(totalpercentages == 100, "percentages must total 100");

        for (uint256 i = 0; i < will.beneficiaries.length; i++) {
            uint256 amount = (address(this).balance * will.percentages[i]) /
                100;
            payable(will.beneficiaries[i]).transfer(amount);
        }
    }

    function deleteWill(string memory id) public {
        bytes32 idBytes = stringToBytes32(id);
        require(
            wills[idBytes].owner == msg.sender,
            "Only the owner can delete this will"
        );
        delete wills[idBytes];
    }

    function getWill(
        string memory id
    )
        public
        view
        returns (
            address owner,
            address[] memory beneficiaries,
            uint256[] memory percentages,
            bool validated
        )
    {
        bytes32 idBytes = stringToBytes32(id);
        Will storage will = wills[idBytes];
        return (
            will.owner,
            will.beneficiaries,
            will.percentages,
            will.validated
        );
    }

    receive() external payable {}
}
