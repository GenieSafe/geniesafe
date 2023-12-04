// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

// v0.0.3

struct Will {
    string willId;
    address ownerAddress;
    uint256 weiAmount;
    Beneficiary[] beneficiaries;
}

struct Beneficiary {
    address beneficiaryAddress;
    uint256 percentage;
}

contract WillContract {
    mapping(string => Will) wills;

    // Event to notify that a will already exists
    event WillAlreadyExists(string indexed willId, address indexed owner);

    constructor() {}

    function getWill(string memory _willId)
        external
        view
        returns (Will memory)
    {
        return wills[_willId];
    }

    function createWill(
        string memory _willId,
        Beneficiary[] memory _beneficiaries
    ) external payable {
        address _ownerAddress = msg.sender;

        // Check if the will already exists
        if (wills[_willId].ownerAddress != address(0)) {
            emit WillAlreadyExists(_willId, _ownerAddress);
            revert("Will already exists, Ether refunded.");
        }

        // Create a new will
        Will storage newWill = wills[_willId];
        newWill.willId = _willId;
        newWill.ownerAddress = _ownerAddress;
        newWill.weiAmount = msg.value;

        // Use a temporary variable to store the array
        Beneficiary[] storage tempBeneficiaries = newWill.beneficiaries;
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            tempBeneficiaries.push(_beneficiaries[i]);
        }
    }

    function updateWill(
        string memory _willId,
        Beneficiary[] memory _newBeneficiaries
    ) external payable {
        // Check if the will already exists
        if (wills[_willId].ownerAddress == address(0)) {
            emit WillAlreadyExists(_willId, msg.sender);
            // Refund the Ether sent by reverting the transaction
            revert("Will does not exist, Ether refunded.");
        }

        // If Ether is sent with the transaction, treat it as a deposit
        if (msg.value > 0) {
            // Update the will's weiAmount
            wills[_willId].weiAmount += msg.value;
        }

        // Update the beneficiaries if new data is provided
        if (_newBeneficiaries.length > 0) {
            // Clear existing beneficiaries
            delete wills[_willId].beneficiaries;

            // Use a temporary variable to store the array
            Beneficiary[] storage tempBeneficiaries = wills[_willId]
                .beneficiaries;
            for (uint256 i = 0; i < _newBeneficiaries.length; i++) {
                tempBeneficiaries.push(_newBeneficiaries[i]);
            }
        }
    }

    function deleteWill(string memory _willId) external {
        // Check if the will exists
        if (wills[_willId].ownerAddress == address(0)) {
            emit WillAlreadyExists(_willId, msg.sender);
            revert("Will does not exist.");
        }

        // Delete the will
        delete wills[_willId];
    }

    function disburse(string memory _willId) external {
        // Check if the will exists
        if (wills[_willId].ownerAddress == address(0)) {
            emit WillAlreadyExists(_willId, msg.sender);
            revert("Will does not exist.");
        }

        Will storage currentWill = wills[_willId];

        // Check if there are beneficiaries in the will
        require(
            currentWill.beneficiaries.length > 0,
            "No beneficiaries in the will."
        );

        // Calculate total percentage to validate it sums to 100
        uint256 totalPercentage;
        for (uint256 i = 0; i < currentWill.beneficiaries.length; i++) {
            totalPercentage += currentWill.beneficiaries[i].percentage;
        }
        require(
            totalPercentage == 100,
            "Beneficiary percentages do not sum to 100."
        );

        // Disburse funds to beneficiaries based on their percentages
        for (uint256 i = 0; i < currentWill.beneficiaries.length; i++) {
            address beneficiary = currentWill
                .beneficiaries[i]
                .beneficiaryAddress;
            uint256 amountToSend = (currentWill.weiAmount *
                currentWill.beneficiaries[i].percentage) / 100;
            payable(beneficiary).transfer(amountToSend);
        }

        // Reset the weiAmount after disbursement
        currentWill.weiAmount = 0;
    }

    function withdraw(string memory _willId, uint256 _weiAmount) external {
        // Check if the will exists
        if (wills[_willId].ownerAddress == address(0)) {
            emit WillAlreadyExists(_willId, msg.sender);
            revert("Will does not exist.");
        }

        Will storage currentWill = wills[_willId];

        // Check if the caller is the owner of the will
        require(
            msg.sender == currentWill.ownerAddress,
            "Only the owner can withdraw funds."
        );

        // Check if the requested withdrawal amount is not greater than the available funds
        require(
            _weiAmount <= currentWill.weiAmount,
            "Insufficient funds in the will."
        );

        // Transfer the requested amount to the owner
        payable(msg.sender).transfer(_weiAmount);

        // Update the weiAmount in the will after withdrawal
        currentWill.weiAmount -= _weiAmount;
    }

    receive() external payable {}
}
