'use client';

import Link from 'next/link';
import { TierIndicator } from '@/components/trust/TierBadge';
import { VouchCount } from '@/components/trust/VouchCount';
import { useEthosScore } from '@/hooks/useEthosScore';
import { getTierFromScore } from '@/lib/reputation-tiers';

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
  topVoter?: { address: string; score: number };
}

interface ContestCardProps {
  contest: Contest;
  showCreator?: boolean;
  compact?: boolean;
}

export function ContestCard({ contest, showCreator = true, compact = false }: ContestCardProps) {
  const { score: creatorScore } = useEthosScore(contest.creator);
  const score = contest.creatorScore || creatorScore?.score || 0;
  const tier = getTierFromScore(score);

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

  const getStatusConfig = () => {
    if (isSubmissionPhase) return { className: 'status-live', text: 'Submissions Open', dot: true };
    if (isVotingPhase) return { className: 'status-pending', text: 'Voting Active', dot: true };
    return { className: 'status-ended', text: 'Ended', dot: false };
  };

  const status = getStatusConfig();

  // Compact card for grids
  if (compact) {
    return (
      <Link href={`/contests/${contest.id}`}>
        <div className="glass-panel spotlight-card p-5 cursor-pointer group hover-lift rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-white line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
              {contest.title}
            </h3>
            <span className={`status-badge ${status.className} ml-2`}>
              {status.dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
              {status.text}
            </span>
          </div>

          {/* Creator with tier */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-gray-500 font-mono text-xs">BY</span>
            <TierIndicator score={score} showScore={false} />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[var(--accent)] font-bold">
              {parseFloat(contest.rewardsPool).toFixed(2)} ETH
            </span>
            <span className="text-gray-500 text-sm font-mono">
              {formatTimeRemaining(isSubmissionPhase ? submissionDeadline : votingDeadline)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Full card with trust signals
  return (
    <Link href={`/contests/${contest.id}`}>
      <div className="glass-panel spotlight-card p-6 cursor-pointer group hover-lift rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
              {contest.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2">
              {contest.prompt}
            </p>
          </div>
          <span className={`status-badge ${status.className} ml-4`}>
            {status.dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
            {status.text}
          </span>
        </div>

        {/* Creator Trust Section */}
        {showCreator && (
          <div
            className="rounded-lg p-4 mb-5 border"
            style={{
              backgroundColor: `${tier.color}08`,
              borderColor: `${tier.color}20`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: tier.bgColor }}
                >
                  {tier.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white">
                      {formatAddress(contest.creator)}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                      style={{ backgroundColor: tier.bgColor, color: tier.color }}
                    >
                      {tier.displayName}
                    </span>
                  </div>
                  <VouchCount address={contest.creator} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Vote Power</div>
                <div className="font-bold text-lg" style={{ color: tier.color }}>
                  {tier.votePower}x
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Reward</div>
            <div className="font-bold text-[var(--accent)]">
              {parseFloat(contest.rewardsPool).toFixed(2)}
              <span className="text-xs ml-1 text-gray-400">ETH</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Entries</div>
            <div className="font-bold text-white">{contest.submissionCount}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Votes</div>
            <div className="font-bold text-white">
              {parseFloat(contest.totalWeightedVotes).toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Time</div>
            <div className="font-bold text-white">
              {formatTimeRemaining(isSubmissionPhase ? submissionDeadline : votingDeadline)}
            </div>
          </div>
        </div>

        {/* Min Credibility Requirement */}
        {contest.minCredibilityScore > 0 && (
          <div className="flex items-center gap-2 mb-5 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              Requires{' '}
              <span style={{ color: getTierFromScore(contest.minCredibilityScore).color }}>
                {getTierFromScore(contest.minCredibilityScore).displayName}
              </span>
              {' '}tier ({contest.minCredibilityScore}+)
            </span>
          </div>
        )}

        {/* Phase Footer */}
        <div className="border-t border-white/5 pt-4">
          {isSubmissionPhase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Submit your entry
              </span>
              <span className="text-sm font-mono text-green-500">
                {formatTimeRemaining(submissionDeadline)} left
              </span>
            </div>
          )}

          {isVotingPhase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Vote with your reputation
              </span>
              <span className="text-sm font-mono text-blue-400">
                {formatTimeRemaining(votingDeadline)} left
              </span>
            </div>
          )}

          {isEnded && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Contest ended
              </span>
              <span className="text-sm font-bold text-[var(--accent)]">
                View Results →
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
