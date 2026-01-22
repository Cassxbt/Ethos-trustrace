'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { TierBadge } from '@/components/trust/TierBadge';
import { useEthosScore } from '@/hooks/useEthosScore';

export function Navigation() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { score } = useEthosScore(address);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/', label: 'Home', code: '01' },
    { path: '/contests', label: 'Contests', code: '02' },
    { path: '/create', label: 'Create', code: '03' },
    { path: '/ethos', label: 'Ethos', code: '04' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="group">
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">
            Trust<span className="text-[var(--accent)] group-hover:text-white transition-colors">//</span>Race
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 text-xs font-mono tracking-widest text-gray-400">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`hover:text-white transition-colors uppercase ${
                isActive(item.path) ? 'text-white' : ''
              }`}
            >
              [{item.code}] {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <span className="hidden lg:flex text-[10px] font-mono text-green-500 items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {isConnected ? 'CONNECTED' : 'READY'}
          </span>

          {/* Tier Badge */}
          {isConnected && score && (
            <div className="hidden lg:block">
              <TierBadge score={score.score} size="sm" variant="compact" />
            </div>
          )}

          {/* Wallet Connect */}
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="border border-white/20 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="border border-red-500/50 bg-red-500/10 px-6 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          Wrong Network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={openChainModal}
                          className="hidden sm:flex items-center gap-2 border border-white/10 px-3 py-2 text-xs font-mono text-gray-400 hover:text-white hover:border-white/20 transition-all"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              src={chain.iconUrl}
                              alt={chain.name ?? 'Chain'}
                              className="w-4 h-4"
                            />
                          )}
                        </button>
                        <button
                          onClick={openAccountModal}
                          className="border border-white/20 px-4 py-2 text-xs font-mono text-white hover:bg-white hover:text-black transition-all"
                        >
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#050505]/95 backdrop-blur-md">
          <div className="px-6 py-4 space-y-1">
            {/* Mobile Tier Badge */}
            {isConnected && score && (
              <div className="py-3 border-b border-white/5 mb-3">
                <TierBadge score={score.score} size="sm" variant="badge" />
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-3 text-sm font-mono uppercase tracking-wider transition-colors ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                [{item.code}] {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
