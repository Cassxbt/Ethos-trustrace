'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { EthosProfile } from '@/components/ethos/EthosProfile';
import { CredibilityScore } from '@/components/ethos/CredibilityScore';
import { useEthosScore } from '@/hooks/useEthosScore';

export default function EthosPage() {
  const { address, isConnected } = useAccount();
  const [searchAddress, setSearchAddress] = useState('');
  const [viewAddress, setViewAddress] = useState<string | undefined>();
  
  const { score: userScore, loading: scoreLoading } = useEthosScore(address);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      setViewAddress(searchAddress.trim());
    }
  };

  const handleViewOwnProfile = () => {
    setViewAddress(address);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ethos Dashboard</h1>
          <p className="text-gray-600 mb-8">Connect your wallet to view your Ethos profile and credibility score</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ethos Dashboard</h1>
          <p className="text-gray-600">View your Ethos credibility profile and explore the reputation ecosystem</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Profile</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter Ethereum address (0x...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {address && (
              <button
                type="button"
                onClick={handleViewOwnProfile}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View My Profile
              </button>
            )}
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User's Own Score */}
          {address && (
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Credibility Score</h2>
                <CredibilityScore 
                  address={address} 
                  showDetails={true}
                  compact={false}
                />
              </div>
              
              {/* Quick Stats */}
              {userScore && !scoreLoading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Voting Power:</span>
                      <span className="font-semibold text-gray-900">{userScore.votingPower}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Can Create Contests:</span>
                      <span className={`font-semibold ${userScore.canCreateContest ? 'text-green-600' : 'text-red-600'}`}>
                        {userScore.canCreateContest ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credibility Level:</span>
                      <span className="font-semibold text-gray-900">{userScore.level}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile View */}
          <div className={address ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {viewAddress ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {viewAddress === address ? 'Your Profile' : 'Profile'}
                  </h2>
                  {viewAddress !== address && (
                    <button
                      onClick={() => setViewAddress(address)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View Your Profile
                    </button>
                  )}
                </div>
                <EthosProfile address={viewAddress} showActions={viewAddress === address} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-500">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Selected</h3>
                  <p>Search for an address or view your own profile to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Credibility Scores</h3>
            <p className="text-gray-600 text-sm">
              Ethos credibility scores range from 0 to 2,800 and are calculated based on your on-chain reputation, 
              vouches received, and community interactions.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Voting Power</h3>
            <p className="text-gray-600 text-sm">
              Your credibility score determines your voting power in TrustRace contests. 
              Higher scores give you more influence on contest outcomes.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contest Creation</h3>
            <p className="text-gray-600 text-sm">
              You need a minimum credibility score of 1,400 (Neutral level) to create contests on TrustRace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
