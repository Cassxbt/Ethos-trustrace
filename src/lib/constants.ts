// Application constants for TrustRace

export const APP_CONFIG = {
  name: 'TrustRace',
  description: 'Credibility-weighted contest platform powered by Ethos',
  version: '1.0.0',
  url: 'https://trustrace.eth',
} as const;

export const NETWORK_CONFIG = {
  baseSepolia: {
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    blockExplorerUrl: 'https://sepolia.basescan.org',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  base: {
    name: 'Base',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    blockExplorerUrl: 'https://basescan.org',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
} as const;

export const ETHOS_CONFIG = {
  apiUrl: 'https://api.ethos.network/api/v2',
  cacheTTL: 60 * 60 * 1000, // 1 hour
  maxScore: 2800,
  minScoreForContestCreation: 1400,
  credibilityLevels: {
    questionable: { min: 0, max: 799, label: 'Questionable', color: 'red' },
    unknown: { min: 800, max: 1199, label: 'Unknown', color: 'orange' },
    neutral: { min: 1200, max: 1399, label: 'Neutral', color: 'yellow' },
    known: { min: 1400, max: 1599, label: 'Known', color: 'green' },
    established: { min: 1600, max: 1799, label: 'Established', color: 'blue' },
    reputable: { min: 1800, max: 1999, label: 'Reputable', color: 'purple' },
    legendary: { min: 2000, max: 2800, label: 'Legendary', color: 'indigo' },
  },
} as const;

export const CONTEST_CONFIG = {
  minSubmissionDuration: 3600, // 1 hour
  maxSubmissionDuration: 30 * 24 * 60 * 60, // 30 days
  minVotingDuration: 3600, // 1 hour
  maxVotingDuration: 14 * 24 * 60 * 60, // 14 days
  minRewardsPool: '0.001', // 0.001 ETH
  maxRewardsPool: '100', // 100 ETH
  maxTitleLength: 100,
  maxPromptLength: 1000,
  maxDescriptionLength: 1000,
  supportedFileTypes: ['image/*', '.pdf', '.doc', '.docx'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
} as const;

export const VOTING_CONFIG = {
  minVoteAmount: '0.001', // 0.001 ETH
  maxVoteAmount: '10', // 10 ETH
  votingPowerMultiplier: 1000, // 1000 credibility = 1x voting power
} as const;

export const REWARDS_CONFIG = {
  claimDeadline: 30 * 24 * 60 * 60, // 30 days
  platformFeePercentage: 2.5, // 2.5%
  creatorFeePercentage: 5, // 5%
} as const;

export const UI_CONFIG = {
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: 'ease-in-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
} as const;

export const STORAGE_KEYS = {
  darkMode: 'darkMode',
  recentAddresses: 'recentAddresses',
  favoriteContests: 'favoriteContests',
  viewedContests: 'viewedContests',
  userPreferences: 'userPreferences',
  lastConnectedWallet: 'lastConnectedWallet',
} as const;

export const ERROR_MESSAGES = {
  wallet: {
    notConnected: 'Please connect your wallet to continue',
    wrongNetwork: 'Please switch to the correct network',
    insufficientFunds: 'Insufficient balance for this transaction',
    userRejected: 'Transaction was rejected by user',
  },
  contest: {
    notFound: 'Contest not found',
    notActive: 'Contest is not active',
    submissionClosed: 'Submission period has ended',
    votingClosed: 'Voting period has ended',
    alreadySubmitted: 'You have already submitted to this contest',
    insufficientCredibility: 'Insufficient credibility score to perform this action',
  },
  submission: {
    tooLarge: 'File size exceeds maximum limit',
    invalidType: 'File type not supported',
    uploadFailed: 'Failed to upload file',
    notFound: 'Submission not found',
  },
  voting: {
    insufficientFunds: 'Insufficient balance to vote',
    alreadyVoted: 'You have already voted for this submission',
    contestEnded: 'Cannot vote on ended contest',
  },
  rewards: {
    notAvailable: 'No rewards available to claim',
    alreadyClaimed: 'Reward has already been claimed',
    claimFailed: 'Failed to claim reward',
  },
  network: {
    requestFailed: 'Network request failed',
    timeout: 'Request timed out',
    serverError: 'Server error occurred',
  },
} as const;

export const SUCCESS_MESSAGES = {
  contest: {
    created: 'Contest created successfully',
    submitted: 'Submission submitted successfully',
    voted: 'Vote submitted successfully',
  },
  rewards: {
    claimed: 'Reward claimed successfully',
  },
  general: {
    copied: 'Copied to clipboard',
    saved: 'Changes saved successfully',
  },
} as const;

export const ROUTES = {
  home: '/',
  contests: '/contests',
  create: '/create',
  rewards: '/rewards',
  ethos: '/ethos',
  contest: (id: string) => `/contests/${id}`,
  profile: (address: string) => `/ethos?address=${address}`,
} as const;

export const EXTERNAL_LINKS = {
  ethan: 'https://ethos.network',
  base: 'https://base.org',
  walletConnect: 'https://walletconnect.com',
  rainbowKit: 'https://rainbowkit.com',
  wagmi: 'https://wagmi.sh',
  nextjs: 'https://nextjs.org',
  tailwind: 'https://tailwindcss.com',
} as const;
