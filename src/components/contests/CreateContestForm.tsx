'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEthosScore } from '@/hooks/useEthosScore';

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
    submissionDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    votingDuration: 3 * 24 * 60 * 60, // 3 days in seconds
    rewardsPool: '',
    minCredibilityScore: 1400 // Neutral level
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
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof ContestFormData, value: string | number) => {
    // Convert string values to numbers for numeric fields
    let processedValue: string | number = value;
    if (field === 'submissionDuration' || field === 'votingDuration' || field === 'minCredibilityScore') {
      processedValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const canCreateContest = userScore?.canCreateContest && !scoreLoading;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Contest</h2>
      
      {/* User Score Check */}
      {address && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Your Credibility Status</h3>
              {scoreLoading ? (
                <p className="text-sm text-blue-700">Loading...</p>
              ) : userScore ? (
                <div className="text-sm text-blue-700">
                  <p>Score: {userScore.score.toLocaleString()} ({userScore.level})</p>
                  <p>Voting Power: {userScore.votingPower}x</p>
                </div>
              ) : (
                <p className="text-sm text-red-700">Unable to fetch credibility score</p>
              )}
            </div>
            <div className={`text-sm font-medium ${canCreateContest ? 'text-green-700' : 'text-red-700'}`}>
              {canCreateContest ? '✓ Can Create' : '✗ Cannot Create'}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Contest Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter contest title"
            maxLength={100}
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Contest Prompt *
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.prompt ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe what participants should create or submit"
            maxLength={1000}
            disabled={loading}
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-600">{errors.prompt}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.prompt.length}/1000 characters
          </p>
        </div>

        {/* Rewards and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rewards Pool */}
          <div>
            <label htmlFor="rewardsPool" className="block text-sm font-medium text-gray-700 mb-2">
              Rewards Pool (ETH) *
            </label>
            <input
              type="number"
              id="rewardsPool"
              value={formData.rewardsPool}
              onChange={(e) => handleInputChange('rewardsPool', e.target.value)}
              step="0.001"
              min="0"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.rewardsPool ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.1"
              disabled={loading}
            />
            {errors.rewardsPool && (
              <p className="mt-1 text-sm text-red-600">{errors.rewardsPool}</p>
            )}
          </div>

          {/* Min Credibility Score */}
          <div>
            <label htmlFor="minCredibilityScore" className="block text-sm font-medium text-gray-700 mb-2">
              Min Credibility Score
            </label>
            <select
              id="minCredibilityScore"
              value={formData.minCredibilityScore}
              onChange={(e) => handleInputChange('minCredibilityScore', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.minCredibilityScore ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value={0}>No Minimum</option>
              <option value={800}>Questionable (800+)</option>
              <option value={1200}>Neutral (1200+)</option>
              <option value={1400}>Neutral (1400+)</option>
              <option value={1600}>Known (1600+)</option>
              <option value={1800}>Established (1800+)</option>
              <option value={2000}>Reputable (2000+)</option>
            </select>
            {errors.minCredibilityScore && (
              <p className="mt-1 text-sm text-red-600">{errors.minCredibilityScore}</p>
            )}
          </div>
        </div>

        {/* Duration Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Submission Duration */}
          <div>
            <label htmlFor="submissionDuration" className="block text-sm font-medium text-gray-700 mb-2">
              Submission Duration
            </label>
            <select
              id="submissionDuration"
              value={formData.submissionDuration}
              onChange={(e) => handleInputChange('submissionDuration', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.submissionDuration ? 'border-red-300' : 'border-gray-300'
              }`}
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
              <p className="mt-1 text-sm text-red-600">{errors.submissionDuration}</p>
            )}
          </div>

          {/* Voting Duration */}
          <div>
            <label htmlFor="votingDuration" className="block text-sm font-medium text-gray-700 mb-2">
              Voting Duration
            </label>
            <select
              id="votingDuration"
              value={formData.votingDuration}
              onChange={(e) => handleInputChange('votingDuration', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.votingDuration ? 'border-red-300' : 'border-gray-300'
              }`}
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
              <p className="mt-1 text-sm text-red-600">{errors.votingDuration}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !canCreateContest}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              loading || !canCreateContest
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Contest'}
          </button>
        </div>

        {/* Warning for insufficient credibility */}
        {!canCreateContest && !scoreLoading && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Cannot Create Contest</h4>
            <p className="text-sm text-yellow-700">
              You need a credibility score of at least 1,400 (Neutral level) to create contests. 
              Build your reputation on Ethos to unlock contest creation.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
