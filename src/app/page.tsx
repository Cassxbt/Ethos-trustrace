'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { TierBadge } from '@/components/trust/TierBadge';
import { ReputationOnboarding, useReputationOnboarding } from '@/components/trust/ReputationOnboarding';
import { useEthosScore } from '@/hooks/useEthosScore';
import { REPUTATION_TIERS } from '@/lib/reputation-tiers';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { score, loading } = useEthosScore(address);
  const { isOpen, markAsSeen } = useReputationOnboarding(address);

  // Address lookup state
  const [lookupAddress, setLookupAddress] = useState('');
  const [lookupResult, setLookupResult] = useState<{ score: number; address: string } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const { score: lookedUpScore } = useEthosScore(lookupResult?.address);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupAddress.trim()) return;

    setLookupLoading(true);
    // Simulate lookup - the useEthosScore hook will handle the actual fetch
    setLookupResult({ address: lookupAddress.trim(), score: 0 });
    setLookupLoading(false);
  };

  return (
    <div className="min-h-screen animate-fadeIn">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient-primary">TrustRace</span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--foreground-muted)] mb-2">
            Where Reputation Determines Influence
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mb-8">
            Powered by <a href="https://ethos.network" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">Ethos Protocol</a>
          </p>

          {/* Connect or Show Score */}
          <div className="card-dark max-w-md mx-auto p-6 mb-8 glow-purple">
            {isConnected && score ? (
              <div className="space-y-4">
                <p className="text-sm text-[var(--foreground-muted)]">Your Reputation</p>
                <TierBadge score={score.score} showProgress variant="full" showPermissions />
              </div>
            ) : isConnected && loading ? (
              <div className="py-8">
                <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[var(--foreground-muted)]">Loading your reputation...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Check Your Web3 Reputation
                </h2>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Connect your wallet to see your tier and voting power
                </p>
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contests" className="btn-primary">
              Browse Contests
            </Link>
            <Link href="/create" className="btn-secondary">
              Create Contest
            </Link>
          </div>
        </div>
      </section>

      {/* Address Lookup Section */}
      <section className="py-12 px-4" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-2">
            Check Any Address
          </h2>
          <p className="text-center text-[var(--foreground-muted)] mb-6">
            Look up any Ethereum address to see their reputation tier
          </p>

          <form onSubmit={handleLookup} className="flex gap-3 mb-6">
            <input
              type="text"
              value={lookupAddress}
              onChange={(e) => setLookupAddress(e.target.value)}
              placeholder="0x... or ENS name"
              className="input-dark flex-1"
            />
            <button type="submit" className="btn-primary" disabled={lookupLoading}>
              {lookupLoading ? 'Looking up...' : 'Lookup'}
            </button>
          </form>

          {lookupResult && lookedUpScore && (
            <div className="card-dark p-4">
              <TierBadge score={lookedUpScore.score} variant="badge" />
              <p className="text-xs text-[var(--foreground-muted)] mt-2 font-mono">
                {lookupResult.address}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Tier System Explanation */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-4">
            Reputation Tiers
          </h2>
          <p className="text-center text-[var(--foreground-muted)] mb-12 max-w-2xl mx-auto">
            Your Ethos credibility score determines your tier. Higher tiers unlock more abilities and greater voting power.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['observer', 'voter', 'creator', 'curator'] as const).map((tierName) => {
              const tier = REPUTATION_TIERS[tierName];
              return (
                <div
                  key={tierName}
                  className="card-dark p-6 text-center hover:scale-105 transition-transform"
                  style={{ boxShadow: `0 0 20px ${tier.glowColor}` }}
                >
                  <span className="text-4xl mb-4 block">{tier.icon}</span>
                  <h3 className="text-xl font-bold mb-2" style={{ color: tier.color }}>
                    {tier.displayName}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-4">
                    {tier.minScore}+ score
                  </p>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-lg font-bold mb-4"
                    style={{ backgroundColor: tier.bgColor, color: tier.color }}
                  >
                    {tier.votePower}x Vote Power
                  </div>
                  <ul className="text-xs text-left space-y-1">
                    {tier.permissions.slice(0, 3).map((perm, i) => (
                      <li key={i} className="flex items-center gap-2 text-[var(--foreground-muted)]">
                        <span style={{ color: tier.color }}>✓</span>
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--foreground)] mb-12">
            How TrustRace Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-primary-dim)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                1. Connect & Check
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Connect your wallet to see your Ethos reputation tier and voting power
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-secondary-dim)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🗳️</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                2. Vote With Influence
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Your reputation determines how much your vote counts. Curators have 3x power.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-primary-dim)] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                3. Trust The Results
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                See exactly WHO voted and their reputation. No more bots or fake accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gradient-primary mb-4">
            Ready to Build Trust?
          </h2>
          <p className="text-[var(--foreground-muted)] mb-8">
            Join contests where reputation matters. Create fair competitions. Let trust determine influence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contests" className="btn-primary">
              Explore Contests
            </Link>
            <a
              href="https://ethos.network"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Learn About Ethos
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            Built for <a href="https://vibeathon.ethos.network" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">Ethos Vibeathon 2026</a>
          </p>
          <div className="flex gap-6">
            <Link href="/contests" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)]">
              Contests
            </Link>
            <Link href="/create" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)]">
              Create
            </Link>
            <Link href="/ethos" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-primary)]">
              Ethos
            </Link>
          </div>
        </div>
      </footer>

      {/* Reputation Onboarding Modal */}
      {address && score && (
        <ReputationOnboarding
          isOpen={isOpen}
          onClose={markAsSeen}
          address={address}
          score={score.score}
          vouchCount={0}
        />
      )}
    </div>
  );
}
