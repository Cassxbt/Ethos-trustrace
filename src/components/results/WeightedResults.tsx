'use client';

import { TierIndicator, TierDot } from '@/components/trust/TierBadge';
import {
  getTierFromScore,
  getVotePower,
  calculateWeightedVotes,
  calculateTrustConfidence,
  getTrustConfidenceLabel,
  getVoteBreakdownByTier,
  REPUTATION_TIERS,
} from '@/lib/reputation-tiers';

interface Voter {
  address: string;
  score: number;
  amount: number;
  ens?: string;
}

interface Submission {
  id: string;
  submitter: string;
  submitterScore: number;
  contentURI: string;
  title?: string;
  rawVotes: number;
  voters: Voter[];
}

interface WeightedResultsProps {
  submissions: Submission[];
  showBreakdown?: boolean;
  maxTopVoters?: number;
}

export function WeightedResults({
  submissions,
  showBreakdown = true,
  maxTopVoters = 5,
}: WeightedResultsProps) {
  const rankedSubmissions = submissions
    .map((sub) => {
      const votes = sub.voters.map((v) => ({ voterScore: v.score, amount: v.amount }));
      const weightedVotes = calculateWeightedVotes(votes);
      const trustConfidence = calculateTrustConfidence(votes);

      return {
        ...sub,
        weightedVotes,
        trustConfidence,
      };
    })
    .sort((a, b) => b.weightedVotes - a.weightedVotes);

  const winner = rankedSubmissions[0];

  if (!winner) {
    return (
      <div className="card-dark p-6 text-center">
        <p className="text-[var(--foreground-muted)]">No submissions yet</p>
      </div>
    );
  }

  const allVotes = submissions.flatMap((s) =>
    s.voters.map((v) => ({ voterScore: v.score, amount: v.amount }))
  );
  const overallBreakdown = getVoteBreakdownByTier(allVotes);
  const overallConfidence = calculateTrustConfidence(allVotes);
  const confidenceLabel = getTrustConfidenceLabel(overallConfidence);

  return (
    <div className="space-y-6">
      <div
        className="card-dark p-6"
        style={{
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)',
          borderColor: 'rgba(251, 191, 36, 0.3)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏆</span>
          <h3 className="text-xl font-bold text-[var(--accent-secondary)]">Winner</h3>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            {winner.title || `Submission #${winner.id}`}
          </h4>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--foreground-muted)]">by</span>
            <TierIndicator score={winner.submitterScore} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--background-tertiary)' }}>
          <div>
            <div className="text-xs text-[var(--foreground-muted)] mb-1">Raw Votes</div>
            <div className="text-2xl font-bold text-[var(--foreground)]">{winner.rawVotes}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--foreground-muted)] mb-1">Weighted Votes</div>
            <div className="text-2xl font-bold text-[var(--accent-primary)]">
              {winner.weightedVotes.toFixed(1)}
            </div>
          </div>
        </div>

        {winner.voters.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
              Top Supporters
            </h5>
            <div className="space-y-2">
              {winner.voters
                .sort((a, b) => b.score - a.score)
                .slice(0, maxTopVoters)
                .map((voter, i) => {
                  const tier = getTierFromScore(voter.score);
                  const power = getVotePower(voter.score);
                  return (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{tier.icon}</span>
                        <span className="font-mono text-[var(--foreground)]">
                          {voter.ens || `${voter.address.slice(0, 6)}...${voter.address.slice(-4)}`}
                        </span>
                        <span className="text-xs" style={{ color: tier.color }}>
                          ({tier.displayName})
                        </span>
                      </div>
                      <span className="text-[var(--foreground-muted)]">{power}x vote</span>
                    </div>
                  );
                })}
              {winner.voters.length > maxTopVoters && (
                <p className="text-xs text-[var(--foreground-muted)]">
                  + {winner.voters.length - maxTopVoters} more voters
                </p>
              )}
            </div>
          </div>
        )}

        <div
          className="p-3 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: `${confidenceLabel.color}15` }}
        >
          <span className="text-lg">💡</span>
          <div>
            <div className="text-sm font-medium" style={{ color: confidenceLabel.color }}>
              {confidenceLabel.label}
            </div>
            <div className="text-xs text-[var(--foreground-muted)]">
              {winner.trustConfidence}% of weighted votes from Creator+ tier users
            </div>
          </div>
        </div>
      </div>

      {rankedSubmissions.length > 1 && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Other Submissions</h3>
          <div className="space-y-3">
            {rankedSubmissions.slice(1).map((sub, i) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--background-tertiary)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg text-[var(--foreground-muted)]">#{i + 2}</span>
                  <div>
                    <div className="font-medium text-[var(--foreground)]">
                      {sub.title || `Submission #${sub.id}`}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <TierDot score={sub.submitterScore} />
                      <span className="text-[var(--foreground-muted)]">
                        {sub.rawVotes} raw / {sub.weightedVotes.toFixed(1)} weighted
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[var(--accent-primary)]">
                    {sub.weightedVotes.toFixed(1)}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">weighted</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBreakdown && (
        <div className="card-dark p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            📊 Vote Quality Breakdown
          </h3>

          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--background-tertiary)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--foreground-muted)]">Overall Trust Confidence</span>
              <span className="font-bold" style={{ color: confidenceLabel.color }}>
                {overallConfidence}%
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${overallConfidence}%`,
                  backgroundColor: confidenceLabel.color,
                  boxShadow: `0 0 10px ${confidenceLabel.color}`,
                }}
              />
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-2">
              {confidenceLabel.label} - {overallConfidence >= 50 ? 'Majority' : 'Less than half'} of
              voting power from Creator+ tier users
            </p>
          </div>

          <div className="space-y-3">
            {overallBreakdown.map(({ tier, voteCount, weightedVotes, percentage }) => (
              <div key={tier.name} className="flex items-center gap-3">
                <div className="w-28 flex items-center gap-2">
                  <span>{tier.icon}</span>
                  <span className="text-sm" style={{ color: tier.color }}>
                    {tier.displayName}
                  </span>
                </div>
                <div className="flex-1">
                  <div
                    className="h-4 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--background-tertiary)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: tier.color,
                        boxShadow: `0 0 8px ${tier.glowColor}`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-sm font-medium" style={{ color: tier.color }}>
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
            <p className="text-xs text-[var(--foreground-muted)]">
              Higher tier percentages indicate more trustworthy results. Results dominated by
              Observer-tier votes may be susceptible to manipulation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrustConfidenceBadge({
  votes,
}: {
  votes: { voterScore: number; amount: number }[];
}) {
  const confidence = calculateTrustConfidence(votes);
  const { label, color } = getTrustConfidenceLabel(confidence);

  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label} ({confidence}%)
    </span>
  );
}
