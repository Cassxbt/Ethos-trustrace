'use client';

import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

export interface VoteData {
  id: string;
  contestId: string;
  submissionId: string;
  voter: string;
  amount: number;
  credibilityWeight: number;
  votingPower: number;
  createdAt: number;
}

interface VoteRecord {
  contestId: string;
  submissionId: string;
  voter: string;
  amount: number;
  credibilityWeight: number;
  votingPower: number;
  createdAt: number;
}

const votesCollection = collection(db, 'votes');

const mapVote = (id: string, data: VoteRecord): VoteData => ({
  id,
  contestId: data.contestId,
  submissionId: data.submissionId,
  voter: data.voter,
  amount: data.amount,
  credibilityWeight: data.credibilityWeight,
  votingPower: data.votingPower,
  createdAt: data.createdAt,
});

export async function getVotesForUserContest(params: {
  contestId: string;
  voter: string;
}): Promise<Record<string, VoteData>> {
  const votesQuery = query(
    votesCollection,
    where('contestId', '==', params.contestId),
    where('voter', '==', params.voter),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(votesQuery);
  return snapshot.docs.reduce<Record<string, VoteData>>((acc, voteDoc) => {
    const vote = mapVote(voteDoc.id, voteDoc.data() as VoteRecord);
    acc[vote.submissionId] = vote;
    return acc;
  }, {});
}

export async function createVote(params: {
  contestId: string;
  submissionId: string;
  voter: string;
  amount: number;
  credibilityWeight: number;
  votingPower: number;
}): Promise<string> {
  const record: VoteRecord = {
    contestId: params.contestId,
    submissionId: params.submissionId,
    voter: params.voter,
    amount: params.amount,
    credibilityWeight: params.credibilityWeight,
    votingPower: params.votingPower,
    createdAt: Math.floor(Date.now() / 1000),
  };
  const voteDoc = await addDoc(votesCollection, record);
  return voteDoc.id;
}
