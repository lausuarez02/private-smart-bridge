// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPool} from "./interfaces/IPool.sol";
import {IERC20} from "./interfaces/IERC20.sol";

contract AaveDepositor {
    error ZeroAmount();
    error ZeroAddress();
    error InsufficientBalance();
    error TransferFailed();
    error ApproveFailed();

    IPool public immutable AAVE_POOL;
    IERC20 public immutable ASSET;
    IERC20 public immutable A_TOKEN;

    mapping(address user => uint256 shares) public userShares;
    uint256 public totalShares;

    event Deposit(address indexed user, uint256 assets, uint256 shares);
    event Withdraw(address indexed user, uint256 assets, uint256 shares);

    constructor(address _pool, address _asset, address _aToken) {
        if (_pool == address(0) || _asset == address(0) || _aToken == address(0)) revert ZeroAddress();

        AAVE_POOL = IPool(_pool);
        ASSET = IERC20(_asset);
        A_TOKEN = IERC20(_aToken);

        if (!ASSET.approve(_pool, type(uint256).max)) revert ApproveFailed();
    }

    function deposit(uint256 _amount) external {
        if (_amount == 0) revert ZeroAmount();

        if (!ASSET.transferFrom(msg.sender, address(this), _amount)) revert TransferFailed();

        uint256 _sharesBefore = A_TOKEN.balanceOf(address(this));

        AAVE_POOL.supply({asset: address(ASSET), amount: _amount, onBehalfOf: address(this), referralCode: 0});

        uint256 _sharesReceived = A_TOKEN.balanceOf(address(this)) - _sharesBefore;

        unchecked {
            userShares[msg.sender] += _sharesReceived;
            totalShares += _sharesReceived;
        }

        emit Deposit(msg.sender, _amount, _sharesReceived);
    }

    function withdraw(uint256 _shares) external {
        if (_shares == 0) revert ZeroAmount();
        if (userShares[msg.sender] < _shares) revert InsufficientBalance();

        unchecked {
            userShares[msg.sender] -= _shares;
            totalShares -= _shares;
        }

        uint256 _withdrawn = AAVE_POOL.withdraw({asset: address(ASSET), amount: _shares, to: msg.sender});

        emit Withdraw(msg.sender, _withdrawn, _shares);
    }

    function withdrawAll() external {
        uint256 _shares = userShares[msg.sender];
        if (_shares == 0) revert ZeroAmount();

        unchecked {
            userShares[msg.sender] = 0;
            totalShares -= _shares;
        }

        uint256 _withdrawn = AAVE_POOL.withdraw({asset: address(ASSET), amount: _shares, to: msg.sender});

        emit Withdraw(msg.sender, _withdrawn, _shares);
    }

    function balanceOf(address _user) external view returns (uint256) {
        return userShares[_user];
    }
}
