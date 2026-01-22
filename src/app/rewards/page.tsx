'use client';

import { RewardsDisplay } from '@/components/contests/RewardsDisplay';

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Rewards</h1>
          <p className="text-gray-600">
            View and claim rewards from contests you've won
          </p>
        </div>

        <RewardsDisplay />
      </div>
    </div>
  );
}
