'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ContestCard } from './ContestCard';
import { SubmissionCard } from './SubmissionCard';
import { SubmitEntryForm, EntryData } from './SubmitEntryForm';
import { CredibilityScore } from '@/components/ethos/CredibilityScore';
import { useEthosScore } from '@/hooks/useEthosScore';
import { getVotePower } from '@/lib/reputation-tiers';
import {
  getContestById,
  incrementContestSubmissions,
  incrementContestVotes,
} from '@/services/contest-service';
import {
  createSubmission,
  getSubmissionsByContest,
  incrementSubmissionVotes,
  Submission as SubmissionRecord,
} from '@/services/submission-service';
import { createVote, getVotesForUserContest } from '@/services/vote-service';

interface Contest {
  id: string;
  title: string;
  prompt: string;
  creator: string;
  submissionDeadline: number;
  votingDeadline: number;
  rewardsPool: string;
  minCredibilityScore: number;
  isActive: boolean;
  submissionCount: number;
  totalVotes: string;
  totalWeightedVotes: string;
  createdAt: number;
}

interface Submission {
  id: string;
  contestId: string;
  submitter: string;
  contentURI: string;
  title?: string;
  description?: string;
  voteCount: string;
  credibilityWeightedVotes: string;
  createdAt: number;
}

interface VoteData {
  amount: string;
  credibilityWeight: number;
  votingPower: number;
}

export default function ContestDetail() {
  const params = useParams();
  const router = useRouter();
  const contestId = params.id as string;
  const { address } = useAccount();
  const { score: ethosScore } = useEthosScore(address);
  
  const [contest, setContest] = useState<Contest | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, VoteData>>({});
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const now = Date.now();
  const isSubmissionPhase = Boolean(contest && now < contest.submissionDeadline * 1000);
  const isVotingPhase = Boolean(
    contest && now >= contest.submissionDeadline * 1000 && now < contest.votingDeadline * 1000
  );
  const isEnded = Boolean(contest && now >= contest.votingDeadline * 1000);

  useEffect(() => {
    const fetchContestData = async () => {
      setLoading(true);
      setError(null);

      try {
        const contestData = await getContestById(contestId);
        if (!contestData) {
          setContest(null);
          setSubmissions([]);
          setUserVotes({});
          return;
        }

        const submissionsData = await getSubmissionsByContest(contestId);
        const votesData = address
          ? await getVotesForUserContest({ contestId, voter: address })
          : {};

        const mappedVotes = Object.fromEntries(
          Object.entries(votesData).map(([submissionId, vote]) => [
            submissionId,
            {
              amount: vote.amount.toString(),
              credibilityWeight: vote.credibilityWeight,
              votingPower: vote.votingPower,
            },
          ])
        );

        setContest(contestData);
        setSubmissions(submissionsData);
        setUserVotes(mappedVotes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contest');
      } finally {
        setLoading(false);
      }
    };

    if (contestId) {
      fetchContestData();
    }
  }, [contestId, address]);

  const handleVote = async (submissionId: string, amount: string) => {
    setVotingLoading(prev => ({ ...prev, [submissionId]: true }));
    
    try {
      if (!address) {
        throw new Error('Connect your wallet to vote.');
      }
      if (!contest) {
        throw new Error('Contest not found.');
      }

      const voteAmount = parseFloat(amount);
      const votingPower = ethosScore ? getVotePower(ethosScore.score) : 1;
      const credibilityWeight = votingPower;
      const weightedVotes = voteAmount * votingPower;

      await createVote({
        contestId: contest.id,
        submissionId,
        voter: address,
        amount: voteAmount,
        credibilityWeight,
        votingPower,
      });

      await incrementSubmissionVotes({
        submissionId,
        voteDelta: voteAmount,
        weightedDelta: weightedVotes,
      });

      await incrementContestVotes({
        contestId: contest.id,
        voteDelta: voteAmount,
        weightedDelta: weightedVotes,
      });

      setUserVotes(prev => ({
        ...prev,
        [submissionId]: {
          amount: voteAmount.toString(),
          credibilityWeight,
          votingPower,
        },
      }));

      setSubmissions(prev =>
        prev.map(submission =>
          submission.id === submissionId
            ? {
                ...submission,
                voteCount: (parseFloat(submission.voteCount) + voteAmount).toString(),
                credibilityWeightedVotes: (
                  parseFloat(submission.credibilityWeightedVotes) + weightedVotes
                ).toString(),
              }
            : submission
        )
      );

      setContest(prev =>
        prev
          ? {
              ...prev,
              totalVotes: (parseFloat(prev.totalVotes) + voteAmount).toString(),
              totalWeightedVotes: (
                parseFloat(prev.totalWeightedVotes) + weightedVotes
              ).toString(),
            }
          : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setVotingLoading(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  const handleSubmitEntry = async (entryData: EntryData) => {
    if (!address) {
      setError('Connect your wallet to submit.');
      return;
    }
    if (!contest) {
      setError('Contest not found.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const submissionId = await createSubmission({
        contestId: contest.id,
        submitter: address,
        contentURI: entryData.contentURI,
        title: entryData.title,
        description: entryData.description,
      });

      await incrementContestSubmissions(contest.id, 1);

      const newSubmission: SubmissionRecord = {
        id: submissionId,
        contestId: contest.id,
        submitter: address,
        contentURI: entryData.contentURI,
        title: entryData.title,
        description: entryData.description,
        voteCount: '0',
        credibilityWeightedVotes: '0',
        createdAt: Math.floor(Date.now() / 1000),
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      setContest(prev =>
        prev
          ? { ...prev, submissionCount: prev.submissionCount + 1 }
          : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit entry');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-gray-900 font-medium">Error loading contest</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-medium">Contest not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contest Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/contests')}
            className="mb-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Contests
          </button>
          
          <ContestCard contest={contest} showCreator={true} />
        </div>

        {/* Contest Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contest Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                isSubmissionPhase ? 'text-green-600' : 
                isVotingPhase ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {isSubmissionPhase ? '📝' : isVotingPhase ? '🗳️' : '🏁'}
              </div>
              <div className="text-sm text-gray-600">
                {isSubmissionPhase ? 'Submission Phase' : 
                 isVotingPhase ? 'Voting Phase' : 'Contest Ended'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {isSubmissionPhase ? 
                  Math.max(0, Math.floor((contest.submissionDeadline * 1000 - now) / (1000 * 60 * 60 * 24))) : 
                  isVotingPhase ? 
                  Math.max(0, Math.floor((contest.votingDeadline * 1000 - now) / (1000 * 60 * 60 * 24))) : 
                  0
                }d
              </div>
              <div className="text-sm text-gray-600">
                {isSubmissionPhase ? 'until voting' : isVotingPhase ? 'until deadline' : 'completed'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {contest.submissionCount}
              </div>
              <div className="text-sm text-gray-600">Submissions</div>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Created By</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="font-mono text-gray-900 mb-2">
                {contest.creator.slice(0, 6)}...{contest.creator.slice(-4)}
              </div>
              <div className="text-sm text-gray-600">
                Minimum credibility required: {contest.minCredibilityScore}
              </div>
            </div>
            <CredibilityScore address={contest.creator} />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Submissions ({contest.submissionCount})
          </h2>
          
          {submissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4 text-4xl">📋</div>
              <p className="text-gray-900 font-medium mb-2">No submissions yet</p>
              {isSubmissionPhase && (
                <p className="text-gray-600 text-sm">
                  Be the first to submit an entry!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {submissions
                .sort((a, b) => parseFloat(b.credibilityWeightedVotes) - parseFloat(a.credibilityWeightedVotes))
                .map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    showVoting={isVotingPhase}
                    userVote={userVotes[submission.id] || undefined}
                    onVote={isVotingPhase ? handleVote : undefined}
                    loading={votingLoading[submission.id] || false}
                  />
                ))}
            </div>
          )}
        </div>

        {isSubmissionPhase && (
          <SubmitEntryForm
            contestId={contest.id}
            contestTitle={contest.title}
            onSubmit={handleSubmitEntry}
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
}
