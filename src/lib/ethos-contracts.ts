import { ethers, type BrowserProvider, type Signer } from 'ethers';

// Ethos contract addresses on Base Sepolia
export const ETHOS_SCORE_ORACLE = '0x43259Ac2952ae1583BDF0DC4756Eb86ec963ee39';
export const TRUST_RACE_FACTORY = '0xc6aFaF08b17C6Be52eF1927889D068Dc138974E8';

export const ETHOS_CONTRACTS = {
  // Review contract - for reviewing other users
  REVIEW: '0x1234567890123456789012345678901234567890', // Replace with actual address
  
  // Vouch contract - for vouching for other users
  VOUCH: '0x1234567890123456789012345678901234567890', // Replace with actual address
  
  // Slash contract - for slashing malicious actors
  SLASH: '0x1234567890123456789012345678901234567890', // Replace with actual address
  
  // Attest contract - for attesting to claims
  ATTEST: '0x1234567890123456789012345678901234567890', // Replace with actual address
  
  // Profile contract - for user profiles
  PROFILE: '0x1234567890123456789012345678901234567890', // Replace with actual address
} as const;

// Ethos contract ABIs (simplified versions for integration)
export const ETHOS_ABIS = {
  REVIEW: [
    'function review(address reviewed, bool positive, string calldata reason) external',
    'function getReviews(address user) external view returns (uint256 positive, uint256 negative)',
    'event ReviewCreated(address indexed reviewer, address indexed reviewed, bool positive, string reason)'
  ],
  
  VOUCH: [
    'function vouch(address vouchee, uint256 amount) external payable',
    'function getVouches(address user) external view returns (uint256 totalAmount, uint256 voucherCount)',
    'event VouchCreated(address indexed voucher, address indexed vouchee, uint256 amount)'
  ],
  
  SLASH: [
    'function slash(address slashed, uint256 amount, string calldata reason) external',
    'function getSlashHistory(address user) external view returns (uint256 totalSlashed)',
    'event SlashCreated(address indexed slasher, address indexed slashed, uint256 amount, string reason)'
  ],
  
  ATTEST: [
    'function attest(address subject, bytes32 claim, bool value) external',
    'function getAttestations(address subject, bytes32 claim) external view returns (bool value, uint256 timestamp)',
    'event AttestationCreated(address indexed attestant, address indexed subject, bytes32 claim, bool value)'
  ],
  
  PROFILE: [
    'function setProfile(string calldata name, string calldata bio, string calldata avatar) external',
    'function getProfile(address user) external view returns (string name, string bio, string avatar)',
    'event ProfileUpdated(address indexed user, string name, string bio, string avatar)'
  ]
} as const;

// Contract instances factory
export function getEthosContract(
  contractName: keyof typeof ETHOS_CONTRACTS,
  provider: BrowserProvider | Signer
) {
  const address = ETHOS_CONTRACTS[contractName];
  const abi = ETHOS_ABIS[contractName];
  
  return new ethers.Contract(address, abi, provider);
}

// Helper functions for Ethos interactions
export class EthosContractHelper {
  private provider: BrowserProvider | Signer;
  
  constructor(provider: BrowserProvider | Signer) {
    this.provider = provider;
  }
  
  // Vouch for a user
  async vouchForUser(vouchee: string, amount: string) {
    const vouchContract = getEthosContract('VOUCH', this.provider);
    
    if ('populateTransaction' in vouchContract) {
      const tx = await vouchContract.vouch.populateTransaction(vouchee, ethers.parseEther(amount));
      return tx;
    }
    
    throw new Error('Provider does not support transaction population');
  }
  
  // Review a user
  async reviewUser(reviewed: string, positive: boolean, reason: string) {
    const reviewContract = getEthosContract('REVIEW', this.provider);
    
    if ('populateTransaction' in reviewContract) {
      const tx = await reviewContract.review.populateTransaction(reviewed, positive, reason);
      return tx;
    }
    
    throw new Error('Provider does not support transaction population');
  }
  
  // Attest to a claim
  async attestToClaim(subject: string, claim: string, value: boolean) {
    const attestContract = getEthosContract('ATTEST', this.provider);
    const claimHash = ethers.keccak256(ethers.toUtf8Bytes(claim));
    
    if ('populateTransaction' in attestContract) {
      const tx = await attestContract.attest.populateTransaction(subject, claimHash, value);
      return tx;
    }
    
    throw new Error('Provider does not support transaction population');
  }
  
  // Get user's vouch information
  async getUserVouches(user: string) {
    const vouchContract = getEthosContract('VOUCH', this.provider);
    
    try {
      const result = await vouchContract.getVouches(user);
      return {
        totalAmount: ethers.formatEther(result.totalAmount),
        voucherCount: Number(result.voucherCount)
      };
    } catch (error) {
      console.error('Failed to get user vouches:', error);
      return { totalAmount: '0', voucherCount: 0 };
    }
  }
  
  // Get user's review information
  async getUserReviews(user: string) {
    const reviewContract = getEthosContract('REVIEW', this.provider);
    
    try {
      const result = await reviewContract.getReviews(user);
      return {
        positive: Number(result.positive),
        negative: Number(result.negative)
      };
    } catch (error) {
      console.error('Failed to get user reviews:', error);
      return { positive: 0, negative: 0 };
    }
  }
  
  // Get user's profile
  async getUserProfile(user: string) {
    const profileContract = getEthosContract('PROFILE', this.provider);
    
    try {
      const result = await profileContract.getProfile(user);
      return {
        name: result.name,
        bio: result.bio,
        avatar: result.avatar
      };
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return { name: '', bio: '', avatar: '' };
    }
  }
}

// React hook for Ethos contract interactions
export function useEthosContracts(provider: BrowserProvider | Signer) {
  return new EthosContractHelper(provider);
}
