# TrustRace

A credibility-weighted contest platform powered by Ethos Protocol, built on Base blockchain.

## Overview

TrustRace enables users to create and participate in contests where voting power is determined by Ethos credibility scores. This ensures that participants with proven reputation have greater influence on contest outcomes.

## Key Features

- **Credibility-Weighted Voting**: Your Ethos score determines your voting power
- **Vouch-Gated Creation**: Only users with sufficient credibility can create contests
- **Decentralized Storage**: Submissions stored on IPFS
- **Smart Contract Rewards**: Automatic reward distribution to winners
- **Real-time Updates**: Live contest status and voting results
- **Mobile Responsive**: Works seamlessly on all devices

## Architecture

### Smart Contracts
- **TrustRaceFactory**: Deploys and manages contest instances
- **TrustRaceContest**: Core contest logic with credibility-weighted voting
- **EthosScoreOracle**: Caches and manages Ethos credibility scores on-chain

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **RainbowKit**: Wallet connection and management
- **Wagmi**: Ethereum interaction hooks

### Backend
- **Firebase**: Real-time database and authentication
- **Ethos API**: Credibility score integration
- **IPFS**: Decentralized file storage

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/trustrace.git
cd trustrace
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your API keys and configuration
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Blockchain
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key

# Ethos API
NEXT_PUBLIC_ETHOS_API_URL=https://api.ethos.network/api/v2
```

## Usage

### Creating a Contest
1. Connect your wallet
2. Navigate to Create page
3. Ensure you have sufficient credibility score (1400+)
4. Fill in contest details:
   - Title and prompt
   - Reward pool amount
   - Submission and voting durations
   - Minimum credibility requirements
5. Approve transaction to deploy contest

### Participating in Contests
1. Browse active contests
2. Submit your entry during the submission phase
3. Vote for submissions during the voting phase
4. Your voting power = floor(credibility_score / 1000)

### Claiming Rewards
1. Navigate to Rewards page
2. View your earned rewards
3. Click claim to transfer to your wallet

## Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   ├── contests/       # Contest-specific components
│   ├── ethos/          # Ethos integration components
│   ├── layout/         # Layout components
│   ├── providers/      # React context providers
│   └── ui/            # Generic UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API service layers
└── types/              # TypeScript type definitions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## License

This project is licensed under the MIT License.

---

Built with ❤️ by the TrustRace team
