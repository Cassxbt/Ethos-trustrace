'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContestCard } from './ContestCard';
import { SubmissionCard } from './SubmissionCard';
import { CredibilityScore } from '@/components/ethos/CredibilityScore';

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
  
  const [contest, setContest] = useState<Contest | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, VoteData>>({});
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const now = Date.now();
  const isSubmissionPhase = contest && now < (contest.submissionDeadline * 1000);
  const isVotingPhase = contest && now >= (contest.submissionDeadline * 1000) && now < (contest.votingDeadline * 1000);
  const isEnded = contest && now >= (contest.votingDeadline * 1000);

  useEffect(() => {
    const fetchContestData = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual Firebase/contract calls
        // const [contestData, submissionsData, votesData] = await Promise.all([
        //   contestsService.getContest(contestId),
        //   submissionsService.getContestSubmissions(contestId),
        //   votesService.getUserVotes(contestId)
        // ]);
        
        // Mock data for now
        const mockContest: Contest = {
          id: contestId,
          title: 'Best Meme of the Week',
          prompt: 'Create the funniest meme about Web3 and decentralized systems',
          creator: '0x1234567890123456789012345678901234567890',
          submissionDeadline: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60,
          votingDeadline: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
          rewardsPool: '0.5',
          minCredibilityScore: 1200,
          isActive: true,
          submissionCount: 5,
          totalVotes: '2.5',
          totalWeightedVotes: '5.2',
          createdAt: Math.floor(Date.now() / 1000) - 24 * 60 * 60
        };

        const mockSubmissions: Submission[] = [
          {
            id: '1',
            contestId,
            submitter: '0x2345678901234567890123456789012345678901',
            contentURI: 'ipfs://QmExample1',
            voteCount: '0.8',
            credibilityWeightedVotes: '1.6',
            createdAt: Math.floor(Date.now() / 1000) - 12 * 60 * 60
          },
          {
            id: '2',
            contestId,
            submitter: '0x3456789012345678901234567890123456789012',
            contentURI: 'ipfs://QmExample2',
            voteCount: '1.2',
            credibilityWeightedVotes: '2.4',
            createdAt: Math.floor(Date.now() / 1000) - 6 * 60 * 60
          },
          {
            id: '3',
            contestId,
            submitter: '0x4567890123456789012345678901234567890123',
            contentURI: 'ipfs://QmExample3',
            voteCount: '0.5',
            credibilityWeightedVotes: '1.2',
            createdAt: Math.floor(Date.now() / 1000) - 2 * 60 * 60
          }
        ];

        const mockVotes: Record<string, VoteData> = {
          '1': {
            amount: '0.1',
            credibilityWeight: 2,
            votingPower: 2
          }
        };

        setContest(mockContest);
        setSubmissions(mockSubmissions);
        setUserVotes(mockVotes);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contest');
      } finally {
        setLoading(false);
      }
    };

    if (contestId) {
      fetchContestData();
    }
  }, [contestId]);

  const handleVote = async (submissionId: string, amount: string) => {
    setVotingLoading(prev => ({ ...prev, [submissionId]: true }));
    
    try {
      // TODO: Replace with actual contract call
      console.log('Voting:', { submissionId, amount });
      
      // Simulate contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state optimistically
      setUserVotes(prev => ({
        ...prev,
        [submissionId]: {
          amount,
          credibilityWeight: 2, // Mock - would come from user's actual score
          votingPower: 2
        }
      }));
      
      // Update submission vote counts
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId 
          ? { 
              ...sub, 
              voteCount: (parseFloat(sub.voteCount) + parseFloat(amount)).toString(),
              credibilityWeightedVotes: (parseFloat(sub.credibilityWeightedVotes) + parseFloat(amount) * 2).toString()
            }
          : sub
      ));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
    } finally {
      setVotingLoading(prev => ({ ...prev, [submissionId]: false }));
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

        {/* Submissions */}
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

        {/* Submit Entry Button */}
        {isSubmissionPhase && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Entry</h3>
            <p className="text-gray-600 mb-6">
              Share your creative response to the contest prompt
            </p>
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={() => {
                // TODO: Implement submission modal/page
                alert('Submission form coming soon!');
              }}
            >
              Submit Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
