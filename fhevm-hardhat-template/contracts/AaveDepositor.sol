// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPool} from "./interfaces/IPool.sol";
import {IERC20} from "./interfaces/IERC20.sol";

contract AaveDepositor {
    error ZeroAmount();
    error ZeroAddress();
    error InsufficientBalance();
    error TransferFailed();

    IPool public immutable AAVE_POOL;
    IERC20 public immutable ASSET;

    mapping(address user => uint256 amount) public deposits;
    uint256 public totalDeposits;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor(address _pool, address _asset) {
        if (_pool == address(0) || _asset == address(0)) revert ZeroAddress();

        AAVE_POOL = IPool(_pool);
        ASSET = IERC20(_asset);
    }

    function deposit(uint256 _amount) external {
        if (_amount == 0) revert ZeroAmount();

        if (!ASSET.transferFrom(msg.sender, address(this), _amount)) revert TransferFailed();

        ASSET.approve(address(AAVE_POOL), _amount);

        AAVE_POOL.supply({
            asset: address(ASSET),
            amount: _amount,
            onBehalfOf: address(this),
            referralCode: 0
        });

        unchecked {
            deposits[msg.sender] += _amount;
            totalDeposits += _amount;
        }

        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        if (_amount == 0) revert ZeroAmount();
        if (deposits[msg.sender] < _amount) revert InsufficientBalance();

        unchecked {
            deposits[msg.sender] -= _amount;
            totalDeposits -= _amount;
        }

        uint256 _withdrawn = AAVE_POOL.withdraw({
            asset: address(ASSET),
            amount: _amount,
            to: msg.sender
        });

        emit Withdraw(msg.sender, _withdrawn);
    }

    function withdrawAll() external {
        uint256 _balance = deposits[msg.sender];
        if (_balance == 0) revert ZeroAmount();

        unchecked {
            deposits[msg.sender] = 0;
            totalDeposits -= _balance;
        }

        uint256 _withdrawn = AAVE_POOL.withdraw({
            asset: address(ASSET),
            amount: _balance,
            to: msg.sender
        });

        emit Withdraw(msg.sender, _withdrawn);
    }
}
