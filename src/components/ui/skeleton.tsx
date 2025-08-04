import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          'animate-pulse rounded-md bg-white/20 dark:bg-black/20 backdrop-blur-sm',
          className
        )}
      />
      {/* Shimmer Effect */}
      <div 
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent"
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="relative rounded-2xl p-[1px] overflow-hidden">
      {/* Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 animate-pulse" />
      
      {/* Inner Card */}
      <div className="relative bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-2xl p-6">
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-48" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-8 w-20" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-16" />
      </td>
    </tr>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="relative rounded-2xl p-[1px] overflow-hidden">
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-accent-purple/20 to-accent-pink/20 animate-gradient" />
      
      {/* Inner Card */}
      <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}