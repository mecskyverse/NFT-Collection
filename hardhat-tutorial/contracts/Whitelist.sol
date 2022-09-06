// SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

contract Whitelist {
    uint8 public maxWhiteListAddresses;
    //if an address is whitelisted than it will show true in the mapping
    mapping(address => bool) public whiteListAddresses;

    // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    // NOTE: Don't change this variable name, as it will be part of verification
    uint8 public numAddressesWhitelisted;

    //Setting the max no. of whitelist addresses
    //user will put the value at the time of the development
    constructor(uint8 _maxWhiteListAddresses) {
        maxWhiteListAddresses = _maxWhiteListAddresses;
    }

    //function to whitelist an address
    function addressToWhiteList() public {
        require(!whiteListAddresses[msg.sender], "You are already whitelisted");
        require(
            numAddressesWhitelisted < maxWhiteListAddresses,
            "Whitelist is full"
        );
        whiteListAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}
