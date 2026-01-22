'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { ethosClient, ethosScoreCache } from '@/lib/ethos-client';

export interface EthosScoreData {
  score: number;
  level: string;
  votingPower: number;
  canCreateContest: boolean;
  lastUpdated: number;
}

export interface UseEthosScoreReturn {
  score: EthosScoreData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  invalidateCache: () => void;
}

export function useEthosScore(address?: string): UseEthosScoreReturn {
  const { address: connectedAddress } = useAccount();
  const [score, setScore] = useState<EthosScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetAddress = address || connectedAddress;

  const calculateVotingPower = (score: number): number => {
    return Math.floor(score / 1000);
  };

  const getCredibilityLevel = (score: number): string => {
    if (score < 800) return 'Untrusted';
    if (score < 1200) return 'Questionable';
    if (score < 1400) return 'Neutral';
    if (score < 1600) return 'Known';
    if (score < 1800) return 'Established';
    if (score < 2000) return 'Reputable';
    if (score < 2200) return 'Exemplary';
    if (score < 2400) return 'Distinguished';
    if (score < 2600) return 'Revered';
    return 'Renowned';
  };

  const fetchScore = useCallback(async () => {
    if (!targetAddress) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedScore = await ethosScoreCache.getScore(targetAddress);
      if (cachedScore !== null) {
        const scoreData: EthosScoreData = {
          score: cachedScore,
          level: getCredibilityLevel(cachedScore),
          votingPower: calculateVotingPower(cachedScore),
          canCreateContest: cachedScore >= 1400,
          lastUpdated: Date.now()
        };
        setScore(scoreData);
        setLoading(false);
        return;
      }

      // Fetch from API
      const apiScore = await ethosClient.getCredibilityScore(targetAddress);
      const scoreData: EthosScoreData = {
        score: apiScore,
        level: getCredibilityLevel(apiScore),
        votingPower: calculateVotingPower(apiScore),
        canCreateContest: apiScore >= 1400,
        lastUpdated: Date.now()
      };
      
      setScore(scoreData);
      
      // Cache the score
      ethosScoreCache.setScore(targetAddress, apiScore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credibility score');
    } finally {
      setLoading(false);
    }
  }, [targetAddress]);

  const invalidateCache = useCallback(() => {
    if (targetAddress) {
      ethosScoreCache.invalidate(targetAddress);
    }
  }, [targetAddress]);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  return {
    score,
    loading,
    error,
    refetch: fetchScore,
    invalidateCache
  };
}
