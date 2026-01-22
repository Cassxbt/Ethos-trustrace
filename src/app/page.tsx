'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center py-12">
      <main className="flex flex-col items-center justify-center gap-8 p-8 text-center max-w-4xl">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            TrustRace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Credibility-weighted contest platform powered by Ethos
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Connect Your Wallet to Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Join contests where your credibility score from Ethos gives you greater voting power and access to exclusive features.
            </p>
            <ConnectButton />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">Credibility-Weighted Voting</h3>
            <p className="text-gray-600 text-sm mb-4">Your Ethos credibility score determines your voting power</p>
            <Link 
              href="/ethos" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Learn More →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">Vouch-Gated Creation</h3>
            <p className="text-gray-600 text-sm mb-4">Create contests with high credibility requirements</p>
            <Link 
              href="/create" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Create Contest →
            </Link>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="font-semibold text-gray-800 mb-2">Reputation Rewards</h3>
            <p className="text-gray-600 text-sm mb-4">Earn rewards based on your credibility contributions</p>
            <Link 
              href="/contests" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Browse Contests →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
