'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEthosScore } from '@/hooks/useEthosScore';
import { getTierFromScore } from '@/lib/reputation-tiers';

interface CreateContestFormProps {
  onSubmit: (contestData: ContestFormData) => void;
  loading?: boolean;
}

export interface ContestFormData {
  title: string;
  prompt: string;
  submissionDuration: number | string;
  votingDuration: number | string;
  rewardsPool: string;
  minCredibilityScore: number | string;
}

export function CreateContestForm({ onSubmit, loading = false }: CreateContestFormProps) {
  const { address } = useAccount();
  const { score: userScore, loading: scoreLoading } = useEthosScore(address);

  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    prompt: '',
    submissionDuration: 7 * 24 * 60 * 60,
    votingDuration: 3 * 24 * 60 * 60,
    rewardsPool: '',
    minCredibilityScore: 1400
  });

  const [errors, setErrors] = useState<Partial<ContestFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContestFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt is required';
    } else if (formData.prompt.length > 1000) {
      newErrors.prompt = 'Prompt must be less than 1000 characters';
    }

    if (!formData.rewardsPool.trim() || parseFloat(formData.rewardsPool) <= 0) {
      newErrors.rewardsPool = 'Valid reward amount is required';
    }

    if (typeof formData.submissionDuration === 'number' && formData.submissionDuration < 3600) {
      newErrors.submissionDuration = 'Submission duration must be at least 1 hour';
    }

    if (typeof formData.votingDuration === 'number' && formData.votingDuration < 3600) {
      newErrors.votingDuration = 'Voting duration must be at least 1 hour';
    }

    if (typeof formData.minCredibilityScore === 'number' && (formData.minCredibilityScore < 0 || formData.minCredibilityScore > 2800)) {
      newErrors.minCredibilityScore = 'Invalid credibility score range';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit triggered', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }
    
    console.log('Calling onSubmit with:', formData);
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof ContestFormData, value: string | number) => {
    let processedValue: string | number = value;
    if (field === 'submissionDuration' || field === 'votingDuration' || field === 'minCredibilityScore') {
      processedValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const canCreateContest = userScore?.canCreateContest && !scoreLoading;
  const tier = userScore ? getTierFromScore(userScore.score) : null;

  return (
    <div className="glass-panel rounded-xl p-8">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Contest
      </h2>

      {/* User Score Check */}
      {address && (
        <div
          className="mb-8 p-4 rounded-lg border"
          style={{
            backgroundColor: tier ? `${tier.color}08` : 'rgba(255,255,255,0.05)',
            borderColor: tier ? `${tier.color}30` : 'rgba(255,255,255,0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tier && (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: tier.bgColor }}
                >
                  {tier.icon}
                </div>
              )}
              <div>
                <h3 className="font-bold text-white text-sm">Your Credibility Status</h3>
                {scoreLoading ? (
                  <p className="text-sm text-gray-400">Loading...</p>
                ) : userScore ? (
                  <div className="text-sm text-gray-400 font-mono">
                    <span style={{ color: tier?.color }}>{userScore.score.toLocaleString()}</span>
                    {' · '}{userScore.level}{' · '}{userScore.votingPower}x power
                  </div>
                ) : (
                  <p className="text-sm text-red-400">Unable to fetch credibility score</p>
                )}
              </div>
            </div>
            <div className={`text-sm font-bold px-3 py-1 rounded ${canCreateContest ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              {canCreateContest ? '✓ Can Create' : '✗ Cannot Create'}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Contest Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`input-dark ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter contest title"
            maxLength={100}
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Contest Prompt *
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            rows={4}
            className={`input-dark resize-none ${errors.prompt ? 'border-red-500' : ''}`}
            placeholder="Describe what participants should create or submit"
            maxLength={1000}
            disabled={loading}
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-500">{errors.prompt}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 font-mono">
            {formData.prompt.length}/1000
          </p>
        </div>

        {/* Rewards and Min Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="rewardsPool" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Rewards Pool (ETH) *
            </label>
            <input
              type="number"
              id="rewardsPool"
              value={formData.rewardsPool}
              onChange={(e) => handleInputChange('rewardsPool', e.target.value)}
              step="0.001"
              min="0"
              className={`input-dark ${errors.rewardsPool ? 'border-red-500' : ''}`}
              placeholder="0.1"
              disabled={loading}
            />
            {errors.rewardsPool && (
              <p className="mt-1 text-sm text-red-500">{errors.rewardsPool}</p>
            )}
          </div>

          <div>
            <label htmlFor="minCredibilityScore" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Min Credibility Score
            </label>
            <select
              id="minCredibilityScore"
              value={formData.minCredibilityScore}
              onChange={(e) => handleInputChange('minCredibilityScore', parseInt(e.target.value))}
              className={`input-dark ${errors.minCredibilityScore ? 'border-red-500' : ''}`}
              disabled={loading}
            >
              <option value={0}>No Minimum</option>
              <option value={800}>Voter (800+)</option>
              <option value={1400}>Creator (1400+)</option>
              <option value={2000}>Curator (2000+)</option>
            </select>
            {errors.minCredibilityScore && (
              <p className="mt-1 text-sm text-red-500">{errors.minCredibilityScore}</p>
            )}
          </div>
        </div>

        {/* Duration Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="submissionDuration" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Submission Duration
            </label>
            <select
              id="submissionDuration"
              value={formData.submissionDuration}
              onChange={(e) => handleInputChange('submissionDuration', parseInt(e.target.value))}
              className={`input-dark ${errors.submissionDuration ? 'border-red-500' : ''}`}
              disabled={loading}
            >
              <option value={3600}>1 Hour</option>
              <option value={6 * 3600}>6 Hours</option>
              <option value={24 * 3600}>1 Day</option>
              <option value={3 * 24 * 3600}>3 Days</option>
              <option value={7 * 24 * 3600}>7 Days</option>
              <option value={14 * 24 * 3600}>14 Days</option>
              <option value={30 * 24 * 3600}>30 Days</option>
            </select>
            {errors.submissionDuration && (
              <p className="mt-1 text-sm text-red-500">{errors.submissionDuration}</p>
            )}
          </div>

          <div>
            <label htmlFor="votingDuration" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Voting Duration
            </label>
            <select
              id="votingDuration"
              value={formData.votingDuration}
              onChange={(e) => handleInputChange('votingDuration', parseInt(e.target.value))}
              className={`input-dark ${errors.votingDuration ? 'border-red-500' : ''}`}
              disabled={loading}
            >
              <option value={3600}>1 Hour</option>
              <option value={6 * 3600}>6 Hours</option>
              <option value={24 * 3600}>1 Day</option>
              <option value={3 * 24 * 3600}>3 Days</option>
              <option value={7 * 24 * 3600}>7 Days</option>
              <option value={14 * 24 * 3600}>14 Days</option>
            </select>
            {errors.votingDuration && (
              <p className="mt-1 text-sm text-red-500">{errors.votingDuration}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || !canCreateContest}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Contest'}
          </button>
        </div>

        {/* Warning for insufficient credibility */}
        {!canCreateContest && !scoreLoading && (
          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-bold text-amber-500 text-sm">Cannot Create Contest</h4>
                <p className="text-sm text-amber-400/80">
                  You need a credibility score of at least 1,400 (Creator tier) to create contests.
                  Build your reputation on Ethos to unlock contest creation.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
