'use client';

import { useState } from 'react';
import { CredibilityScore } from '@/components/ethos/CredibilityScore';

interface Submission {
  id: string;
  contestId: string;
  submitter: string;
  contentURI: string;
  voteCount: string;
  credibilityWeightedVotes: string;
  createdAt: number;
}

interface VoteData {
  amount: string;
  credibilityWeight: number;
  votingPower: number;
}

interface SubmissionCardProps {
  submission: Submission;
  showVoting?: boolean;
  compact?: boolean;
  userVote?: VoteData | null;
  onVote?: (submissionId: string, amount: string) => void;
  loading?: boolean;
}

export function SubmissionCard({ 
  submission, 
  showVoting = true, 
  compact = false,
  userVote = null,
  onVote,
  loading = false
}: SubmissionCardProps) {
  const [voteAmount, setVoteAmount] = useState('0.01');
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - (timestamp * 1000);
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const handleVote = () => {
    if (!onVote || !voteAmount || parseFloat(voteAmount) <= 0) return;
    onVote(submission.id, voteAmount);
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">Submission #{submission.id}</h4>
            <p className="text-sm text-gray-600">by {formatAddress(submission.submitter)}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Votes</div>
            <div className="font-semibold text-gray-900">{parseFloat(submission.voteCount).toFixed(2)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Submission #{submission.id}
          </h4>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>by {formatAddress(submission.submitter)}</span>
            <span>•</span>
            <span>{formatTimeAgo(submission.createdAt)}</span>
          </div>
        </div>
        
        {/* Credibility Score */}
        <div className="text-right">
          <CredibilityScore address={submission.submitter} compact />
        </div>
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">📄</div>
              <p className="text-sm">Content at: {submission.contentURI}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Total Votes</div>
          <div className="font-semibold text-gray-900">
            {parseFloat(submission.voteCount).toFixed(3)} ETH
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Weighted Votes</div>
          <div className="font-semibold text-blue-600">
            {parseFloat(submission.credibilityWeightedVotes).toFixed(2)}
          </div>
        </div>
      </div>

      {/* User's Vote */}
      {userVote && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-green-800">Your Vote</span>
              <div className="text-xs text-green-700">
                {parseFloat(userVote.amount).toFixed(3)} ETH 
                ({userVote.votingPower}x voting power)
              </div>
            </div>
            <div className="text-sm font-semibold text-green-800">
              ✓ Voted
            </div>
          </div>
        </div>
      )}

      {/* Voting Interface */}
      {showVoting && !userVote && (
        <div className="border-t border-gray-200 pt-4">
          <h5 className="font-medium text-gray-900 mb-3">Vote for this Submission</h5>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={voteAmount}
                onChange={(e) => setVoteAmount(e.target.value)}
                step="0.001"
                min="0.001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.01"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleVote}
              disabled={loading || !voteAmount || parseFloat(voteAmount) <= 0}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                loading || !voteAmount || parseFloat(voteAmount) <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? 'Voting...' : 'Vote'}
            </button>
          </div>
          
          {/* Voting Power Display */}
          <div className="mt-3 text-sm text-gray-600">
            Your vote will be multiplied by your credibility score voting power
          </div>
        </div>
      )}
    </div>
  );
}
