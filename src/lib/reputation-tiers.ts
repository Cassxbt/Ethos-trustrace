export type TierName = 'observer' | 'voter' | 'creator' | 'curator';

export interface ReputationTier {
  name: TierName;
  displayName: string;
  icon: string;
  minScore: number;
  maxScore: number;
  votePower: number;
  permissions: string[];
  color: string;
  bgColor: string;
  glowColor: string;
}

export const REPUTATION_TIERS: Record<TierName, ReputationTier> = {
  observer: {
    name: 'observer',
    displayName: 'Observer',
    icon: '👁️',
    minScore: 0,
    maxScore: 799,
    votePower: 0.5,
    permissions: ['Browse contests', 'Vote with 0.5x power'],
    color: '#9CA3AF', // gray-400
    bgColor: 'rgba(156, 163, 175, 0.1)',
    glowColor: 'rgba(156, 163, 175, 0.3)',
  },
  voter: {
    name: 'voter',
    displayName: 'Voter',
    icon: '🗳️',
    minScore: 800,
    maxScore: 1399,
    votePower: 1.0,
    permissions: ['Vote with 1x power', 'Submit to contests', 'View analytics'],
    color: '#60A5FA', // blue-400
    bgColor: 'rgba(96, 165, 250, 0.1)',
    glowColor: 'rgba(96, 165, 250, 0.3)',
  },
  creator: {
    name: 'creator',
    displayName: 'Creator',
    icon: '✍️',
    minScore: 1400,
    maxScore: 1999,
    votePower: 2.0,
    permissions: ['Create contests', 'Vote with 2x power', 'Featured in Trusted Creators'],
    color: '#34D399', // emerald-400
    bgColor: 'rgba(52, 211, 153, 0.1)',
    glowColor: 'rgba(52, 211, 153, 0.3)',
  },
  curator: {
    name: 'curator',
    displayName: 'Curator',
    icon: '⭐',
    minScore: 2000,
    maxScore: Infinity,
    votePower: 3.0,
    permissions: ['Vote with 3x power', 'Feature other contests', 'Gold badge', 'Top Curators leaderboard'],
    color: '#FBBF24', // amber-400
    bgColor: 'rgba(251, 191, 36, 0.1)',
    glowColor: 'rgba(251, 191, 36, 0.4)',
  },
};

export function getTierFromScore(score: number): ReputationTier {
  if (score >= 2000) return REPUTATION_TIERS.curator;
  if (score >= 1400) return REPUTATION_TIERS.creator;
  if (score >= 800) return REPUTATION_TIERS.voter;
  return REPUTATION_TIERS.observer;
}

export function getVotePower(score: number): number {
  return getTierFromScore(score).votePower;
}

export function canCreateContest(score: number): boolean {
  return score >= REPUTATION_TIERS.creator.minScore;
}

export function canSubmit(score: number): boolean {
  return score >= REPUTATION_TIERS.voter.minScore;
}

export function isCurator(score: number): boolean {
  return score >= REPUTATION_TIERS.curator.minScore;
}

export function getProgressToNextTier(score: number): { progress: number; nextTier: ReputationTier | null; pointsNeeded: number } {
  const currentTier = getTierFromScore(score);

  if (currentTier.name === 'curator') {
    return { progress: 100, nextTier: null, pointsNeeded: 0 };
  }

  const tiers: TierName[] = ['observer', 'voter', 'creator', 'curator'];
  const currentIndex = tiers.indexOf(currentTier.name);
  const nextTierName = tiers[currentIndex + 1];
  const nextTier = REPUTATION_TIERS[nextTierName];

  const pointsInCurrentTier = score - currentTier.minScore;
  const tierRange = nextTier.minScore - currentTier.minScore;
  const progress = Math.min(100, (pointsInCurrentTier / tierRange) * 100);
  const pointsNeeded = nextTier.minScore - score;

  return { progress, nextTier, pointsNeeded };
}

export function calculateWeightedVotes(votes: { voterScore: number; amount: number }[]): number {
  return votes.reduce((total, vote) => {
    const power = getVotePower(vote.voterScore);
    return total + (vote.amount * power);
  }, 0);
}

export function calculateTrustConfidence(votes: { voterScore: number; amount: number }[]): number {
  if (votes.length === 0) return 0;

  const totalWeighted = calculateWeightedVotes(votes);
  const establishedVotes = votes
    .filter(v => v.voterScore >= 1400) // Creator tier and above
    .reduce((total, vote) => total + (vote.amount * getVotePower(vote.voterScore)), 0);

  return totalWeighted > 0 ? Math.round((establishedVotes / totalWeighted) * 100) : 0;
}

export function getTrustConfidenceLabel(confidence: number): { label: string; color: string } {
  if (confidence >= 70) return { label: 'High Trust', color: '#34D399' };
  if (confidence >= 40) return { label: 'Medium Trust', color: '#FBBF24' };
  return { label: 'Low Trust', color: '#F87171' };
}

export function getVoteBreakdownByTier(votes: { voterScore: number; amount: number }[]): {
  tier: ReputationTier;
  voteCount: number;
  weightedVotes: number;
  percentage: number;
}[] {
  const totalWeighted = calculateWeightedVotes(votes);
  const tiers: TierName[] = ['curator', 'creator', 'voter', 'observer'];

  return tiers.map(tierName => {
    const tier = REPUTATION_TIERS[tierName];
    const tierVotes = votes.filter(v => {
      const voterTier = getTierFromScore(v.voterScore);
      return voterTier.name === tierName;
    });

    const voteCount = tierVotes.length;
    const weightedVotes = tierVotes.reduce((sum, v) => sum + (v.amount * getVotePower(v.voterScore)), 0);
    const percentage = totalWeighted > 0 ? Math.round((weightedVotes / totalWeighted) * 100) : 0;

    return { tier, voteCount, weightedVotes, percentage };
  });
}
