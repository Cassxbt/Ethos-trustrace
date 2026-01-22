'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethosClient, ethosScoreCache, getCredibilityLevel } from '@/lib/ethos-client';

interface CredibilityScoreProps {
  address?: string;
  showLevel?: boolean;
  showDetails?: boolean;
  compact?: boolean;
}

export function CredibilityScore({ 
  address, 
  showLevel = true, 
  showDetails = false,
  compact = false 
}: CredibilityScoreProps) {
  const { address: connectedAddress } = useAccount();
  const [score, setScore] = useState<number | null>(null);
  const [level, setLevel] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetAddress = address || connectedAddress;

  useEffect(() => {
    if (!targetAddress) return;

    const fetchScore = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        const cachedScore = await ethosScoreCache.getScore(targetAddress);
        if (cachedScore !== null) {
          setScore(cachedScore);
          setLevel(getCredibilityLevel(cachedScore));
          setLoading(false);
          return;
        }

        // Fetch from API
        const apiScore = await ethosClient.getCredibilityScore(targetAddress);
        setScore(apiScore);
        setLevel(getCredibilityLevel(apiScore));
        
        // Cache the score
        ethosScoreCache.setScore(targetAddress, apiScore);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch credibility score');
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [targetAddress]);

  if (!targetAddress) {
    return <div className="text-gray-500">Connect wallet to view credibility score</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        <span className="text-gray-500">Loading score...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        <span className="font-medium">Error:</span> {error}
      </div>
    );
  }

  if (score === null) {
    return <div className="text-gray-500 text-sm">No score available</div>;
  }

  const getScoreColor = (score: number) => {
    if (score < 800) return 'text-red-600';
    if (score < 1200) return 'text-orange-600';
    if (score < 1400) return 'text-yellow-600';
    if (score < 1600) return 'text-blue-600';
    if (score < 1800) return 'text-green-600';
    if (score < 2000) return 'text-emerald-600';
    if (score < 2200) return 'text-teal-600';
    if (score < 2400) return 'text-purple-600';
    if (score < 2600) return 'text-indigo-600';
    return 'text-pink-600';
  };

  const getLevelColor = (level: string) => {
    if (level === 'Untrusted') return 'bg-red-100 text-red-800';
    if (level === 'Questionable') return 'bg-orange-100 text-orange-800';
    if (level === 'Neutral') return 'bg-yellow-100 text-yellow-800';
    if (level === 'Known') return 'bg-blue-100 text-blue-800';
    if (level === 'Established') return 'bg-green-100 text-green-800';
    if (level === 'Reputable') return 'bg-emerald-100 text-emerald-800';
    if (level === 'Exemplary') return 'bg-teal-100 text-teal-800';
    if (level === 'Distinguished') return 'bg-purple-100 text-purple-800';
    if (level === 'Revered') return 'bg-indigo-100 text-indigo-800';
    return 'bg-pink-100 text-pink-800';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${getScoreColor(score)}`}>
          {score.toLocaleString()}
        </span>
        {showLevel && (
          <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(level)}`}>
            {level}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Credibility Score</h3>
        {showLevel && (
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${getLevelColor(level)}`}>
            {level}
          </span>
        )}
      </div>
      
      <div className="text-3xl font-bold mb-2">
        <span className={getScoreColor(score)}>
          {score.toLocaleString()}
        </span>
        <span className="text-lg text-gray-500 ml-2">/ 2,800</span>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-mono text-gray-900">
              {targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Voting Power:</span>
            <span className="font-semibold text-gray-900">
              {Math.floor(score / 1000)}x
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Can Create Contests:</span>
            <span className={`font-semibold ${score >= 1400 ? 'text-green-600' : 'text-red-600'}`}>
              {score >= 1400 ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
