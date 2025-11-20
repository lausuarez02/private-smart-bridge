// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPool} from "./interfaces/IPool.sol";
import {IERC20} from "./interfaces/IERC20.sol";
import {IWormholeRelayer, IWormholeReceiver} from "./interfaces/IWormholeRelayer.sol";

contract AaveDepositorBase is IWormholeReceiver {
    error ZeroAmount();
    error ZeroAddress();
    error TransferFailed();
    error ApproveFailed();
    error InsufficientFee();
    error UnauthorizedCaller();
    error AlreadyInitialized();

    IPool public immutable AAVE_POOL;
    IERC20 public immutable ASSET;
    IWormholeRelayer public immutable WORMHOLE_RELAYER;

    uint16 public immutable SEPOLIA_CHAIN_ID;
    address public SEPOLIA_MINTER;
    uint256 public constant GAS_LIMIT = 200_000;

    bool private initialized;

    event Deposited(address indexed user, uint256 amount);
    event WithdrawRequested(address indexed user, uint256 amount);
    event TokensClaimed(address indexed user, uint256 amount);
    event Initialized(address sepoliaMinter);

    constructor(
        address _pool,
        address _asset,
        address _wormholeRelayer,
        uint16 _sepoliaChainId
    ) {
        if (
            _pool == address(0) ||
            _asset == address(0) ||
            _wormholeRelayer == address(0)
        ) revert ZeroAddress();

        AAVE_POOL = IPool(_pool);
        ASSET = IERC20(_asset);
        WORMHOLE_RELAYER = IWormholeRelayer(_wormholeRelayer);
        SEPOLIA_CHAIN_ID = _sepoliaChainId;

        if (!ASSET.approve(_pool, type(uint256).max)) revert ApproveFailed();
    }

    function initialize(address _sepoliaMinter) external {
        if (initialized) revert AlreadyInitialized();
        if (_sepoliaMinter == address(0)) revert ZeroAddress();

        SEPOLIA_MINTER = _sepoliaMinter;
        initialized = true;

        emit Initialized(_sepoliaMinter);
    }

    function quoteCrossChainCost() public view returns (uint256 cost) {
        (cost, ) = WORMHOLE_RELAYER.quoteEVMDeliveryPrice(SEPOLIA_CHAIN_ID, 0, GAS_LIMIT);
    }

    function deposit(uint64 _amount) external payable {
        if (_amount == 0) revert ZeroAmount();

        uint256 _wormholeFee = quoteCrossChainCost();
        if (msg.value < _wormholeFee) revert InsufficientFee();

        if (!ASSET.transferFrom(msg.sender, address(this), _amount)) revert TransferFailed();

        AAVE_POOL.supply({asset: address(ASSET), amount: _amount, onBehalfOf: address(this), referralCode: 0});

        WORMHOLE_RELAYER.sendPayloadToEvm{value: _wormholeFee}(
            SEPOLIA_CHAIN_ID,
            SEPOLIA_MINTER,
            abi.encode(true, msg.sender, _amount),
            0,
            GAS_LIMIT
        );

        emit Deposited(msg.sender, _amount);
    }

    function receiveWormholeMessages(
        bytes memory _payload,
        bytes[] memory,
        bytes32 _sourceAddress,
        uint16 _sourceChain,
        bytes32
    ) external payable override {
        if (msg.sender != address(WORMHOLE_RELAYER)) revert UnauthorizedCaller();
        if (_sourceChain != SEPOLIA_CHAIN_ID) revert UnauthorizedCaller();
        if (address(uint160(uint256(_sourceAddress))) != SEPOLIA_MINTER) revert UnauthorizedCaller();

        (address _user, uint64 _amount) = abi.decode(_payload, (address, uint64));

        AAVE_POOL.withdraw({asset: address(ASSET), amount: _amount, to: _user});

        emit TokensClaimed(_user, _amount);
    }
}
