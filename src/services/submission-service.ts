'use client';

import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export interface Submission {
  id: string;
  contestId: string;
  submitter: string;
  contentURI: string;
  title: string;
  description: string;
  voteCount: string;
  credibilityWeightedVotes: string;
  createdAt: number;
}

interface SubmissionRecord {
  contestId: string;
  submitter: string;
  contentURI: string;
  title: string;
  description: string;
  voteCount: number;
  credibilityWeightedVotes: number;
  createdAt: number;
}

const submissionsCollection = collection(db, 'submissions');

const mapSubmission = (id: string, data: SubmissionRecord): Submission => ({
  id,
  contestId: data.contestId,
  submitter: data.submitter,
  contentURI: data.contentURI,
  title: data.title,
  description: data.description,
  voteCount: data.voteCount.toString(),
  credibilityWeightedVotes: data.credibilityWeightedVotes.toString(),
  createdAt: data.createdAt,
});

export async function getSubmissionsByContest(contestId: string): Promise<Submission[]> {
  const submissionsQuery = query(
    submissionsCollection,
    where('contestId', '==', contestId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(submissionsQuery);
  return snapshot.docs.map((submissionDoc) =>
    mapSubmission(submissionDoc.id, submissionDoc.data() as SubmissionRecord)
  );
}

export async function createSubmission(params: {
  contestId: string;
  submitter: string;
  contentURI: string;
  title: string;
  description: string;
}): Promise<string> {
  const record: SubmissionRecord = {
    contestId: params.contestId,
    submitter: params.submitter,
    contentURI: params.contentURI,
    title: params.title.trim(),
    description: params.description.trim(),
    voteCount: 0,
    credibilityWeightedVotes: 0,
    createdAt: Math.floor(Date.now() / 1000),
  };

  const submissionDoc = await addDoc(submissionsCollection, record);
  return submissionDoc.id;
}

export async function updateSubmissionVoteTotals(params: {
  submissionId: string;
  voteCount: number;
  credibilityWeightedVotes: number;
}): Promise<void> {
  const submissionRef = doc(db, 'submissions', params.submissionId);
  await updateDoc(submissionRef, {
    voteCount: params.voteCount,
    credibilityWeightedVotes: params.credibilityWeightedVotes,
  });
}

export async function incrementSubmissionVotes(params: {
  submissionId: string;
  voteDelta: number;
  weightedDelta: number;
}): Promise<void> {
  const submissionRef = doc(db, 'submissions', params.submissionId);
  await updateDoc(submissionRef, {
    voteCount: increment(params.voteDelta),
    credibilityWeightedVotes: increment(params.weightedDelta),
  });
}
