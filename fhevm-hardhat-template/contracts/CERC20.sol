// SPDX-License-Identifier: BUSL-1.1
/*
 * Copyright (c) 2025 Tomi204 <tomas.d.manzo.oliver@gmail.com>
 *
 * Business Source License 1.1
 * See the LICENSE file in the project root for license information.
 *
 * You may view, copy, and modify this code for non-production use only.
 * Production use requires a commercial license from the author.
 */
pragma solidity ^0.8.24;

import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {FHE, externalEuint64, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {ERC7984} from "openzeppelin-confidential-contracts/contracts/token/ERC7984/ERC7984.sol";

contract CERC20 is ZamaEthereumConfig, ERC7984, Ownable2Step {
    constructor(
        address owner,
        uint64 amount,
        string memory name_,
        string memory symbol_,
        string memory tokenURI_
    ) ERC7984(name_, symbol_, tokenURI_) Ownable(owner) {
        euint64 encryptedAmount = FHE.asEuint64(amount);
        _mint(owner, encryptedAmount);
    }
}
