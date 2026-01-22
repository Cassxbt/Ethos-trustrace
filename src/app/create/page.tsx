'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CreateContestForm, ContestFormData } from '@/components/contests/CreateContestForm';
import { useRouter } from 'next/navigation';
import { createContest } from '@/services/contest-service';
import { ROUTES } from '@/lib/constants';

export default function CreateContestPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (contestData: ContestFormData) => {
    console.log('Page handleSubmit called', contestData);
    
    if (!address) {
      console.error('No address connected');
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Creating contest with params:', {
        title: contestData.title,
        prompt: contestData.prompt,
        rewardsPool: contestData.rewardsPool,
        submissionDuration: Number(contestData.submissionDuration),
        votingDuration: Number(contestData.votingDuration),
        minCredibilityScore: Number(contestData.minCredibilityScore),
        creator: address,
      });
      
      const contestId = await createContest({
        title: contestData.title,
        prompt: contestData.prompt,
        rewardsPool: contestData.rewardsPool,
        submissionDuration: Number(contestData.submissionDuration),
        votingDuration: Number(contestData.votingDuration),
        minCredibilityScore: Number(contestData.minCredibilityScore),
        creator: address,
      });

      console.log('Contest created successfully, ID:', contestId);
      setSuccess(true);
      setTimeout(() => {
        router.push(ROUTES.contest(contestId));
      }, 1200);
    } catch (err) {
      console.error('Error creating contest:', err);
      setError(err instanceof Error ? err.message : 'Failed to create contest');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[var(--accent)]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Create Contest</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to create a new contest</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Contest Created!</h1>
          <p className="text-gray-400 mb-8">
            Your contest has been successfully created and will be visible to all users.
          </p>
          <p className="text-gray-500 text-sm font-mono">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <span className="text-[var(--accent)] font-mono text-xs tracking-widest block mb-2">
            /// NEW COMPETITION
          </span>
          <h1 className="font-bold text-white text-4xl md:text-5xl mb-2">Create Contest</h1>
          <p className="text-gray-400">
            Launch a new credibility-weighted contest on TrustRace
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 glass-panel p-4 rounded-xl border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-bold text-red-500">Error</h4>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        <CreateContestForm
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Information Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel spotlight-card p-6 rounded-xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Contest Creation Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Set clear and specific contest requirements
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Choose appropriate reward amounts to attract quality submissions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Set reasonable deadlines for submission and voting phases
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Consider minimum credibility scores to ensure quality participants
              </li>
            </ul>
          </div>

          <div className="glass-panel spotlight-card p-6 rounded-xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              How It Works
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent)] font-mono font-bold">01</span>
                Set up your contest with title, prompt, and rewards
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent)] font-mono font-bold">02</span>
                Participants submit entries during the submission phase
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent)] font-mono font-bold">03</span>
                Community votes with credibility-weighted power
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--accent)] font-mono font-bold">04</span>
                Winner receives the reward pool automatically
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
