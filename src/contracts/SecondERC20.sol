// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SecondERC20 is ERC20 {
    constructor ()  ERC20("SecondERC20", "2ND" ) {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
