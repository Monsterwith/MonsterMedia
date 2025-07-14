import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { searchContent } from '@/lib/api';
import ContentGrid from '@/components/content/ContentGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Link as LinkIcon } from 'lucide-react';
import { Content, ContentType } from '@/lib/types';
import { isValidUrl } from '@/lib/utils';

export default function SearchResultsPage() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState<{
    query: string;
    type?: ContentType;
  }>({ query: '' });
  const [activeTab, setActiveTab] = useState<string>('all');
  const [inputValue, setInputValue] = useState('');

  // Parse URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query') || '';
    const type = params.get('type') as ContentType | undefined;
    
    setSearchParams({ query, type });
    setInputValue(query);
    setActiveTab(type || 'all');
  }, [location]);

  // Query for search results
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['/api/search', searchParams.query, searchParams.type],
    queryFn: () => searchContent(searchParams.query, searchParams.type),
    enabled: !!searchParams.query,
  });

  // Filter results by content type for tabs
  const getFilteredResults = (type: string): Content[] => {
    if (!results) return [];
    if (type === 'all') return results;
    return results.filter(item => item.type === type);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const newParams = new URLSearchParams();
    newParams.set('query', inputValue);
    if (activeTab !== 'all') {
      newParams.set('type', activeTab);
    }
    
    window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    setSearchParams({ 
      query: inputValue, 
      type: activeTab !== 'all' ? activeTab as ContentType : undefined 
    });
  };

  // Count results by type for badges
  const getCounts = () => {
    if (!results) return { all: 0, anime: 0, music: 0, movie: 0, manga: 0, tv: 0 };
    
    const counts = {
      all: results.length,
      anime: 0,
      music: 0,
      movie: 0,
      manga: 0,
      tv: 0,
    };
    
    results.forEach(item => {
      if (item.type in counts) {
        counts[item.type as keyof typeof counts]++;
      }
    });
    
    return counts;
  };
  
  const counts = getCounts();
  const isUrl = isValidUrl(searchParams.query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search for content or enter URL..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-10"
            />
            {isUrl && (
              <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" size={16} />}
            Search
          </Button>
        </form>
        
        {/* Search metadata */}
        {searchParams.query && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : results && results.length > 0 ? (
                <>Found <span className="font-semibold">{results.length}</span> results for <span className="font-semibold">"{searchParams.query}"</span></>
              ) : (
                <>No results found for <span className="font-semibold">"{searchParams.query}"</span></>
              )}
            </p>
          </div>
        )}
        
        {/* Filter tabs */}
        {results && results.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">
                All ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="anime" disabled={counts.anime === 0}>
                Anime ({counts.anime})
              </TabsTrigger>
              <TabsTrigger value="music" disabled={counts.music === 0}>
                Music ({counts.music})
              </TabsTrigger>
              <TabsTrigger value="movie" disabled={counts.movie === 0}>
                Movies ({counts.movie})
              </TabsTrigger>
              <TabsTrigger value="manga" disabled={counts.manga === 0}>
                Manga ({counts.manga})
              </TabsTrigger>
              <TabsTrigger value="tv" disabled={counts.tv === 0}>
                TV Shows ({counts.tv})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center py-12">
          <p className="text-destructive text-lg mb-4">
            {(error as Error).message || "An error occurred while searching"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}
      
      {/* Results grid */}
      {!isLoading && !error && results && (
        <ContentGrid 
          contents={getFilteredResults(activeTab)}
          emptyMessage={`No ${activeTab === 'all' ? '' : activeTab} content found for "${searchParams.query}"`}
        />
      )}
      
      {/* Empty state */}
      {!isLoading && !error && results && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No results found for "{searchParams.query}"</p>
          <p className="text-muted-foreground mb-6">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
}
