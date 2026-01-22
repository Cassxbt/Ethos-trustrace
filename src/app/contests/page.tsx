'use client';

import { useState, useEffect } from 'react';
import { ContestList } from '@/components/contests/ContestList';
import { Contest, getContests } from '@/services/contest-service';

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen py-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            Contests
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Discover and participate in reputation-weighted contests
          </p>
        </div>

        {/* Info Banner */}
        <div
          className="card-dark p-4 mb-8 flex items-start gap-4"
          style={{ borderColor: 'var(--accent-primary)30' }}
        >
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-[var(--foreground)] mb-1">
              How Voting Works
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Your vote power is determined by your Ethos reputation tier.{' '}
              <span className="tier-observer">Observers</span> have 0.5x,{' '}
              <span className="tier-voter">Voters</span> have 1x,{' '}
              <span className="tier-creator">Creators</span> have 2x, and{' '}
              <span className="tier-curator">Curators</span> have 3x voting power.
            </p>
          </div>
        </div>

        <ContestList contests={contests} loading={loading} error={error} />
      </div>
    </div>
  );
}
