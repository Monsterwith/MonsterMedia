import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  className?: string;
  variant?: 'spinner' | 'pulse' | 'skeleton' | 'dots';
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingAnimation({ 
  className, 
  variant = 'spinner', 
  size = 'md' 
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )} />
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn(
        "animate-pulse bg-gray-200 rounded",
        sizeClasses[size],
        className
      )} />
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1", className)}>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    );
  }

  // skeleton variant
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-gray-200 rounded h-4 w-full mb-2" />
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
      <div className="bg-gray-200 rounded h-4 w-1/2" />
    </div>
  );
}

// Content card skeleton for grid layouts
export function ContentCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white rounded-lg border p-4", className)}>
      <div className="bg-gray-200 rounded-lg h-48 w-full mb-4" />
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
      <div className="bg-gray-200 rounded h-4 w-1/2 mb-2" />
      <div className="bg-gray-200 rounded h-3 w-full" />
    </div>
  );
}

// Loading overlay for full sections
export function LoadingOverlay({ 
  isLoading, 
  children, 
  className,
  message = "Loading..." 
}: { 
  isLoading: boolean; 
  children: React.ReactNode;
  className?: string;
  message?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <LoadingAnimation variant="spinner" size="lg" />
            <p className="text-sm text-gray-600 font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Shimmer effect for content loading
export function ShimmerEffect({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
      className
    )} 
    style={{
      animation: 'shimmer 1.5s ease-in-out infinite',
    }}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}