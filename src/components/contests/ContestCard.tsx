'use client';

import Link from 'next/link';
import { CredibilityScore } from '@/components/ethos/CredibilityScore';

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

interface ContestCardProps {
  contest: Contest;
  showCreator?: boolean;
  compact?: boolean;
}

export function ContestCard({ contest, showCreator = true, compact = false }: ContestCardProps) {
  const now = Date.now();
  const submissionDeadline = contest.submissionDeadline * 1000;
  const votingDeadline = contest.votingDeadline * 1000;
  
  const isSubmissionPhase = now < submissionDeadline;
  const isVotingPhase = now >= submissionDeadline && now < votingDeadline;
  const isEnded = now >= votingDeadline;
  
  const formatTimeRemaining = (timestamp: number) => {
    const diff = timestamp - now;
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = () => {
    if (isSubmissionPhase) return 'bg-green-100 text-green-800';
    if (isVotingPhase) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (isSubmissionPhase) return 'Submissions Open';
    if (isVotingPhase) return 'Voting Active';
    return 'Ended';
  };

  if (compact) {
    return (
      <Link href={`/contests/${contest.id}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{contest.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{parseFloat(contest.rewardsPool).toFixed(2)} ETH</span>
            <span>{formatTimeRemaining(isSubmissionPhase ? submissionDeadline : votingDeadline)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/contests/${contest.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {contest.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {contest.prompt}
            </p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor()} ml-4`}>
            {getStatusText()}
          </span>
        </div>

        {/* Creator and Requirements */}
        {showCreator && (
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Creator:</span>
              <span className="font-mono text-gray-900">{formatAddress(contest.creator)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Min Score:</span>
              <CredibilityScore address={contest.creator} compact />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-600">Reward Pool</div>
            <div className="font-semibold text-gray-900">
              {parseFloat(contest.rewardsPool).toFixed(3)} ETH
            </div>
          </div>
          <div>
            <div className="text-gray-600">Submissions</div>
            <div className="font-semibold text-gray-900">{contest.submissionCount}</div>
          </div>
          <div>
            <div className="text-gray-600">Total Votes</div>
            <div className="font-semibold text-gray-900">{parseFloat(contest.totalVotes).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-600">Time Left</div>
            <div className="font-semibold text-gray-900">
              {formatTimeRemaining(isSubmissionPhase ? submissionDeadline : votingDeadline)}
            </div>
          </div>
        </div>

        {/* Phase-specific info */}
        <div className="border-t border-gray-200 pt-4">
          {isSubmissionPhase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Submit your entry before the deadline
              </span>
              <span className="text-sm font-medium text-green-600">
                {formatTimeRemaining(submissionDeadline)} left to submit
              </span>
            </div>
          )}
          
          {isVotingPhase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Vote for your favorite submissions
              </span>
              <span className="text-sm font-medium text-blue-600">
                {formatTimeRemaining(votingDeadline)} left to vote
              </span>
            </div>
          )}
          
          {isEnded && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Contest has ended
              </span>
              <span className="text-sm font-medium text-gray-600">
                View results
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
