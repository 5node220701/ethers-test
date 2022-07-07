// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../node_modules/@klaytn/contracts/KIP/token/KIP37/KIP37.sol";

contract MyKlayNFT is KIP37 {
    uint256 public constant TOKEN = 0;

    constructor() KIP37("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, TOKEN, 10**18, "");
    }
}