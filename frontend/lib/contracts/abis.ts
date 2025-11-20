export const AAVE_DEPOSITOR_ABI = [
  // View functions
  'function AAVE_POOL() view returns (address)',
  'function ASSET() view returns (address)',
  'function WORMHOLE_RELAYER() view returns (address)',
  'function SEPOLIA_CHAIN_ID() view returns (uint16)',
  'function SEPOLIA_MINTER() view returns (address)',
  'function quoteCrossChainCost() view returns (uint256)',

  // Write functions
  'function deposit(uint64 amount) payable',

  // Events
  'event Deposited(address indexed user, uint256 amount)',
  'event TokensClaimed(address indexed user, uint256 amount)',
] as const;

export const CERC20_MINTER_ABI = [
  // View functions
  'function WORMHOLE_RELAYER() view returns (address)',
  'function CERC20_TOKEN() view returns (address)',
  'function SCROLL_CHAIN_ID() view returns (uint16)',
  'function SCROLL_DEPOSITOR() view returns (address)',
  'function quoteCrossChainCost() view returns (uint256)',

  // Write functions
  'function withdraw(uint64 amount) payable',

  // Events
  'event MintExecuted(address indexed user, uint256 amount)',
  'event BurnExecuted(address indexed user, uint256 amount)',
  'event WithdrawMessageSent(address indexed user, uint256 amount)',
] as const;

export const CERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const;

export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const;
