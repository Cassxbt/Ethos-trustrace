'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContestList } from '@/components/contests/ContestList';
import { Contest, getContests } from '@/services/contest-service';

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.spotlight-card').forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchContests = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getContests();
        setContests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contests');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8">
          <div>
            <span className="text-[var(--accent)] font-mono text-xs tracking-widest block mb-2">
              /// ACTIVE COMPETITIONS
            </span>
            <h1 className="font-bold text-white text-4xl md:text-5xl">
              Contests
            </h1>
            <p className="text-gray-400 mt-2">
              Discover and participate in reputation-weighted contests
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/create" className="btn-primary">
              Create Contest
            </Link>
          </div>
        </div>

        {/* Info Banner */}
        <div className="glass-panel p-6 mb-10 flex items-start gap-4 rounded-xl">
          <div className="w-10 h-10 bg-[var(--accent)]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">
              How Voting Works
            </h3>
            <p className="text-sm text-gray-400">
              Your vote power is determined by your Ethos reputation tier.{' '}
              <span className="tier-observer font-medium">Observers</span> have 0.5x,{' '}
              <span className="tier-voter font-medium">Voters</span> have 1x,{' '}
              <span className="tier-creator font-medium">Creators</span> have 2x, and{' '}
              <span className="tier-curator font-medium">Curators</span> have 3x voting power.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Total Contests</div>
            <div className="font-bold text-2xl text-white">{contests.length}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Active Now</div>
            <div className="font-bold text-2xl text-green-500">
              {contests.filter(c => c.isActive && Date.now() < c.votingDeadline * 1000).length}
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Total Rewards</div>
            <div className="font-bold text-2xl text-[var(--accent)]">
              {contests.reduce((sum, c) => sum + parseFloat(c.rewardsPool || '0'), 0).toFixed(2)} ETH
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Total Entries</div>
            <div className="font-bold text-2xl text-white">
              {contests.reduce((sum, c) => sum + (c.submissionCount || 0), 0)}
            </div>
          </div>
        </div>

        <ContestList contests={contests} loading={loading} error={error} />
      </div>
    </div>
  );
}
