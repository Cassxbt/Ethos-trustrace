'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethosClient } from '@/lib/ethos-client';
import { CredibilityScore } from './CredibilityScore';

interface EthosProfileProps {
  address?: string;
  showActions?: boolean;
}

export function EthosProfile({ address, showActions = true }: EthosProfileProps) {
  const { address: connectedAddress } = useAccount();
  const [profile, setProfile] = useState<any>(null);
  const [vouches, setVouches] = useState<any[]>([]);
  const [attestations, setAttestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'vouches' | 'attestations'>('vouches');

  const targetAddress = address || connectedAddress;

  useEffect(() => {
    if (!targetAddress) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const [profileData, vouchesData, attestationsData] = await Promise.all([
          ethosClient.getUserProfile(targetAddress),
          ethosClient.getUserVouches(targetAddress),
          ethosClient.getUserAttestations(targetAddress)
        ]);

        setProfile(profileData);
        setVouches(vouchesData);
        setAttestations(attestationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Ethos profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetAddress]);

  if (!targetAddress) {
    return <div className="text-gray-500">Connect wallet to view Ethos profile</div>;
  }

  if (loading) {
    return <div className="text-gray-500">Loading Ethos profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="text-gray-500">No Ethos profile found</div>;
  }

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ethos Profile</h2>
            <p className="text-gray-600 font-mono">
              {formatAddress(targetAddress)}
            </p>
          </div>
          <CredibilityScore address={targetAddress} compact />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {profile.vouchesReceived || 0}
            </div>
            <div className="text-sm text-gray-600">Vouches Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {profile.vouchesGiven || 0}
            </div>
            <div className="text-sm text-gray-600">Vouches Given</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {profile.attestations || 0}
            </div>
            <div className="text-sm text-gray-600">Attestations</div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('vouches')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'vouches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Vouches ({vouches.length})
            </button>
            <button
              onClick={() => setActiveTab('attestations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attestations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Attestations ({attestations.length})
            </button>
          </nav>
        </div>

        <div className="space-y-3">
          {activeTab === 'vouches' && (
            <>
              {vouches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No vouches found
                </div>
              ) : (
                vouches.map((vouch, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatAddress(vouch.voucher)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {vouch.voucher === targetAddress ? 'Vouched for' : 'Received vouch from'}{' '}
                        {formatAddress(vouch.vouchee)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {parseFloat(vouch.amount).toFixed(4)} ETH
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(vouch.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'attestations' && (
            <>
              {attestations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No attestations found
                </div>
              ) : (
                attestations.map((attestation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatAddress(attestation.attestant)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Attested {attestation.value ? 'positively' : 'negatively'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${attestation.value ? 'text-green-600' : 'text-red-600'}`}>
                        {attestation.value ? '✓ Positive' : '✗ Negative'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(attestation.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
