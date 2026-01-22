'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CreateContestForm, ContestFormData } from '@/components/contests/CreateContestForm';
import { useRouter } from 'next/navigation';

export default function CreateContestPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (contestData: ContestFormData) => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual contract call
      console.log('Creating contest:', contestData);
      
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Redirect to contests page after 2 seconds
      setTimeout(() => {
        router.push('/contests');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contest');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Contest</h1>
          <p className="text-gray-600 mb-8">Connect your wallet to create a new contest</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 mb-4 text-6xl">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contest Created!</h1>
          <p className="text-gray-600 mb-8">
            Your contest has been successfully created and will be visible to all users.
          </p>
          <p className="text-gray-500 text-sm">Redirecting to contests page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Contest</h1>
          <p className="text-gray-600">
            Launch a new credibility-weighted contest on TrustRace
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">Error</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <CreateContestForm 
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contest Creation Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Set clear and specific contest requirements
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Choose appropriate reward amounts to attract quality submissions
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Set reasonable deadlines for submission and voting phases
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Consider minimum credibility scores to ensure quality participants
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">1.</span>
                Set up your contest with title, prompt, and rewards
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">2.</span>
                Participants submit entries during the submission phase
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">3.</span>
                Community votes with credibility-weighted power
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">4.</span>
                Winner receives the reward pool automatically
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
