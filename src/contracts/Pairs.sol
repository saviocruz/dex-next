// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pairs {
   address public admin;
    address[] public addresses;
    uint public size;

    event NewAddress(address indexed tokenAddress, string symbol, address user);

    constructor ( )  {
        admin = msg.sender;
    }

    function add(address _tokenAddress) public {
        require(msg.sender == admin,  "Somente admin");
        require(ERC20(_tokenAddress).totalSupply() > 0, "Token nao possui total gerado.");
        string memory symbol = ERC20(_tokenAddress).symbol();
        addresses.push(_tokenAddress);
        size = size + 1;
        emit NewAddress(_tokenAddress, symbol, msg.sender);
    }
}