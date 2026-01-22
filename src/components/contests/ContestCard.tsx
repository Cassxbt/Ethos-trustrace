'use client';

import Link from 'next/link';
import { TierIndicator } from '@/components/trust/TierBadge';
import { VouchCount } from '@/components/trust/VouchCount';
import { useEthosScore } from '@/hooks/useEthosScore';
import { getTierFromScore, getVotePower } from '@/lib/reputation-tiers';

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
  // Optional trust data
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

  const getStatusStyles = () => {
    if (isSubmissionPhase) return { bg: 'rgba(52, 211, 153, 0.15)', color: '#34D399', text: 'Submissions Open' };
    if (isVotingPhase) return { bg: 'rgba(96, 165, 250, 0.15)', color: '#60A5FA', text: 'Voting Active' };
    return { bg: 'rgba(156, 163, 175, 0.15)', color: '#9CA3AF', text: 'Ended' };
  };

  const status = getStatusStyles();

  // Compact card for grids
  if (compact) {
    return (
      <Link href={`/contests/${contest.id}`}>
        <div className="card-dark p-4 hover:border-[var(--accent-primary)] cursor-pointer group">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--accent-primary)] transition-colors">
              {contest.title}
            </h3>
            <span
              className="text-xs px-2 py-1 rounded-full font-medium ml-2 whitespace-nowrap"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              {status.text}
            </span>
          </div>

          {/* Creator with tier */}
          <div className="flex items-center gap-2 mb-3 text-sm">
            <span className="text-[var(--foreground-muted)]">by</span>
            <TierIndicator score={score} showScore={false} />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--accent-secondary)] font-semibold">
              {parseFloat(contest.rewardsPool).toFixed(2)} ETH
            </span>
            <span className="text-[var(--foreground-muted)]">
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
      <div className="card-dark p-6 hover:border-[var(--accent-primary)] cursor-pointer group">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors">
              {contest.title}
            </h3>
            <p className="text-[var(--foreground-muted)] text-sm line-clamp-2">
              {contest.prompt}
            </p>
          </div>
          <span
            className="text-xs px-3 py-1 rounded-full font-medium ml-4 whitespace-nowrap"
            style={{ backgroundColor: status.bg, color: status.color }}
          >
            {status.text}
          </span>
        </div>

        {/* Creator Trust Section - THE SURGICAL DIFFERENTIATION */}
        {showCreator && (
          <div
            className="rounded-lg p-3 mb-4"
            style={{ backgroundColor: tier.bgColor, border: `1px solid ${tier.color}20` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{tier.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[var(--foreground)]">
                      {formatAddress(contest.creator)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                    >
                      {tier.displayName}
                    </span>
                  </div>
                  <VouchCount address={contest.creator} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--foreground-muted)]">Vote Power</div>
                <div className="font-bold" style={{ color: tier.color }}>
                  {tier.votePower}x
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-[var(--foreground-muted)] mb-1">Reward</div>
            <div className="font-semibold text-[var(--accent-secondary)]">
              {parseFloat(contest.rewardsPool).toFixed(2)} ETH
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--foreground-muted)] mb-1">Entries</div>
            <div className="font-semibold text-[var(--foreground)]">{contest.submissionCount}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--foreground-muted)] mb-1">Votes</div>
            <div className="font-semibold text-[var(--foreground)]">
              {parseFloat(contest.totalWeightedVotes).toFixed(1)}
              <span className="text-xs text-[var(--foreground-muted)] ml-1">weighted</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--foreground-muted)] mb-1">Time Left</div>
            <div className="font-semibold text-[var(--foreground)]">
              {formatTimeRemaining(isSubmissionPhase ? submissionDeadline : votingDeadline)}
            </div>
          </div>
        </div>

        {/* Min Credibility Requirement */}
        {contest.minCredibilityScore > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs text-[var(--foreground-muted)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              Requires{' '}
              <span style={{ color: getTierFromScore(contest.minCredibilityScore).color }}>
                {getTierFromScore(contest.minCredibilityScore).displayName}
              </span>
              {' '}tier ({contest.minCredibilityScore}+) to participate
            </span>
          </div>
        )}

        {/* Phase Footer */}
        <div className="border-t border-[var(--border-color)] pt-4">
          {isSubmissionPhase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">
                Submit your entry
              </span>
              <span className="text-sm font-medium" style={{ color: '#34D399' }}>
                {formatTimeRemaining(submissionDeadline)} left
              </span>
            </div>
          )}

          {isVotingPhase && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">
                Vote with your reputation
              </span>
              <span className="text-sm font-medium" style={{ color: '#60A5FA' }}>
                {formatTimeRemaining(votingDeadline)} left
              </span>
            </div>
          )}

          {isEnded && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">
                Contest ended
              </span>
              <span className="text-sm font-medium text-[var(--accent-primary)]">
                View Results →
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
