# TrustRace Vercel Deployment - Simple Guide

## 🎯 Only 4 Environment Variables Needed

### 1. Firebase (Required for database)
**How to get:**
1. Go to https://console.firebase.google.com
2. Create new project (or use existing)
3. Go to Project Settings → General
4. Scroll to "Your apps" → Add web app
5. Copy the config values

**You'll get these 6 values:**
- apiKey
- authDomain  
- projectId
- storageBucket
- messagingSenderId
- appId

### 2. WalletConnect (Required for wallet connection)
**How to get:**
1. Go to https://walletconnect.com
2. Sign up for free
3. Create new project
4. Copy the Project ID

### 3. Alchemy RPC (Required for blockchain)
**How to get:**
1. Go to https://alchemy.com
2. Sign up for free
3. Create new app
4. Select Base Sepolia network
5. Copy the RPC URL

### 4. Contract Addresses (I provide these)
```
NEXT_PUBLIC_ETHOS_ORACLE_ADDRESS=0x43259Ac2952ae1583BDF0DC4756Eb86ec963ee39
NEXT_PUBLIC_TRUST_RACE_FACTORY=0xc6aFaF08b17C6Be52eF1927889D068Dc138974E8
```

## 🚀 Vercel Deployment Steps

### Step 1: Get Your API Keys

**Firebase (5 minutes):**
1. Go to https://console.firebase.google.com
2. Click "Create a project" 
3. Name it "trustrace" 
4. Enable Google Analytics (optional)
5. Wait for project creation
6. Go to Project Settings (gear icon)
7. Click "Add app" → Web app
8. Name it "TrustRace Web"
9. Copy all 6 config values

**WalletConnect (2 minutes):**
1. Go to https://walletconnect.com
2. Click "Get Started"
3. Sign up with email
4. Go to Dashboard → Create new project
5. Name it "TrustRace"
6. Copy the Project ID

**Alchemy (3 minutes):**
1. Go to https://alchemy.com
2. Sign up with email
3. Click "Create new app"
4. Name it "TrustRace"
5. Select "Base" network
6. Copy the RPC URL

### Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project:**
   - Click "New Project"
   - Import from GitHub
   - Find "Ethos-trustrace" repository
   - Click "Import"

3. **Configure Build:**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables:**
   In Vercel dashboard, go to Project Settings → Environment Variables
   
   Add these **exact** variables:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=your_alchemy_rpc_url
   NEXT_PUBLIC_ETHOS_ORACLE_ADDRESS=0x43259Ac2952ae1583BDF0DC4756Eb86ec963ee39
   NEXT_PUBLIC_TRUST_RACE_FACTORY=0xc6aFaF08b17C6Be52eF1927889D068Dc138974E8
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL!

## ✅ That's It!

Your TrustRace app will be live with:
- ✅ Wallet connection working
- ✅ Database functionality  
- ✅ Blockchain integration
- ✅ All contest features

## 🆘 Need Help?

If any step doesn't work:
1. Firebase: Check project settings
2. WalletConnect: Verify project ID
3. Alchemy: Make sure Base network selected
4. Vercel: Check build logs for errors

The app will work on Base Sepolia testnet - no real money needed!
