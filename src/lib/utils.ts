// Utility functions for TrustRace

export function formatAddress(address: string, length = 6): string {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-4)}`;
}

export function formatTimeRemaining(timestamp: number): string {
  const now = Date.now();
  const diff = timestamp - now;
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${minutes}m ago`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatEther(amount: string | number, decimals = 3): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return value.toFixed(decimals);
}

export function parseEther(amount: string): string {
  return (parseFloat(amount) * 1e18).toString();
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidIPFS(uri: string): boolean {
  return uri.startsWith('ipfs://') || /^Qm[1-9A-HJ-NP-Z-a-km-z]{44,}$/.test(uri);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  } finally {
    document.body.removeChild(textArea);
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function calculateVotingPower(credibilityScore: number): number {
  return Math.max(1, Math.floor(credibilityScore / 1000));
}

export function getCredibilityLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score < 800) {
    return {
      level: 'Questionable',
      color: 'text-red-600',
      description: 'Low credibility score'
    };
  } else if (score < 1200) {
    return {
      level: 'Unknown',
      color: 'text-orange-600',
      description: 'Unknown credibility'
    };
  } else if (score < 1400) {
    return {
      level: 'Neutral',
      color: 'text-yellow-600',
      description: 'Neutral credibility'
    };
  } else if (score < 1600) {
    return {
      level: 'Known',
      color: 'text-green-600',
      description: 'Known credibility'
    };
  } else if (score < 1800) {
    return {
      level: 'Established',
      color: 'text-blue-600',
      description: 'Established credibility'
    };
  } else if (score < 2000) {
    return {
      level: 'Reputable',
      color: 'text-purple-600',
      description: 'Reputable credibility'
    };
  } else {
    return {
      level: 'Legendary',
      color: 'text-indigo-600',
      description: 'Legendary credibility'
    };
  }
}

export function validateContestData(data: {
  title: string;
  prompt: string;
  rewardsPool: string;
  submissionDuration: number;
  votingDuration: number;
  minCredibilityScore: number;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!data.prompt.trim()) {
    errors.prompt = 'Prompt is required';
  } else if (data.prompt.length > 1000) {
    errors.prompt = 'Prompt must be less than 1000 characters';
  }

  if (!data.rewardsPool.trim() || parseFloat(data.rewardsPool) <= 0) {
    errors.rewardsPool = 'Valid reward amount is required';
  }

  if (data.submissionDuration < 3600) {
    errors.submissionDuration = 'Submission duration must be at least 1 hour';
  }

  if (data.votingDuration < 3600) {
    errors.votingDuration = 'Voting duration must be at least 1 hour';
  }

  if (data.minCredibilityScore < 0 || data.minCredibilityScore > 2800) {
    errors.minCredibilityScore = 'Invalid credibility score range';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
