import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Play, Clock, User, Youtube } from 'lucide-react';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import { toast } from '@/hooks/use-toast';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
}

const YOUTUBE_API_KEY = "AIzaSyAexh3GFJU3-GFH9cyZlAOrqkr715d8ifM";

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [searchType, setSearchType] = useState<'anime' | 'music' | 'general'>('anime');

  const { data: videos, isLoading, error, refetch } = useQuery({
    queryKey: ['youtube-videos', searchQuery, searchType],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const query = getSearchQuery(searchQuery, searchType);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      // Get video details for duration and view count
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );
      
      const detailsData = await detailsResponse.json();
      
      return data.items.map((item: any, index: number) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: detailsData.items[index]?.contentDetails?.duration || 'N/A',
        viewCount: detailsData.items[index]?.statistics?.viewCount || '0'
      }));
    },
    enabled: !!searchQuery.trim()
  });

  const getSearchQuery = (query: string, type: string) => {
    const baseQuery = query.trim();
    switch (type) {
      case 'anime':
        return `${baseQuery} anime opening ending AMV`;
      case 'music':
        return `${baseQuery} music song official video`;
      default:
        return baseQuery;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
    }
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  const formatDuration = (duration: string) => {
    if (duration === 'N/A') return duration;
    
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const formatViewCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    } else {
      return `${num} views`;
    }
  };

  const formatPublishedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
          <Youtube className="w-8 h-8 text-red-500" />
          Videos
        </h1>
        <p className="text-muted-foreground">
          Discover anime clips, music videos, and more from YouTube
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search YouTube Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Type Selector */}
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'anime', label: 'Anime' },
                { key: 'music', label: 'Music' },
                { key: 'general', label: 'General' }
              ].map(type => (
                <Button
                  key={type.key}
                  variant={searchType === type.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType(type.key as any)}
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Search for videos..."
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

      {/* Video Player */}
      {selectedVideo && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="aspect-video mb-4">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                title={selectedVideo.title}
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedVideo.channelTitle}
                </span>
                <span>{formatViewCount(selectedVideo.viewCount)}</span>
                <span>{formatPublishedDate(selectedVideo.publishedAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {selectedVideo.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos Grid */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <LoadingAnimation />
        </div>
      )}

      {error && (
        <Card className="mb-8 border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Failed to load videos</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {videos && videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleVideoSelect(video)}
            >
              <div className="relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(video.duration)}
                </div>
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {video.channelTitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <span>{formatViewCount(video.viewCount)}</span>
                    <span>{formatPublishedDate(video.publishedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchQuery && videos && videos.length === 0 && !isLoading && (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">
              No videos found for "{searchQuery}". Try a different search term.
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
            Start your day right with the perfect bowl of Charios! 
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