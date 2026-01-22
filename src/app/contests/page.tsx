'use client';

import { useState, useEffect } from 'react';
import { ContestList } from '@/components/contests/ContestList';

// Mock data for now - will be replaced with Firebase/contract calls
const mockContests = [
  {
    id: '1',
    title: 'Best Meme of the Week',
    prompt: 'Create the funniest meme about Web3 and decentralized systems',
    creator: '0x1234567890123456789012345678901234567890',
    submissionDeadline: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // 3 days from now
    votingDeadline: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60, // 6 days from now
    rewardsPool: '0.5',
    minCredibilityScore: 1200,
    isActive: true,
    submissionCount: 12,
    totalVotes: '2.5',
    totalWeightedVotes: '5.2',
    createdAt: Math.floor(Date.now() / 1000) - 24 * 60 * 60 // 1 day ago
  },
  {
    id: '2',
    title: 'DeFi UI Design Challenge',
    prompt: 'Design a beautiful and intuitive interface for a DeFi protocol',
    creator: '0x2345678901234567890123456789012345678901',
    submissionDeadline: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60, // 5 days from now
    votingDeadline: Math.floor(Date.now() / 1000) + 8 * 24 * 60 * 60, // 8 days from now
    rewardsPool: '1.0',
    minCredibilityScore: 1400,
    isActive: true,
    submissionCount: 8,
    totalVotes: '1.8',
    totalWeightedVotes: '4.1',
    createdAt: Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60 // 2 days ago
  },
  {
    id: '3',
    title: 'Smart Contract Security Tips',
    prompt: 'Share your best security tip for Solidity smart contract development',
    creator: '0x3456789012345678901234567890123456789012',
    submissionDeadline: Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60, // 2 days ago
    votingDeadline: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 1 day ago
    rewardsPool: '0.3',
    minCredibilityScore: 800,
    isActive: false,
    submissionCount: 15,
    totalVotes: '3.2',
    totalWeightedVotes: '7.8',
    createdAt: Math.floor(Date.now() / 1000) - 5 * 24 * 60 * 60 // 5 days ago
  }
];

export default function ContestsPage() {
  const [contests, setContests] = useState(mockContests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, this would fetch from Firebase and smart contracts
  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // TODO: Replace with actual Firebase/contract calls
        // const contestsData = await contestsService.getContests();
        // setContests(contestsData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contests');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contests</h1>
          <p className="text-gray-600">
            Discover and participate in credibility-weighted contests
          </p>
        </div>

        <ContestList 
          contests={contests}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
