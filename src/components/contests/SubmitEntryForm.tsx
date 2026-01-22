'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { uploadSubmissionFile } from '@/services/storage-service';

interface SubmitEntryFormProps {
  contestId: string;
  contestTitle: string;
  onSubmit: (entryData: EntryData) => void;
  loading?: boolean;
}

export interface EntryData {
  contestId: string;
  title: string;
  description: string;
  contentURI: string;
}

export function SubmitEntryForm({ contestId, contestTitle, onSubmit, loading = false }: SubmitEntryFormProps) {
  const { address, isConnected } = useAccount();
  
  const [formData, setFormData] = useState<EntryData>({
    contestId,
    title: '',
    description: '',
    contentURI: ''
  });

  const [errors, setErrors] = useState<Partial<EntryData>>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<EntryData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.contentURI.trim()) {
      newErrors.contentURI = 'Content URI is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof EntryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    if (!address) {
      setErrors(prev => ({ ...prev, contentURI: 'Connect your wallet to upload files' }));
      return;
    }

    setFile(uploadedFile);
    setUploading(true);

    try {
      const uploadedUrl = await uploadSubmissionFile({
        contestId,
        submitter: address,
        file: uploadedFile,
      });
      setFormData(prev => ({ ...prev, contentURI: uploadedUrl }));
      setErrors(prev => ({ ...prev, contentURI: undefined }));
    } catch (err) {
      console.error('Upload failed:', err);
      setErrors(prev => ({ 
        ...prev, 
        contentURI: err instanceof Error ? err.message : 'Upload failed' 
      }));
    } finally {
      setUploading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Wallet Required</h3>
        <p className="text-gray-600">
          Connect your wallet to submit an entry to this contest
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Submit Entry to: {contestTitle}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Entry Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Give your entry a catchy title"
            maxLength={100}
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Describe your entry and explain your creative process"
            maxLength={1000}
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Content *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {file ? (
              <div className="space-y-2">
                <div className="text-green-600">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {formData.contentURI && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    ✓ Uploaded: {formData.contentURI}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFormData(prev => ({ ...prev, contentURI: '' }));
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div>
                <div className="text-gray-400 mb-4 text-4xl">📁</div>
                <p className="text-gray-600 mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept="image/*,.pdf,.doc,.docx"
                  disabled={loading || uploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer ${
                    loading || uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </label>
              </div>
            )}
          </div>
          {errors.contentURI && (
            <p className="mt-2 text-sm text-red-600">{errors.contentURI}</p>
          )}
        </div>

        {/* Content URI (auto-filled from upload) */}
        <div>
          <label htmlFor="contentURI" className="block text-sm font-medium text-gray-700 mb-2">
            Content URI *
          </label>
          <input
            type="text"
            id="contentURI"
            value={formData.contentURI}
            onChange={(e) => handleInputChange('contentURI', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.contentURI ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="ipfs://QmExample..."
            disabled={loading}
          />
          {errors.contentURI && (
            <p className="mt-1 text-sm text-red-600">{errors.contentURI}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            IPFS URI or other content identifier
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || uploading || !formData.contentURI}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              loading || uploading || !formData.contentURI
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Entry'}
          </button>
        </div>
      </form>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Submission Guidelines</h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• Ensure your content is original and follows the contest prompt</li>
          <li>• Files are uploaded to IPFS for decentralized storage</li>
          <li>• You can edit your submission until the deadline</li>
          <li>• All submissions become visible during the voting phase</li>
          <li>• Winners are determined by credibility-weighted voting</li>
        </ul>
      </div>
    </div>
  );
}
