'use client';

import { useState } from 'react';
import { ContestCard } from './ContestCard';

interface Contest {
  id: string;
  title: string;
  prompt: string;
  creator: string;
  submissionDeadline: number;
  votingDeadline: number;
  rewardsPool: string;
  minCredibilityScore: number;
  isActive: boolean;
  submissionCount: number;
  totalVotes: string;
  totalWeightedVotes: string;
  createdAt: number;
  creatorScore?: number;
}

interface ContestListProps {
  contests: Contest[];
  loading?: boolean;
  error?: string | null;
  title?: string;
}

export function ContestList({
  contests,
  loading = false,
  error = null,
  title = 'Contests',
}: ContestListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rewards' | 'deadline'>('newest');

  const filteredAndSortedContests = contests
    .filter((contest) => {
      if (filter === 'active') return contest.isActive;
      if (filter === 'ended') return !contest.isActive;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'rewards':
          return parseFloat(b.rewardsPool) - parseFloat(a.rewardsPool);
        case 'deadline':
          return a.submissionDeadline - b.submissionDeadline;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--foreground-muted)]">Loading contests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <p className="text-[var(--foreground)] font-medium">Error loading contests</p>
          <p className="text-[var(--foreground-muted)] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (contests.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-[var(--foreground-muted)] mb-4 text-4xl">📋</div>
          <p className="text-[var(--foreground)] font-medium mb-2">No contests found</p>
          <p className="text-[var(--foreground-muted)] text-sm">
            Be the first to create a contest and start the competition!
          </p>
        </div>
      </div>
    );
  }

  const FilterButton = ({
    label,
    isActive,
    onClick,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
        isActive
          ? 'bg-[var(--accent-primary)] text-white'
          : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">{title}</h2>
        <div className="text-sm text-[var(--foreground-muted)]">
          {filteredAndSortedContests.length} contest
          {filteredAndSortedContests.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <div className="card-dark p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Filter */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <FilterButton
                label="All"
                isActive={filter === 'all'}
                onClick={() => setFilter('all')}
              />
              <FilterButton
                label="Active"
                isActive={filter === 'active'}
                onClick={() => setFilter('active')}
              />
              <FilterButton
                label="Ended"
                isActive={filter === 'ended'}
                onClick={() => setFilter('ended')}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
              Sort By
            </label>
            <div className="flex gap-2">
              <FilterButton
                label="Newest"
                isActive={sortBy === 'newest'}
                onClick={() => setSortBy('newest')}
              />
              <FilterButton
                label="Rewards"
                isActive={sortBy === 'rewards'}
                onClick={() => setSortBy('rewards')}
              />
              <FilterButton
                label="Deadline"
                isActive={sortBy === 'deadline'}
                onClick={() => setSortBy('deadline')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedContests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>

      {/* No results for filter */}
      {filteredAndSortedContests.length === 0 && contests.length > 0 && (
        <div className="text-center py-12">
          <div className="text-[var(--foreground-muted)] mb-4 text-4xl">🔍</div>
          <p className="text-[var(--foreground)] font-medium mb-2">
            No contests match your filters
          </p>
          <p className="text-[var(--foreground-muted)] text-sm">
            Try adjusting your filter or sort criteria
          </p>
        </div>
      )}
    </div>
  );
}
