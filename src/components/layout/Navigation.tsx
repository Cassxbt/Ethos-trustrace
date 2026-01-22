'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CredibilityScore } from '@/components/ethos/CredibilityScore';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">TrustRace</span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                href="/contests"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/contests') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Contests
              </Link>
              <Link
                href="/create"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/create') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Create
              </Link>
              <Link
                href="/rewards"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/rewards') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Rewards
              </Link>
              <Link
                href="/ethos"
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive('/ethos') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Ethos
              </Link>
            </div>
          </div>

          {/* Right side - Wallet and Score */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block">
              <CredibilityScore compact />
            </div>
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
              isActive('/') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Home
          </Link>
          <Link
            href="/contests"
            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
              isActive('/contests') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Contests
          </Link>
          <Link
            href="/create"
            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
              isActive('/create') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Create
          </Link>
          <Link
            href="/rewards"
            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
              isActive('/rewards') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Rewards
          </Link>
          <Link
            href="/ethos"
            className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
              isActive('/ethos') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Ethos
          </Link>
        </div>
      </div>
    </nav>
  );
}
