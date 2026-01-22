'use client';

import { storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function uploadSubmissionFile(params: {
  contestId: string;
  submitter: string;
  file: File;
}): Promise<string> {
  const sanitizedName = params.file.name.replace(/\s+/g, '-');
  const timestamp = Date.now();
  const storageRef = ref(
    storage,
    `contests/${params.contestId}/submissions/${params.submitter}/${timestamp}-${sanitizedName}`
  );

  await uploadBytes(storageRef, params.file);
  return getDownloadURL(storageRef);
}
