'use client';

import { getTierFromScore, getProgressToNextTier, type ReputationTier } from '@/lib/reputation-tiers';

interface TierBadgeProps {
  score: number;
  showProgress?: boolean;
  showPermissions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'full' | 'compact';
}

export function TierBadge({
  score,
  showProgress = false,
  showPermissions = false,
  size = 'md',
  variant = 'badge',
}: TierBadgeProps) {
  const tier = getTierFromScore(score);
  const { progress, nextTier, pointsNeeded } = getProgressToNextTier(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
        style={{
          backgroundColor: tier.bgColor,
          color: tier.color,
          boxShadow: `0 0 10px ${tier.glowColor}`,
        }}
      >
        <span className={iconSizes[size]}>{tier.icon}</span>
        <span>{tier.displayName}</span>
      </span>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-lg font-medium ${sizeClasses[size]}`}
        style={{
          backgroundColor: tier.bgColor,
          color: tier.color,
          boxShadow: `0 0 12px ${tier.glowColor}`,
          border: `1px solid ${tier.color}20`,
        }}
      >
        <span className={iconSizes[size]}>{tier.icon}</span>
        <span>{tier.displayName}</span>
        <span className="opacity-70">({score.toLocaleString()})</span>
        <span className="text-xs opacity-60">{tier.votePower}x</span>
      </div>
    );
  }

  // Full variant with progress and permissions
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: tier.bgColor,
        border: `1px solid ${tier.color}30`,
        boxShadow: `0 0 20px ${tier.glowColor}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{tier.icon}</span>
          <div>
            <h3 className="font-bold text-lg" style={{ color: tier.color }}>
              {tier.displayName}
            </h3>
            <p className="text-sm text-gray-400">
              Score: {score.toLocaleString()}
            </p>
          </div>
        </div>
        <div
          className="text-right px-3 py-1 rounded-lg"
          style={{ backgroundColor: `${tier.color}20` }}
        >
          <span className="text-xl font-bold" style={{ color: tier.color }}>
            {tier.votePower}x
          </span>
          <p className="text-xs text-gray-400">Vote Power</p>
        </div>
      </div>

      {/* Progress to next tier */}
      {showProgress && nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress to {nextTier.displayName}</span>
            <span>{pointsNeeded} points needed</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: nextTier.color,
                boxShadow: `0 0 8px ${nextTier.color}`,
              }}
            />
          </div>
        </div>
      )}

      {/* Permissions */}
      {showPermissions && (
        <div className="space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Your Permissions
          </p>
          {tier.permissions.map((permission, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <span style={{ color: tier.color }}>✓</span>
              <span>{permission}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Inline tier indicator for addresses
 */
export function TierIndicator({ score, showScore = true }: { score: number; showScore?: boolean }) {
  const tier = getTierFromScore(score);

  return (
    <span
      className="inline-flex items-center gap-1 text-sm"
      title={`${tier.displayName} - ${tier.votePower}x vote power`}
    >
      <span>{tier.icon}</span>
      <span style={{ color: tier.color }}>{tier.displayName}</span>
      {showScore && (
        <span className="text-gray-500">({score.toLocaleString()})</span>
      )}
    </span>
  );
}

/**
 * Mini badge for tight spaces
 */
export function TierDot({ score }: { score: number }) {
  const tier = getTierFromScore(score);

  return (
    <span
      className="inline-block w-3 h-3 rounded-full"
      style={{
        backgroundColor: tier.color,
        boxShadow: `0 0 6px ${tier.glowColor}`,
      }}
      title={`${tier.displayName} (${score})`}
    />
  );
}
