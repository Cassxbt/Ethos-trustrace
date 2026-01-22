const ETHOS_API_BASE = 'https://api.ethos.network/api/v2';

interface EthosUserProfile {
  address: string;
  credibilityScore: number;
  vouchesReceived: number;
  vouchesGiven: number;
  attestations: number;
}

interface Vouch {
  voucher: string;
  vouchee: string;
  amount: string;
  timestamp: string;
}

interface Attestation {
  id: string;
  attestant: string;
  subject: string;
  value: boolean;
  timestamp: string;
}

interface EthosClient {
  getCredibilityScore(address: string): Promise<number>;
  getUserProfile(address: string): Promise<EthosUserProfile>;
  getUserVouches(address: string): Promise<Vouch[]>;
  getUserAttestations(address: string): Promise<Attestation[]>;
  resolveENS(ensName: string): Promise<string | null>;
}

class EthosAPIClient implements EthosClient {
  private headers = {
    'X-Ethos-Client': 'trustrace@v1.0.0',
    'Content-Type': 'application/json'
  };

  private async resolveENSName(ensName: string): Promise<string | null> {
    try {
      const response = await fetch(`https://api.ethos.network/api/v2/ens/resolve/${ensName}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        console.warn(`ENS resolution failed for ${ensName}: ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      return data.address || null;
    } catch (error) {
      console.error(`Error resolving ENS name ${ensName}:`, error);
      return null;
    }
  }

  async resolveENS(ensName: string): Promise<string | null> {
    return this.resolveENSName(ensName);
  }

  async getCredibilityScore(addressOrENS: string): Promise<number> {
    let address = addressOrENS;
    
    // Check if input is an ENS name
    if (addressOrENS.endsWith('.eth')) {
      const resolvedAddress = await this.resolveENSName(addressOrENS);
      if (!resolvedAddress) {
        throw new Error(`Failed to resolve ENS name: ${addressOrENS}`);
      }
      address = resolvedAddress;
    }
    
    const response = await fetch(
      `${ETHOS_API_BASE}/score/address?address=${address}`,
      { headers: this.headers }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch credibility score: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.score;
  }

  async getUserProfile(addressOrENS: string): Promise<EthosUserProfile> {
    let address = addressOrENS;
    
    // Check if input is an ENS name
    if (addressOrENS.endsWith('.eth')) {
      const resolvedAddress = await this.resolveENSName(addressOrENS);
      if (!resolvedAddress) {
        throw new Error(`Failed to resolve ENS name: ${addressOrENS}`);
      }
      address = resolvedAddress;
    }
    
    const response = await fetch(
      `${ETHOS_API_BASE}/user/by/address/${address}`,
      { headers: this.headers }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  }

  async getUserVouches(addressOrENS: string): Promise<Vouch[]> {
    let address = addressOrENS;
    
    // Check if input is an ENS name
    if (addressOrENS.endsWith('.eth')) {
      const resolvedAddress = await this.resolveENSName(addressOrENS);
      if (!resolvedAddress) {
        throw new Error(`Failed to resolve ENS name: ${addressOrENS}`);
      }
      address = resolvedAddress;
    }
    
    const response = await fetch(
      `${ETHOS_API_BASE}/vouches/by-user?userKey=address:${address}`,
      { headers: this.headers }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user vouches: ${response.statusText}`);
    }
    
    return await response.json();
  }

  async getUserAttestations(addressOrENS: string): Promise<Attestation[]> {
    let address = addressOrENS;
    
    // Check if input is an ENS name
    if (addressOrENS.endsWith('.eth')) {
      const resolvedAddress = await this.resolveENSName(addressOrENS);
      if (!resolvedAddress) {
        throw new Error(`Failed to resolve ENS name: ${addressOrENS}`);
      }
      address = resolvedAddress;
    }
    
    const response = await fetch(
      `${ETHOS_API_BASE}/attestations/by-user?userKey=address:${address}`,
      { headers: this.headers }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user attestations: ${response.statusText}`);
    }
    
    return await response.json();
  }
}

export const ethosClient = new EthosAPIClient();

// Credibility score levels
export function getCredibilityLevel(score: number): string {
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

// Cache for credibility scores
interface CachedScore {
  score: number;
  timestamp: number;
  address: string;
}

class EthosScoreCache {
  private cache: Map<string, CachedScore> = new Map();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 hour

  async getScore(address: string): Promise<number | null> {
    const cached = this.cache.get(address);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.score;
    }
    
    return null;
  }

  setScore(address: string, score: number): void {
    this.cache.set(address, {
      score,
      timestamp: Date.now(),
      address
    });
  }

  invalidate(address: string): void {
    this.cache.delete(address);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const ethosScoreCache = new EthosScoreCache();
