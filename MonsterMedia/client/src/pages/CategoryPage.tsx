import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { getContentByType } from '@/lib/api';
import ContentGrid from '@/components/content/ContentGrid';
import { Loader2 } from 'lucide-react';

// Helper function to format category name
const formatCategoryName = (type: string): string => {
  switch (type) {
    case 'anime':
      return 'Anime';
    case 'music':
      return 'Music';
    case 'movie':
      return 'Movies';
    case 'manga':
      return 'Manga';
    case 'tv':
      return 'TV Shows';
    case 'vip':
      return 'VIP Content';
    case 'latest':
      return 'Latest Releases';
    case 'trending':
      return 'Trending Now';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export default function CategoryPage() {
  const params = useParams();
  const categoryType = params.type || '';
  
  // Special handling for "vip" category, which isn't a content type but a filter
  const endpoint = categoryType === 'vip' ? '/api/content/vip' : `/api/content/type/${categoryType}`;
  const isVipCategory = categoryType === 'vip';
  
  // Query for category content
  const { data: contents, isLoading, error } = useQuery({
    queryKey: [endpoint],
    queryFn: () => isVipCategory 
      ? getContentByType('vip', 24) // We're reusing the function but it actually calls a different endpoint
      : getContentByType(categoryType, 24),
    enabled: !!categoryType,
  });
  
  const categoryTitle = formatCategoryName(categoryType);
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Content</h2>
          <p className="text-muted-foreground">
            {(error as Error).message || `Failed to load ${categoryTitle.toLowerCase()} content.`}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryTitle}</h1>
        <p className="text-muted-foreground mt-2">
          {isVipCategory 
            ? 'Exclusive content available only to VIP members'
            : `Explore our collection of ${categoryTitle.toLowerCase()}`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading {categoryTitle.toLowerCase()}...</span>
        </div>
      ) : (
        <ContentGrid 
          contents={contents || []}
          columns={6}
          emptyMessage={`No ${categoryTitle.toLowerCase()} content found`}
        />
      )}
    </div>
  );
}
