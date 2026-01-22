'use client';

import { getTierFromScore, getProgressToNextTier } from '@/lib/reputation-tiers';

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
    lg: 'text-xl',
  };

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded font-bold uppercase tracking-wider ${sizeClasses[size]}`}
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
        <span className="font-bold">{tier.displayName}</span>
        <span className="opacity-70 font-mono">({score.toLocaleString()})</span>
        <span className="text-xs opacity-60 font-mono">{tier.votePower}x</span>
      </div>
    );
  }

  // Full variant with progress and permissions
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: `${tier.color}08`,
        border: `1px solid ${tier.color}20`,
        boxShadow: `0 0 30px ${tier.glowColor}`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: tier.bgColor }}
          >
            {tier.icon}
          </div>
          <div>
            <h3 className="font-bold text-xl" style={{ color: tier.color }}>
              {tier.displayName}
            </h3>
            <p className="text-sm text-gray-500 font-mono">
              Score: {score.toLocaleString()}
            </p>
          </div>
        </div>
        <div
          className="text-right px-4 py-2 rounded-lg"
          style={{ backgroundColor: tier.bgColor }}
        >
          <span className="text-2xl font-bold" style={{ color: tier.color }}>
            {tier.votePower}x
          </span>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Vote Power</p>
        </div>
      </div>

      {/* Progress to next tier */}
      {showProgress && nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">
            <span>Progress to {nextTier.displayName}</span>
            <span>{pointsNeeded} points needed</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
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
        <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono mb-3">
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
      className="inline-flex items-center gap-1.5 text-sm"
      title={`${tier.displayName} - ${tier.votePower}x vote power`}
    >
      <span
        className="w-5 h-5 rounded flex items-center justify-center text-xs"
        style={{ backgroundColor: tier.bgColor }}
      >
        {tier.icon}
      </span>
      <span className="font-medium" style={{ color: tier.color }}>{tier.displayName}</span>
      {showScore && (
        <span className="text-gray-500 font-mono text-xs">({score.toLocaleString()})</span>
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
      className="inline-block w-3 h-3 rounded-full animate-pulse-glow"
      style={{
        backgroundColor: tier.color,
        boxShadow: `0 0 8px ${tier.glowColor}`,
      }}
      title={`${tier.displayName} (${score})`}
    />
  );
}
