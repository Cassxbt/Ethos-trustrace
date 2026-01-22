# TrustRace Testing Guide

## 🚀 Development Server Setup

### 1. Environment Variables Setup

Create `.env.local` in the project root with these variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Blockchain
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key

# Ethos API
NEXT_PUBLIC_ETHOS_API_URL=https://api.ethos.network/api/v2

# Contract Addresses (from CONTRACT_ADDRESSES.md)
NEXT_PUBLIC_ETHOS_ORACLE_ADDRESS=0x43259Ac2952ae1583BDF0DC4756Eb86ec963ee39
NEXT_PUBLIC_TRUST_RACE_FACTORY=0xc6aFaF08b17C6Be52eF1927889D068Dc138974E8
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🧪 Testing Scenarios

### Phase 1: Basic Functionality

#### 1. Wallet Connection
- [ ] Connect MetaMask to Base Sepolia
- [ ] Verify wallet address displays in navigation
- [ ] Test disconnect/reconnect functionality
- [ ] Check credibility score shows in navigation

#### 2. Navigation Testing
- [ ] Home page loads correctly
- [ ] Contests page shows contest list
- [ ] Create page shows form (if eligible)
- [ ] Rewards page shows rewards (if any)
- [ ] Ethos page shows profile search

#### 3. Ethos Integration
- [ ] Navigate to Ethos page
- [ ] Search for an address
- [ ] Verify credibility score displays
- [ ] Check voting power calculation
- [ ] Test profile tabs (vouches/attestations)

### Phase 2: Contest Creation

#### 1. Contest Form Testing
- [ ] Fill out contest creation form
- [ ] Test form validation (empty fields)
- [ ] Verify credibility gate (1400+ score)
- [ ] Test different reward amounts
- [ ] Test duration options

#### 2. Contest Deployment
- [ ] Submit contest creation
- [ ] Approve transaction in wallet
- [ ] Verify contest appears in contest list
- [ ] Check contest details page

### Phase 3: Contest Participation

#### 1. Submission Flow
- [ ] Navigate to active contest
- [ ] Click "Submit Entry" button
- [ ] Fill out submission form
- [ ] Upload file (test IPFS)
- [ ] Verify submission appears

#### 2. Voting System
- [ ] Navigate to voting phase contest
- [ ] Click vote on submission
- [ ] Enter vote amount
- [ ] Verify credibility-weighted calculation
- [ ] Check vote count updates

### Phase 4: Rewards System

#### 1. Reward Claims
- [ ] Navigate to Rewards page
- [ ] View available rewards
- [ ] Click "Claim" button
- [ ] Approve transaction
- [ ] Verify reward status updates

### Phase 5: Error Handling

#### 1. Network Issues
- [ ] Disconnect internet during actions
- [ ] Test error recovery
- [ ] Verify loading states

#### 2. Validation Errors
- [ ] Test form validation
- [ ] Test insufficient funds
- [ ] Test invalid addresses

### Phase 6: Responsive Testing

#### 1. Mobile Testing (< 768px)
- [ ] Test wallet connection
- [ ] Test contest creation
- [ ] Test voting interface
- [ ] Test file uploads

#### 2. Tablet Testing (768px - 1024px)
- [ ] Test all features
- [ ] Verify layout adaptation
- [ ] Test touch interactions

#### 3. Desktop Testing (> 1024px)
- [ ] Test full functionality
- [ ] Verify hover states
- [ ] Test keyboard navigation

## 🔍 Expected Results

### ✅ Success Indicators
- Smooth wallet connection flow
- Accurate Ethos score display
- Contest creation works for eligible users
- Voting calculations match credibility scores
- File uploads complete successfully
- Reward claims process correctly
- All responsive breakpoints work

### ⚠️ Known Limitations
- Ethos API may have delays (1-hour cache)
- IPFS uploads may timeout for large files
- Network congestion may affect transactions
- Some wallet connectors may have compatibility issues

## 🚀 Vercel Deployment

### Environment Variables for Vercel

In your Vercel dashboard, add these environment variables:

**Required Variables:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key
NEXT_PUBLIC_ETHOS_API_URL=https://api.ethos.network/api/v2
NEXT_PUBLIC_ETHOS_ORACLE_ADDRESS=0x43259Ac2952ae1583BDF0DC4756Eb86ec963ee39
NEXT_PUBLIC_TRUST_RACE_FACTORY=0xc6aFaF08b17C6Be52eF1927889D068Dc138974E8
```

### Deployment Steps

1. **Connect Repository**
   - Go to Vercel dashboard
   - Import GitHub repository
   - Select TrustRace project

2. **Configure Environment**
   - Add all environment variables above
   - Set build command: `npm run build`
   - Set output directory: `.next`

3. **Deploy**
   - Vercel will automatically deploy on git push
   - Custom domain can be added in settings

### Post-Deployment Testing

1. **Verify Deployment**
   - Check all pages load correctly
   - Test wallet connection
   - Verify Ethos integration

2. **Performance Testing**
   - Run Lighthouse audit
   - Test page load speeds
   - Verify mobile performance

3. **Security Testing**
   - Verify HTTPS
   - Check API key security
   - Test CORS configuration

## 📊 Test Results Documentation

Document your testing results:

- **Pass/Fail Status** for each test
- **Performance Metrics** (load times, scores)
- **Issues Found** with reproduction steps
- **Browser Compatibility** results
- **Mobile Testing** results

## 🎯 Success Criteria

The project is ready for production when:

- [ ] All core features work on development server
- [ ] Responsive design works on all devices
- [ ] Error handling works gracefully
- [ ] Performance meets standards (>90 Lighthouse)
- [ ] Security best practices followed
- [ ] Documentation complete
- [ ] Environment variables configured for production
