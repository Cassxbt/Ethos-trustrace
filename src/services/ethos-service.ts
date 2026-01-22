import { ethosClient } from '@/lib/ethos-client';

export interface EthosUserProfile {
  address: string;
  credibilityScore: number;
  vouchesReceived: number;
  vouchesGiven: number;
  attestations: number;
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface VouchData {
  voucher: string;
  vouchee: string;
  amount: string;
  timestamp: string;
}

export interface AttestationData {
  id: string;
  attestant: string;
  subject: string;
  value: boolean;
  timestamp: string;
}

export class EthosService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Get user profile with caching
  async getUserProfile(address: string): Promise<EthosUserProfile> {
    const cacheKey = `profile-${address}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const [profileData, vouches, attestations] = await Promise.all([
        ethosClient.getUserProfile(address),
        ethosClient.getUserVouches(address),
        ethosClient.getUserAttestations(address)
      ]);

      const userProfile: EthosUserProfile = {
        address,
        credibilityScore: profileData.credibilityScore || 0,
        vouchesReceived: vouches.length,
        vouchesGiven: profileData.vouchesGiven || 0,
        attestations: attestations.length,
        name: (profileData as any).profile?.name || '',
        bio: (profileData as any).profile?.bio || '',
        avatar: (profileData as any).profile?.avatar || ''
      };

      this.setCache(cacheKey, userProfile);
      return userProfile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  // Get credibility score with caching
  async getCredibilityScore(address: string): Promise<number> {
    const cacheKey = `score-${address}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached !== null) {
      return cached;
    }

    try {
      const score = await ethosClient.getCredibilityScore(address);
      this.setCache(cacheKey, score);
      return score;
    } catch (error) {
      console.error('Failed to fetch credibility score:', error);
      throw error;
    }
  }

  // Get user vouches
  async getUserVouches(address: string): Promise<VouchData[]> {
    const cacheKey = `vouches-${address}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const vouches = await ethosClient.getUserVouches(address);
      this.setCache(cacheKey, vouches);
      return vouches;
    } catch (error) {
      console.error('Failed to fetch user vouches:', error);
      throw error;
    }
  }

  // Get user attestations
  async getUserAttestations(address: string): Promise<AttestationData[]> {
    const cacheKey = `attestations-${address}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const attestations = await ethosClient.getUserAttestations(address);
      this.setCache(cacheKey, attestations);
      return attestations;
    } catch (error) {
      console.error('Failed to fetch user attestations:', error);
      throw error;
    }
  }

  // Batch fetch multiple user profiles
  async batchGetUserProfiles(addresses: string[]): Promise<EthosUserProfile[]> {
    const profiles = await Promise.allSettled(
      addresses.map(address => this.getUserProfile(address))
    );

    return profiles
      .filter((result): result is PromiseFulfilledResult<EthosUserProfile> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  // Check if user meets minimum credibility requirement
  async checkCredibilityRequirement(
    address: string, 
    minimumScore: number
  ): Promise<boolean> {
    try {
      const score = await this.getCredibilityScore(address);
      return score >= minimumScore;
    } catch (error) {
      console.error('Failed to check credibility requirement:', error);
      return false;
    }
  }

  // Get credibility level
  getCredibilityLevel(score: number): string {
    if (score < 800) return 'Untrusted';
    if (score < 1200) return 'Questionable';
    if (score < 1400) return 'Neutral';
    if (score < 1600) return 'Known';
    if (score < 1800) return 'Established';
    if (score < 2000) return 'Reputable';
    if (score < 2200) return 'Exemplary';
    if (score < 2400) return 'Distinguished';
    if (score < 2600) return 'Revered';
    return 'Renowned';
  }

  // Calculate voting power based on credibility score
  calculateVotingPower(score: number): number {
    return Math.floor(score / 1000);
  }

  // Check if user can create contests
  canCreateContest(score: number): boolean {
    return score >= 1400; // Minimum "Neutral" level
  }

  // Get credibility statistics for a user
  async getCredibilityStats(address: string): Promise<{
    score: number;
    level: string;
    votingPower: number;
    canCreateContest: boolean;
    vouchesReceived: number;
    vouchesGiven: number;
    attestations: number;
  }> {
    const profile = await this.getUserProfile(address);
    
    return {
      score: profile.credibilityScore,
      level: this.getCredibilityLevel(profile.credibilityScore),
      votingPower: this.calculateVotingPower(profile.credibilityScore),
      canCreateContest: this.canCreateContest(profile.credibilityScore),
      vouchesReceived: profile.vouchesReceived,
      vouchesGiven: profile.vouchesGiven,
      attestations: profile.attestations
    };
  }

  // Cache helper methods
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear cache for specific address
  clearCacheForAddress(address: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(address)
    );
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const ethosService = new EthosService();
