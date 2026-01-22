'use client';

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

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    `px-3 py-2 text-sm font-medium rounded-md transition-all ${
      isActive(path)
        ? 'text-[var(--accent-primary)] bg-[var(--accent-primary-dim)]'
        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-tertiary)]'
    }`;

  const mobileNavLinkClass = (path: string) =>
    `block px-3 py-2 text-base font-medium rounded-md transition-all ${
      isActive(path)
        ? 'text-[var(--accent-primary)] bg-[var(--accent-primary-dim)]'
        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-tertiary)]'
    }`;

  return (
    <nav className="border-b border-[var(--border-color)] sticky top-0 z-40" style={{ backgroundColor: 'var(--background-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gradient-primary">TrustRace</span>
            </Link>

            <div className="hidden md:flex space-x-1">
              <Link href="/" className={navLinkClass('/')}>
                Home
              </Link>
              <Link href="/contests" className={navLinkClass('/contests')}>
                Contests
              </Link>
              <Link href="/create" className={navLinkClass('/create')}>
                Create
              </Link>
              <Link href="/ethos" className={navLinkClass('/ethos')}>
                Ethos
              </Link>
            </div>
          </div>

          {/* Right side - Tier Badge and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Tier Badge - only show when connected and has score */}
            {isConnected && score && (
              <div className="hidden lg:block">
                <TierBadge score={score.score} size="sm" variant="compact" />
              </div>
            )}
            <ConnectButton
              chainStatus="icon"
              showBalance={false}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'address',
              }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 space-y-1 border-t border-[var(--border-color)]">
          {/* Mobile tier badge */}
          {isConnected && score && (
            <div className="px-3 py-2 mb-2">
              <TierBadge score={score.score} size="sm" variant="badge" />
            </div>
          )}

          <Link href="/" className={mobileNavLinkClass('/')}>
            Home
          </Link>
          <Link href="/contests" className={mobileNavLinkClass('/contests')}>
            Contests
          </Link>
          <Link href="/create" className={mobileNavLinkClass('/create')}>
            Create
          </Link>
          <Link href="/ethos" className={mobileNavLinkClass('/ethos')}>
            Ethos
          </Link>
        </div>
      </div>
    </nav>
  );
}
