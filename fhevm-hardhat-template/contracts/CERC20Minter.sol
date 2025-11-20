// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IWormholeRelayer, IWormholeReceiver} from "./interfaces/IWormholeRelayer.sol";
import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";

interface ICERC20 {
    function mint(address _to, euint64 _amount) external;

    function burn(address _from, euint64 _amount) external;
}

contract CERC20Minter is IWormholeReceiver {
    error UnauthorizedCaller();
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientFee();

    address public immutable WORMHOLE_RELAYER;
    address public immutable CERC20_TOKEN;
    uint16 public immutable SCROLL_CHAIN_ID;
    address public immutable SCROLL_DEPOSITOR;
    uint256 public constant GAS_LIMIT = 200_000;

    event MintExecuted(address indexed user, uint256 amount);
    event BurnExecuted(address indexed user, uint256 amount);
    event WithdrawMessageSent(address indexed user, uint256 amount);

    constructor(address _wormholeRelayer, address _cerc20Token, uint16 _scrollChainId, address _scrollDepositor) {
        if (_wormholeRelayer == address(0) || _cerc20Token == address(0) || _scrollDepositor == address(0))
            revert ZeroAddress();

        WORMHOLE_RELAYER = _wormholeRelayer;
        CERC20_TOKEN = _cerc20Token;
        SCROLL_CHAIN_ID = _scrollChainId;
        SCROLL_DEPOSITOR = _scrollDepositor;
    }

    function quoteCrossChainCost() public view returns (uint256 cost) {
        (cost, ) = IWormholeRelayer(WORMHOLE_RELAYER).quoteEVMDeliveryPrice(SCROLL_CHAIN_ID, 0, GAS_LIMIT);
    }

    function withdraw(uint64 _amount) external payable {
        if (_amount == 0) revert ZeroAmount();

        uint256 _wormholeFee = quoteCrossChainCost();
        if (msg.value < _wormholeFee) revert InsufficientFee();

        euint64 _encAmount = FHE.asEuint64(_amount);
        ICERC20(CERC20_TOKEN).burn(msg.sender, _encAmount);

        IWormholeRelayer(WORMHOLE_RELAYER).sendPayloadToEvm{value: _wormholeFee}(
            SCROLL_CHAIN_ID,
            SCROLL_DEPOSITOR,
            abi.encode(msg.sender, _amount),
            0,
            GAS_LIMIT
        );

        emit BurnExecuted(msg.sender, _amount);
        emit WithdrawMessageSent(msg.sender, _amount);
    }

    function receiveWormholeMessages(
        bytes memory _payload,
        bytes[] memory,
        bytes32 _sourceAddress,
        uint16 _sourceChain,
        bytes32
    ) external payable override {
        if (msg.sender != WORMHOLE_RELAYER) revert UnauthorizedCaller();
        if (_sourceChain != SCROLL_CHAIN_ID) revert UnauthorizedCaller();
        if (address(uint160(uint256(_sourceAddress))) != SCROLL_DEPOSITOR) revert UnauthorizedCaller();

        (bool _isMint, address _user, uint64 _amount) = abi.decode(_payload, (bool, address, uint64));

        if (_isMint) {
            euint64 _encAmount = FHE.asEuint64(_amount);
            ICERC20(CERC20_TOKEN).mint(_user, _encAmount);
            emit MintExecuted(_user, _amount);
        }
    }
}
