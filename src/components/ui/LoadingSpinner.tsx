'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
}

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ 
  loading, 
  children, 
  fallback,
  size = 'md'
}: LoadingStateProps) {
  if (loading) {
    return fallback || (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size={size} />
      </div>
    );
  }

  return <>{children}</>;
}

interface FullPageLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FullPageLoading({ 
  message = 'Loading...', 
  size = 'lg' 
}: FullPageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={size} />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface CardLoadingProps {
  lines?: number;
  height?: string;
}

export function CardLoading({ lines = 3, height = 'h-24' }: CardLoadingProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="space-y-3">
        <div className={`h-4 bg-gray-200 rounded w-3/4`}></div>
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div key={i} className={`h-4 bg-gray-200 rounded ${i === lines - 2 ? 'w-1/2' : 'w-full'}`}></div>
        ))}
      </div>
    </div>
  );
}
