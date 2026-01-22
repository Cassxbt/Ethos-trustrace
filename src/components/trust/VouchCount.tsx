'use client';

import { useState, useEffect } from 'react';
import { ethosClient } from '@/lib/ethos-client';
import { getTierFromScore } from '@/lib/reputation-tiers';

interface VouchCountProps {
  address: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface VouchData {
  count: number;
  topVouchers: { address: string; score: number }[];
  loading: boolean;
  error: string | null;
}

export function VouchCount({ address, showLabel = true, size = 'md' }: VouchCountProps) {
  const [data, setData] = useState<VouchData>({
    count: 0,
    topVouchers: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchVouches() {
      try {
        const vouches = await ethosClient.getUserVouches(address);
        // For now, use vouch count from the response length
        // In production, we'd also fetch voucher scores
        setData({
          count: vouches.length,
          topVouchers: [], // Would need additional API calls to get voucher scores
          loading: false,
          error: null,
        });
      } catch {
        // If API fails, show 0 vouches gracefully
        setData({
          count: 0,
          topVouchers: [],
          loading: false,
          error: null, // Don't show error, just show 0
        });
      }
    }

    if (address) {
      fetchVouches();
    }
  }, [address]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (data.loading) {
    return (
      <span className={`${sizeClasses[size]} text-gray-500 animate-pulse`}>
        Loading...
      </span>
    );
  }

  return (
    <span className={`${sizeClasses[size]} text-gray-400 flex items-center gap-1`}>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
      <span>
        {showLabel ? `Vouched by ${data.count} user${data.count !== 1 ? 's' : ''}` : data.count}
      </span>
    </span>
  );
}

/**
 * Displays notable vouchers with their tiers
 */
export function NotableVouchers({
  vouchers,
  maxDisplay = 3,
}: {
  vouchers: { address: string; score: number; ens?: string }[];
  maxDisplay?: number;
}) {
  if (vouchers.length === 0) return null;

  const displayed = vouchers.slice(0, maxDisplay);
  const remaining = vouchers.length - maxDisplay;

  return (
    <div className="text-sm">
      <p className="text-gray-500 text-xs mb-1">Notable Supporters</p>
      <div className="space-y-1">
        {displayed.map((voucher, i) => {
          const tier = getTierFromScore(voucher.score);
          return (
            <div key={i} className="flex items-center gap-2">
              <span>{tier.icon}</span>
              <span className="text-gray-300 font-mono text-xs">
                {voucher.ens || `${voucher.address.slice(0, 6)}...${voucher.address.slice(-4)}`}
              </span>
              <span className="text-xs" style={{ color: tier.color }}>
                ({tier.displayName})
              </span>
            </div>
          );
        })}
        {remaining > 0 && (
          <p className="text-gray-500 text-xs">+ {remaining} more</p>
        )}
      </div>
    </div>
  );
}

/**
 * Trust connection indicator (shows degrees of separation)
 */
export function TrustConnection({
  degrees,
  mutualVouches,
}: {
  degrees: number;
  mutualVouches: number;
}) {
  if (degrees === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400">
        <span>✓</span>
        <span>You vouched for this user</span>
      </div>
    );
  }

  if (degrees === 1) {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-400">
        <span>🔗</span>
        <span>1 degree away</span>
        {mutualVouches > 0 && (
          <span className="text-gray-500">
            ({mutualVouches} mutual vouch{mutualVouches !== 1 ? 'es' : ''})
          </span>
        )}
      </div>
    );
  }

  if (degrees === 2) {
    return (
      <div className="flex items-center gap-2 text-sm text-purple-400">
        <span>🔗</span>
        <span>2 degrees away</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>👤</span>
      <span>Not in your trust network</span>
    </div>
  );
}
