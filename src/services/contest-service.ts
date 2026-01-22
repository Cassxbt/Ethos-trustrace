'use client';

import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

export interface Contest {
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

interface ContestRecord {
  title: string;
  prompt: string;
  creator: string;
  submissionDeadline: number;
  votingDeadline: number;
  rewardsPool: number;
  minCredibilityScore: number;
  isActive: boolean;
  submissionCount: number;
  totalVotes: number;
  totalWeightedVotes: number;
  createdAt: number;
}

const contestsCollection = collection(db, 'contests');

const mapContest = (id: string, data: ContestRecord): Contest => ({
  id,
  title: data.title,
  prompt: data.prompt,
  creator: data.creator,
  submissionDeadline: data.submissionDeadline,
  votingDeadline: data.votingDeadline,
  rewardsPool: data.rewardsPool.toString(),
  minCredibilityScore: data.minCredibilityScore,
  isActive: data.isActive,
  submissionCount: data.submissionCount,
  totalVotes: data.totalVotes.toString(),
  totalWeightedVotes: data.totalWeightedVotes.toString(),
  createdAt: data.createdAt,
});

export async function getContests(): Promise<Contest[]> {
  const contestQuery = query(contestsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(contestQuery);
  return snapshot.docs.map((contestDoc) => mapContest(contestDoc.id, contestDoc.data() as ContestRecord));
}

export async function getContestById(contestId: string): Promise<Contest | null> {
  const contestRef = doc(db, 'contests', contestId);
  const snapshot = await getDoc(contestRef);
  if (!snapshot.exists()) return null;
  return mapContest(snapshot.id, snapshot.data() as ContestRecord);
}

export async function createContest(params: {
  title: string;
  prompt: string;
  rewardsPool: string;
  submissionDuration: number;
  votingDuration: number;
  minCredibilityScore: number;
  creator: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const submissionDeadline = now + params.submissionDuration;
  const votingDeadline = submissionDeadline + params.votingDuration;

  const record: ContestRecord = {
    title: params.title.trim(),
    prompt: params.prompt.trim(),
    creator: params.creator,
    submissionDeadline,
    votingDeadline,
    rewardsPool: parseFloat(params.rewardsPool),
    minCredibilityScore: params.minCredibilityScore,
    isActive: true,
    submissionCount: 0,
    totalVotes: 0,
    totalWeightedVotes: 0,
    createdAt: now,
  };

  const contestDoc = await addDoc(contestsCollection, record);
  return contestDoc.id;
}

export async function updateContestStatus(contestId: string, isActive: boolean): Promise<void> {
  const contestRef = doc(db, 'contests', contestId);
  await updateDoc(contestRef, { isActive });
}

export async function incrementContestSubmissions(contestId: string, by: number): Promise<void> {
  const contestRef = doc(db, 'contests', contestId);
  await updateDoc(contestRef, {
    submissionCount: increment(by),
  });
}

export async function incrementContestVotes(params: {
  contestId: string;
  voteDelta: number;
  weightedDelta: number;
}): Promise<void> {
  const contestRef = doc(db, 'contests', params.contestId);
  await updateDoc(contestRef, {
    totalVotes: increment(params.voteDelta),
    totalWeightedVotes: increment(params.weightedDelta),
  });
}
