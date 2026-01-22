'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface Reward {
  id: string;
  contestId: string;
  contestTitle: string;
  winnerAddress: string;
  amount: string;
  distributedAt: number;
  claimed: boolean;
}

interface RewardsDisplayProps {
  userAddress?: string;
}

export function RewardsDisplay({ userAddress }: RewardsDisplayProps) {
  const { address: connectedAddress } = useAccount();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState<Record<string, boolean>>({});

  const targetAddress = userAddress || connectedAddress;

  useEffect(() => {
    if (!targetAddress) return;

    const fetchRewards = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual Firebase/contract calls
        // const rewardsData = await rewardsService.getUserRewards(targetAddress);
        
        // Mock data for now
        const mockRewards: Reward[] = [
          {
            id: '1',
            contestId: '1',
            contestTitle: 'Best Meme of the Week',
            winnerAddress: targetAddress || '0x1234567890123456789012345678901234567890',
            amount: '0.5',
            distributedAt: Math.floor(Date.now() / 1000) - 3 * 24 * 60 * 60,
            claimed: false
          },
          {
            id: '2',
            contestId: '2',
            contestTitle: 'DeFi UI Design Challenge',
            winnerAddress: targetAddress || '0x1234567890123456789012345678901234567890',
            amount: '1.0',
            distributedAt: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60,
            claimed: true
          }
        ];

        setRewards(mockRewards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rewards');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [targetAddress]);

  const handleClaim = async (rewardId: string) => {
    setClaiming(prev => ({ ...prev, [rewardId]: true }));

    try {
      // TODO: Replace with actual contract call
      console.log('Claiming reward:', rewardId);
      
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state
      setRewards(prev => prev.map(reward =>
        reward.id === rewardId ? { ...reward, claimed: true } : reward
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward');
    } finally {
      setClaiming(prev => ({ ...prev, [rewardId]: false }));
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const totalEarned = rewards.reduce((sum, reward) => 
    sum + parseFloat(reward.amount), 0
  ).toFixed(3);

  const totalClaimed = rewards
    .filter(reward => reward.claimed)
    .reduce((sum, reward) => sum + parseFloat(reward.amount), 0)
    .toFixed(3);

  const totalUnclaimed = rewards
    .filter(reward => !reward.claimed)
    .reduce((sum, reward) => sum + parseFloat(reward.amount), 0)
    .toFixed(3);

  if (!targetAddress) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Wallet</h3>
        <p className="text-gray-600">
          Connect your wallet to view your rewards
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading rewards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <div className="text-red-600 mb-4">⚠️</div>
        <p className="text-gray-900 font-medium">Error loading rewards</p>
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Rewards</h2>
      
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{totalEarned}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalClaimed}</div>
          <div className="text-sm text-gray-600">Claimed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalUnclaimed}</div>
          <div className="text-sm text-gray-600">Unclaimed</div>
        </div>
      </div>

      {/* Rewards List */}
      {rewards.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4 text-4xl">🏆</div>
          <p className="text-gray-900 font-medium mb-2">No rewards yet</p>
          <p className="text-gray-600 text-sm">
            Participate in contests and win to earn rewards!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-4 rounded-lg border ${
                reward.claimed 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {reward.contestTitle}
                    </h4>
                    <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                      reward.claimed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reward.claimed ? 'Claimed' : 'Available'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Won on {formatDate(reward.distributedAt)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {parseFloat(reward.amount).toFixed(3)} ETH
                  </div>
                  
                  {!reward.claimed && (
                    <button
                      onClick={() => handleClaim(reward.id)}
                      disabled={claiming[reward.id]}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        claiming[reward.id]
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {claiming[reward.id] ? 'Claiming...' : 'Claim'}
                    </button>
                  )}
                  
                  {reward.claimed && (
                    <div className="text-sm text-green-600 font-medium">
                      ✓ Claimed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">About Rewards</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• Rewards are automatically distributed to contest winners</li>
          <li>• You must claim your rewards to receive them in your wallet</li>
          <li>• Rewards are held in the contest contract until claimed</li>
          <li>• All rewards are paid in ETH (or specified token)</li>
        </ul>
      </div>
    </div>
  );
}
