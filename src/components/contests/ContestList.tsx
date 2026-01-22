'use client';

import { useState, useEffect } from 'react';
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
}

interface ContestListProps {
  contests: Contest[];
  loading?: boolean;
  error?: string | null;
  title?: string;
}

export function ContestList({ contests, loading = false, error = null, title = 'Contests' }: ContestListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'ended'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rewards' | 'deadline'>('newest');

  const filteredAndSortedContests = contests
    .filter(contest => {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-gray-900 font-medium">Error loading contests</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (contests.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-gray-400 mb-4 text-4xl">📋</div>
          <p className="text-gray-900 font-medium mb-2">No contests found</p>
          <p className="text-gray-600 text-sm">
            Be the first to create a contest and start the competition!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-600">
          {contests.length} contest{contests.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
            <div className="flex gap-2">
              {(['all', 'active', 'ended'] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    filter === filterOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex gap-2">
              {(['newest', 'rewards', 'deadline'] as const).map((sortOption) => (
                <button
                  key={sortOption}
                  onClick={() => setSortBy(sortOption)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    sortBy === sortOption
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedContests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>

      {/* No results for filter */}
      {filteredAndSortedContests.length === 0 && contests.length > 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 text-4xl">🔍</div>
          <p className="text-gray-900 font-medium mb-2">No contests match your filters</p>
          <p className="text-gray-600 text-sm">
            Try adjusting your filter or sort criteria
          </p>
        </div>
      )}
    </div>
  );
}
