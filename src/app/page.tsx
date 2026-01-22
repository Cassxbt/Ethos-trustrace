'use client';

import { useState, useEffect } from 'react';
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

  // Spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.spotlight-card').forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupAddress.trim()) return;

    setLookupLoading(true);
    setLookupResult({ address: lookupAddress.trim(), score: 0 });
    setLookupLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />

        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent-secondary)]/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-20 text-center max-w-5xl px-6">
          {/* Version badge */}
          <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-[var(--accent)] tracking-widest uppercase">
              Powered by Ethos Protocol
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9] mb-6">
            CREDIBILITY
            <br />
            <span className="text-gradient">WEIGHTED</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            The contest platform where reputation determines influence.
            <br />
            No bots. No fake accounts. Pure trust-based voting.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isConnected ? (
              <Link href="/contests" className="btn-primary w-full sm:w-auto">
                Browse Contests
              </Link>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button onClick={openConnectModal} className="btn-primary w-full sm:w-auto">
                    Connect Wallet
                  </button>
                )}
              </ConnectButton.Custom>
            )}
            <Link href="/ethos" className="btn-secondary w-full sm:w-auto">
              Check Reputation
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/40 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-white/5 bg-[#080808] py-6 relative z-20 overflow-hidden marquee-mask">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-20 px-10 items-center">
              <span className="font-bold text-2xl text-white/20 hover:text-white transition-colors">ETHOS</span>
              <span className="font-bold text-2xl text-white/20 hover:text-white transition-colors">BASE</span>
              <span className="font-bold text-2xl text-white/20 hover:text-white transition-colors">CREDIBILITY</span>
              <span className="font-bold text-2xl text-white/20 hover:text-white transition-colors">TRUST</span>
              <span className="font-bold text-2xl text-white/20 hover:text-white transition-colors">REPUTATION</span>
              <span className="font-bold text-2xl text-white/20 hover:text-white transition-colors">WEB3</span>
            </div>
          ))}
        </div>
      </div>

      {/* BENTO FEATURES */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
            <div>
              <span className="text-[var(--accent)] font-mono text-xs tracking-widest block mb-2">
                /// CORE FEATURES
              </span>
              <h2 className="font-bold text-white text-4xl md:text-5xl">Trust Engine</h2>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-blink" />
                <span className="font-mono text-xs text-white">NETWORK: ACTIVE</span>
              </div>
              <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
                Base Sepolia Testnet
              </p>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Large card - Your Reputation */}
            <div className="md:col-span-2 md:row-span-2 glass-panel spotlight-card rounded-xl overflow-hidden relative group min-h-[400px]">
              <div className="scan-line" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute top-6 right-6 border border-white/20 bg-black/50 px-3 py-1 rounded text-[10px] font-mono text-[var(--accent)]">
                {isConnected ? 'WALLET_CONNECTED' : 'AWAITING_CONNECTION'}
              </div>

              <div className="absolute bottom-0 left-0 p-8 z-10 w-full">
                <div className="w-10 h-10 bg-[var(--accent)] flex items-center justify-center mb-4 text-white font-bold rounded">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                {isConnected && score ? (
                  <div>
                    <h3 className="font-bold text-2xl text-white mb-2">Your Reputation</h3>
                    <TierBadge score={score.score} showProgress variant="full" />
                  </div>
                ) : isConnected && loading ? (
                  <div>
                    <h3 className="font-bold text-2xl text-white mb-2">Loading...</h3>
                    <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-2xl text-white mb-2">Connect Wallet</h3>
                    <p className="text-gray-300 text-sm max-w-sm mb-4">
                      Link your wallet to view your Ethos credibility score and unlock voting power.
                    </p>
                    <ConnectButton />
                  </div>
                )}
              </div>
            </div>

            {/* Voting Power */}
            <div className="glass-panel spotlight-card rounded-xl p-6 flex flex-col justify-between min-h-[180px]">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] text-gray-500 uppercase">Max Vote Power</span>
                <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-white">3.0x</div>
                <div className="text-[10px] text-gray-500 mt-1">Curator Tier</div>
              </div>
            </div>

            {/* Active Contests */}
            <div className="glass-panel spotlight-card rounded-xl p-6 flex flex-col justify-between min-h-[180px]">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] text-gray-500 uppercase">Live Contests</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="text-center py-2">
                <div className="text-4xl font-bold text-white">∞</div>
                <div className="text-[10px] text-gray-500 mt-1">Create Yours</div>
              </div>
            </div>

            {/* Trust Score Range */}
            <div className="glass-panel spotlight-card rounded-xl p-6 flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center gap-2 text-white mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="font-bold text-sm">Trust Range</span>
              </div>
              <div className="flex-grow flex items-center">
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gray-500 via-blue-500 via-green-500 to-amber-500 w-full rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0</span>
                <span>2800+</span>
              </div>
            </div>

            {/* Ethos Integration */}
            <div className="glass-panel spotlight-card rounded-xl p-6 relative overflow-hidden min-h-[180px]">
              <div className="absolute inset-0 bg-[var(--accent)]/5 z-0" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-white">Ethos Protocol</span>
                  <span className="text-[var(--accent)] text-[10px] font-mono">INTEGRATED</span>
                </div>
                <div className="font-mono text-[10px] text-gray-500">
                  <div>&gt; Vouches</div>
                  <div>&gt; Attestations</div>
                  <div>&gt; Reviews</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 glass-panel spotlight-card rounded-xl p-8 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-white mb-2">4 Reputation Tiers</h3>
                <p className="text-gray-400 text-xs font-mono">Observer → Voter → Creator → Curator</p>
              </div>
              <div className="flex gap-2">
                {(['observer', 'voter', 'creator', 'curator'] as const).map((tierName) => {
                  const tier = REPUTATION_TIERS[tierName];
                  return (
                    <div
                      key={tierName}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: tier.bgColor }}
                      title={tier.displayName}
                    >
                      {tier.icon}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIER SYSTEM */}
      <section className="py-24 bg-[#050505] border-t border-white/5 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <span className="text-[var(--accent)] font-mono text-xs tracking-widest block mb-4">
            /// REPUTATION TIERS
          </span>
          <h2 className="font-bold text-4xl md:text-5xl mb-6 text-white">
            Built on Trust
          </h2>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-2xl">
            Your Ethos credibility score determines your tier and voting power.
            Higher reputation = greater influence in contests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(['observer', 'voter', 'creator', 'curator'] as const).map((tierName, index) => {
              const tier = REPUTATION_TIERS[tierName];
              return (
                <div
                  key={tierName}
                  className="group glass-panel spotlight-card rounded-xl p-6 hover-lift"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-gray-600 text-sm group-hover:text-[var(--accent)] transition-colors">
                      0{index + 1}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                  </div>

                  <div
                    className="text-4xl mb-4 w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: tier.bgColor }}
                  >
                    {tier.icon}
                  </div>

                  <h4 className="font-bold text-white text-lg mb-1">{tier.displayName}</h4>
                  <p className="text-sm text-gray-500 mb-4">{tier.minScore}+ score</p>

                  <div
                    className="inline-block px-3 py-1 rounded text-sm font-bold mb-4"
                    style={{ backgroundColor: tier.bgColor, color: tier.color }}
                  >
                    {tier.votePower}x Power
                  </div>

                  <ul className="space-y-2 text-xs text-gray-400">
                    {tier.permissions.slice(0, 2).map((perm, i) => (
                      <li key={i} className="flex items-center gap-2">
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

      {/* ADDRESS LOOKUP */}
      <section className="py-24 px-6 border-t border-white/5 relative z-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[var(--accent)] font-mono text-xs tracking-widest block mb-4">
              /// REPUTATION LOOKUP
            </span>
            <h2 className="font-bold text-3xl text-white mb-4">Check Any Address</h2>
            <p className="text-gray-400">
              Look up any Ethereum address to see their reputation tier and voting power
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-3 mb-8">
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
            <div className="glass-panel p-6 rounded-xl">
              <TierBadge score={lookedUpScore.score} variant="badge" />
              <p className="text-xs text-gray-500 mt-4 font-mono break-all">
                {lookupResult.address}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#020202] pt-24 pb-10 px-6 border-t border-white/10 relative overflow-hidden">
        {/* Background text */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none select-none pointer-events-none opacity-5">
          <span className="text-[20vw] font-black text-white whitespace-nowrap -ml-10">TRUSTRACE</span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Ready to compete?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contests" className="btn-primary">
                Browse Contests
              </Link>
              <Link href="/create" className="btn-secondary">
                Create Contest
              </Link>
            </div>
          </div>

          <div className="flex gap-12 text-sm text-gray-500 font-mono tracking-wider uppercase">
            <div className="flex flex-col gap-3">
              <span className="text-white">Platform</span>
              <Link href="/contests" className="hover:text-[var(--accent)] transition-colors">Contests</Link>
              <Link href="/create" className="hover:text-[var(--accent)] transition-colors">Create</Link>
              <Link href="/ethos" className="hover:text-[var(--accent)] transition-colors">Ethos</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white">Resources</span>
              <a href="https://ethos.network" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Ethos</a>
              <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">Base</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-mono uppercase">
          <span>Built for Ethos Vibeathon 2026</span>
          <span className="mt-2 md:mt-0">Base Sepolia Testnet</span>
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
