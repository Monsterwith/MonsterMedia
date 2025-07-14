import { Content } from '@/lib/types';
import ContentCard from './ContentCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentGridProps {
  contents: Content[];
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: number;
}

export default function ContentGrid({
  contents,
  isLoading = false,
  emptyMessage = "No content found",
  columns = 6,
}: ContentGridProps) {
  // Determine the Tailwind grid classes based on columns
  const gridClass = `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(columns, 6)} gap-4`;
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="content-card relative rounded-lg overflow-hidden bg-card">
            <Skeleton className="aspect-[2/3] w-full" />
            <div className="p-2">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Empty state
  if (contents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  // Content grid
  return (
    <div className={gridClass}>
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}
