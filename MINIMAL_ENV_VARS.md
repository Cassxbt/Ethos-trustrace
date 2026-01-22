# TrustRace - Only 5 Environment Variables Needed

## ✅ What's Actually Used in Your Code

After checking your codebase, you ONLY need these 5 variables:

### 1. Firebase (3 variables)
```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ethos-dfcb1
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCMmitBqV0r47vD2YZNlhJOzyDtSBiMrjA
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ethos-dfcb1.firebasestorage.app
```
**Used in:** `src/lib/firebase.ts`

### 2. WalletConnect (1 variable)
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=39bb4b3dd9267a1c061c5e5797c4aca5
```
**Used in:** `src/lib/wagmi.ts`

### 3. Alchemy (1 variable)
```env
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/V8NXfy4rs-SyVwJKKe8-9
```
**Used in:** `src/lib/wagmi.ts`

## ❌ NOT Needed (Already Hardcoded)

These are already in your code:
- Contract addresses (in `src/lib/ethos-contracts.ts`)
- Other Firebase config values (not used)

## 🚀 Vercel Deployment - Add Only These 5 Variables

In Vercel dashboard, add ONLY these:

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ethos-dfcb1
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCMmitBqV0r47vD2YZNlhJOzyDtSBiMrjA
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ethos-dfcb1.firebasestorage.app
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=39bb4b3dd9267a1c061c5e5797c4aca5
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/V8NXfy4rs-SyVwJKKe8-9
```

That's it! Your app will work perfectly.
