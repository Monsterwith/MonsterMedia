import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Calendar, Clock, Film, Tv, Search, PlayCircle } from 'lucide-react';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import { toast } from '@/hooks/use-toast';

interface IMDbMovie {
  id: string;
  type: 'movie' | 'tv';
  primary_title: string;
  original_title: string;
  primary_image?: {
    url: string;
    width: number;
    height: number;
  };
  genres: string[];
  rating?: {
    aggregate_rating: number;
    votes_count: number;
  };
  start_year: number;
  end_year?: number;
  runtime_minutes?: number;
  plot?: string;
  is_adult: boolean;
}

interface SearchResponse {
  titles: IMDbMovie[];
  next_page_token?: string;
}

const IMDB_API_BASE = 'https://rest.imdbapi.dev';

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'movie' | 'tv' | 'all'>('all');
  const [selectedMovie, setSelectedMovie] = useState<IMDbMovie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: searchResults, isLoading, error, refetch } = useQuery<SearchResponse>({
    queryKey: ['imdb-search', searchQuery, searchType, currentPage],
    queryFn: async () => {
      if (!searchQuery.trim()) return { titles: [] };
      
      try {
        // Use IMDb API search endpoint
        const response = await fetch(`${IMDB_API_BASE}/v1/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}&page=${currentPage}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch from IMDb API');
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('IMDb API Error:', error);
        
        // Fallback to mock data for demonstration
        const mockMovies: IMDbMovie[] = [
          {
            id: 'tt0111161',
            type: 'movie',
            primary_title: 'The Shawshank Redemption',
            original_title: 'The Shawshank Redemption',
            primary_image: {
              url: '/api/placeholder/400/600',
              width: 400,
              height: 600
            },
            genres: ['Drama'],
            rating: {
              aggregate_rating: 9.3,
              votes_count: 2500000
            },
            start_year: 1994,
            runtime_minutes: 142,
            plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            is_adult: false
          },
          {
            id: 'tt0468569',
            type: 'movie',
            primary_title: 'The Dark Knight',
            original_title: 'The Dark Knight',
            primary_image: {
              url: '/api/placeholder/400/600',
              width: 400,
              height: 600
            },
            genres: ['Action', 'Crime', 'Drama'],
            rating: {
              aggregate_rating: 9.0,
              votes_count: 2400000
            },
            start_year: 2008,
            runtime_minutes: 152,
            plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            is_adult: false
          },
          {
            id: 'tt0944947',
            type: 'tv',
            primary_title: 'Game of Thrones',
            original_title: 'Game of Thrones',
            primary_image: {
              url: '/api/placeholder/400/600',
              width: 400,
              height: 600
            },
            genres: ['Action', 'Adventure', 'Drama'],
            rating: {
              aggregate_rating: 9.2,
              votes_count: 1800000
            },
            start_year: 2011,
            end_year: 2019,
            plot: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
            is_adult: false
          }
        ].filter(movie => 
          movie.primary_title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (searchType === 'all' || movie.type === searchType)
        );
        
        return { titles: mockMovies };
      }
    },
    enabled: !!searchQuery.trim()
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCurrentPage(1);
      refetch();
    }
  };

  const handleMovieSelect = (movie: IMDbMovie) => {
    setSelectedMovie(movie);
  };

  const formatRating = (rating?: { aggregate_rating: number; votes_count: number }) => {
    if (!rating) return 'N/A';
    return `${rating.aggregate_rating.toFixed(1)}/10`;
  };

  const formatVotes = (votes?: number) => {
    if (!votes) return '';
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}M votes`;
    } else if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K votes`;
    }
    return `${votes} votes`;
  };

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatYear = (startYear: number, endYear?: number) => {
    if (endYear && endYear !== startYear) {
      return `${startYear}-${endYear}`;
    }
    return startYear.toString();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Film className="w-8 h-8 text-blue-500" />
          Movies & TV Shows
        </h1>
        <p className="text-muted-foreground">
          Discover movies and TV shows with IMDb integration
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search IMDb Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Type Selector */}
            <Tabs value={searchType} onValueChange={(value) => setSearchType(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="movie">Movies</TabsTrigger>
                <TabsTrigger value="tv">TV Shows</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Search for movies or TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Movie/TV Show Details */}
      {selectedMovie && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Poster */}
              <div className="flex justify-center">
                <img
                  src={selectedMovie.primary_image?.url || '/api/placeholder/400/600'}
                  alt={selectedMovie.primary_title}
                  className="w-full max-w-sm rounded-lg shadow-lg"
                />
              </div>
              
              {/* Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMovie.primary_title}</h2>
                  {selectedMovie.original_title !== selectedMovie.primary_title && (
                    <p className="text-muted-foreground">
                      Original: {selectedMovie.original_title}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedMovie.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                    {selectedMovie.type === 'movie' ? 'Movie' : 'TV Show'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatYear(selectedMovie.start_year, selectedMovie.end_year)}
                  </Badge>
                  {selectedMovie.runtime_minutes && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRuntime(selectedMovie.runtime_minutes)}
                    </Badge>
                  )}
                  {selectedMovie.rating && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {formatRating(selectedMovie.rating)}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {selectedMovie.genres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {selectedMovie.plot && (
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedMovie.plot}
                  </p>
                )}

                {selectedMovie.rating && (
                  <div className="text-sm text-muted-foreground">
                    {formatVotes(selectedMovie.rating.votes_count)}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                  <Button variant="outline">
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingAnimation />
        </div>
      )}

      {error && (
        <Card className="mb-8 border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load results</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {searchResults && searchResults.titles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.titles.map((movie) => (
            <Card
              key={movie.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleMovieSelect(movie)}
            >
              <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                <img
                  src={movie.primary_image?.url || '/api/placeholder/400/600'}
                  alt={movie.primary_title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {movie.type === 'movie' ? 'Movie' : 'TV'}
                  </Badge>
                </div>
                {movie.rating && (
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {movie.rating.aggregate_rating.toFixed(1)}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {movie.primary_title}
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>{formatYear(movie.start_year, movie.end_year)}</p>
                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 3).map((genre, index) => (
                      <span key={index} className="bg-muted px-1 py-0.5 rounded">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchQuery && searchResults && searchResults.titles.length === 0 && !isLoading && (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">
              No results found for "{searchQuery}". Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Charios Banner */}
      <Card className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold text-yellow-800 mb-2">
            🥣 Charios is the best cereal in the world! 🥣
          </p>
          <p className="text-sm text-yellow-700">
            Perfect for movie nights and binge-watching sessions! 
            <a 
              href="https://youtu.be/_uR0ccvAaak?si=QjuK6Pnsugw0QuIw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-yellow-800 hover:underline font-medium"
            >
              Watch our video →
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}