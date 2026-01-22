'use client';

import { useEffect, useState } from 'react';
import { TierBadge } from './TierBadge';
import { getTierFromScore, getProgressToNextTier, REPUTATION_TIERS } from '@/lib/reputation-tiers';

interface ReputationOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  score: number;
  vouchCount?: number;
}

export function ReputationOnboarding({
  isOpen,
  onClose,
  address,
  score,
  vouchCount = 0,
}: ReputationOnboardingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // Wait for animation
  };

  if (!isOpen) return null;

  const tier = getTierFromScore(score);
  const { progress, nextTier, pointsNeeded } = getProgressToNextTier(score);
  const hasExistingScore = score > 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`card-dark max-w-md w-full p-6 transform transition-all duration-200 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: `0 0 40px ${tier.glowColor}` }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gradient-primary mb-2">
            {hasExistingScore ? 'Welcome Back!' : 'Welcome to TrustRace'}
          </h2>
          <p className="text-[var(--foreground-muted)]">
            {hasExistingScore
              ? 'Your reputation follows you across Web3'
              : 'Build your reputation to unlock influence'}
          </p>
        </div>

        {/* Score Display */}
        {hasExistingScore ? (
          <div className="mb-6">
            <TierBadge
              score={score}
              showProgress={true}
              showPermissions={true}
              variant="full"
            />
          </div>
        ) : (
          <div className="mb-6">
            <div
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: 'var(--background-tertiary)' }}
            >
              <span className="text-4xl mb-3 block">👁️</span>
              <h3 className="font-bold text-lg text-[var(--foreground)] mb-1">
                Observer
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] mb-4">
                You&apos;re new to Web3 reputation
              </p>

              <div className="text-left space-y-2 mb-4">
                <p className="text-sm text-[var(--foreground-muted)]">
                  Start with 0.5x voting power. Level up by:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--accent-secondary)]">✓</span>
                    <span className="text-[var(--foreground)]">Voting on quality submissions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--accent-secondary)]">✓</span>
                    <span className="text-[var(--foreground)]">Getting vouched by trusted users</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--accent-secondary)]">✓</span>
                    <span className="text-[var(--foreground)]">Winning contests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tier Progression Preview */}
        <div className="mb-6">
          <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wide mb-3">
            Reputation Tiers
          </p>
          <div className="space-y-2">
            {(['observer', 'voter', 'creator', 'curator'] as const).map((tierName) => {
              const t = REPUTATION_TIERS[tierName];
              const isCurrentTier = tier.name === tierName;
              const isUnlocked = score >= t.minScore;

              return (
                <div
                  key={tierName}
                  className="flex items-center justify-between p-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: isCurrentTier ? t.bgColor : 'transparent',
                    boxShadow: isCurrentTier ? `0 0 0 1px ${t.color}` : 'none',
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span
                      className="font-medium text-sm"
                      style={{ color: isUnlocked ? t.color : 'var(--foreground-muted)' }}
                    >
                      {t.displayName}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">
                      ({t.minScore}+)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: t.color }}>
                      {t.votePower}x
                    </span>
                    {isCurrentTier && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white">
                        You
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vouch info if available */}
        {vouchCount > 0 && (
          <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: 'var(--background-tertiary)' }}>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-[var(--accent-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
              </svg>
              <span className="text-[var(--foreground)]">
                Vouched by <span className="font-semibold">{vouchCount}</span> user{vouchCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button onClick={handleClose} className="btn-primary w-full">
            {hasExistingScore ? 'Continue to TrustRace' : 'Start Building Reputation'}
          </button>

          {!hasExistingScore && (
            <a
              href="https://www.ethos.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full text-center block"
            >
              Learn About Ethos Reputation
            </a>
          )}
        </div>

        {/* Address footer */}
        <div className="mt-4 pt-4 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-[var(--foreground-muted)]">
            Connected: <span className="font-mono">{address.slice(0, 8)}...{address.slice(-6)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage onboarding state
 */
export function useReputationOnboarding(address: string | undefined) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (address) {
      const key = `trustrace_onboarding_${address}`;
      const seen = localStorage.getItem(key);
      if (!seen) {
        setHasSeenOnboarding(false);
        setIsOpen(true);
      }
    }
  }, [address]);

  const markAsSeen = () => {
    if (address) {
      localStorage.setItem(`trustrace_onboarding_${address}`, 'true');
      setHasSeenOnboarding(true);
      setIsOpen(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    hasSeenOnboarding,
    markAsSeen,
  };
}
