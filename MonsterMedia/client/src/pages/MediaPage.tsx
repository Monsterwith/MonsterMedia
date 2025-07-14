import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { getContentById, addToFavorites, recordDownload } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Player } from '@/components/ui/player';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/lib/queryClient';
import { 
  Heart, 
  Download, 
  Share, 
  Plus, 
  Play, 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Film, 
  Music, 
  Book 
} from 'lucide-react';
import { getContentTypeColor, formatDate } from '@/lib/utils';

export default function MediaPage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const contentId = parseInt(params.id || '0');
  
  // Query for content details
  const { data: content, isLoading, error } = useQuery({
    queryKey: [`/api/content/${contentId}`],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });
  
  // Add to favorites mutation
  const favoritesMutation = useMutation({
    mutationFn: (contentId: number) => addToFavorites(contentId),
    onSuccess: () => {
      toast({
        title: "Added to favorites",
        description: `${content?.title} has been added to your favorites.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add to favorites",
        variant: "destructive",
      });
    },
  });
  
  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: (contentId: number) => recordDownload(contentId),
    onSuccess: () => {
      toast({
        title: "Download started",
        description: `${content?.title} will be downloaded shortly.`,
      });
      
      // In a real app, this would trigger an actual download
      // Here we'll just open the sourceUrl if available
      if (content?.sourceUrl) {
        window.open(content.sourceUrl, '_blank');
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/downloads'] });
    },
    onError: (error) => {
      toast({
        title: "Download failed",
        description: (error as Error).message || "Could not start download",
        variant: "destructive",
      });
    }
  });
  
  const handleAddToFavorites = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add content to favorites",
        variant: "destructive",
      });
      return;
    }
    
    if (content) {
      favoritesMutation.mutate(content.id);
    }
  };
  
  const handleDownload = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to download content",
        variant: "destructive",
      });
      return;
    }
    
    if (content?.requiresVip && !user.isVip) {
      toast({
        title: "VIP access required",
        description: "This content is only available to VIP members",
        variant: "destructive",
      });
      return;
    }
    
    if (content) {
      downloadMutation.mutate(content.id);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content?.title || 'MONSTERWITH Content',
        text: content?.description || 'Check out this content on MONSTERWITH!',
        url: window.location.href,
      }).catch(() => {
        // Fallback if share fails
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Share link copied to clipboard",
      });
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  const getTypeIcon = () => {
    switch (content?.type) {
      case 'anime':
      case 'tv':
        return <Film className="mr-1" size={16} />;
      case 'music':
        return <Music className="mr-1" size={16} />;
      case 'manga':
        return <Book className="mr-1" size={16} />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary mr-3" />
          <span className="text-xl">Loading content...</span>
        </div>
      </div>
    );
  }
  
  if (error || !content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-destructive mb-4">Content Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {(error as Error)?.message || "The content you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={goBack}>
            <ArrowLeft className="mr-2" size={16} />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  // Check if user has access to VIP content
  const canAccessContent = !content.requiresVip || (user?.isVip);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={goBack}
      >
        <ArrowLeft className="mr-2" size={16} />
        Back
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Media player/poster column */}
        <div className="lg:col-span-2">
          {canAccessContent && content.sourceUrl && !isPlaying ? (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img 
                src={content.imageUrl || 'https://via.placeholder.com/1280x720?text=No+Preview'} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <Button 
                className="absolute inset-0 m-auto w-16 h-16 rounded-full flex items-center justify-center"
                onClick={() => setIsPlaying(true)}
              >
                <Play size={24} className="ml-1" />
              </Button>
            </div>
          ) : canAccessContent && content.sourceUrl ? (
            <Player 
              url={content.sourceUrl} 
              poster={content.imageUrl} 
              title={content.title}
              className="w-full aspect-video rounded-lg overflow-hidden"
            />
          ) : (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img 
                src={content.imageUrl || 'https://via.placeholder.com/1280x720?text=No+Preview'} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
              
              {content.requiresVip && !user?.isVip && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/75">
                  <div className="text-center p-6">
                    <span className="vip-badge text-white px-3 py-1 rounded-full text-lg mb-4 inline-block">
                      VIP ONLY
                    </span>
                    <p className="text-white mb-4">
                      This content is only available to VIP members
                    </p>
                    <Button asChild>
                      <a href="/profile/vip">Upgrade to VIP</a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Title and actions */}
          <div className="mt-4">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold">{content.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={getContentTypeColor(content.type)}>
                    {getTypeIcon()}
                    {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                  </Badge>
                  
                  {content.requiresVip && (
                    <Badge className="vip-badge text-white">
                      VIP
                    </Badge>
                  )}
                  
                  {content.metadata?.year && (
                    <Badge variant="outline" className="flex items-center">
                      <Calendar className="mr-1" size={12} />
                      {content.metadata.year}
                    </Badge>
                  )}
                  
                  {content.metadata?.duration && (
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="mr-1" size={12} />
                      {content.metadata.duration} min
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {canAccessContent && (
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={handleDownload}
                    disabled={downloadMutation.isPending}
                  >
                    {downloadMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2" size={16} />
                    )}
                    Download
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={handleAddToFavorites}
                  disabled={favoritesMutation.isPending}
                >
                  {favoritesMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="mr-2" size={16} />
                  )}
                  Favorite
                </Button>
                
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={handleShare}
                >
                  <Share className="mr-2" size={16} />
                  Share
                </Button>
              </div>
            </div>
            
            {/* Description */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">
                {content.description || 'No description available for this content.'}
              </p>
            </div>
            
            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Metadata column */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            
            <dl className="space-y-4">
              <div>
                <dt className="text-muted-foreground text-sm">Type</dt>
                <dd className="font-medium capitalize">{content.type}</dd>
              </div>
              
              {content.metadata?.episodes && (
                <div>
                  <dt className="text-muted-foreground text-sm">Episodes</dt>
                  <dd className="font-medium">{content.metadata.episodes}</dd>
                </div>
              )}
              
              {content.metadata?.season && (
                <div>
                  <dt className="text-muted-foreground text-sm">Season</dt>
                  <dd className="font-medium">{content.metadata.season}</dd>
                </div>
              )}
              
              {content.metadata?.studio && (
                <div>
                  <dt className="text-muted-foreground text-sm">Studio</dt>
                  <dd className="font-medium">{content.metadata.studio}</dd>
                </div>
              )}
              
              {content.metadata?.artist && (
                <div>
                  <dt className="text-muted-foreground text-sm">Artist</dt>
                  <dd className="font-medium">{content.metadata.artist}</dd>
                </div>
              )}
              
              {content.metadata?.tracks && (
                <div>
                  <dt className="text-muted-foreground text-sm">Tracks</dt>
                  <dd className="font-medium">{content.metadata.tracks}</dd>
                </div>
              )}
              
              {content.metadata?.director && (
                <div>
                  <dt className="text-muted-foreground text-sm">Director</dt>
                  <dd className="font-medium">{content.metadata.director}</dd>
                </div>
              )}
              
              <div>
                <dt className="text-muted-foreground text-sm">Added on</dt>
                <dd className="font-medium">{formatDate(content.createdAt)}</dd>
              </div>
              
              {content.requiresVip && (
                <div>
                  <dt className="text-muted-foreground text-sm">Access</dt>
                  <dd>
                    <Badge className="vip-badge text-white mt-1">
                      VIP Only
                    </Badge>
                  </dd>
                </div>
              )}
            </dl>
            
            {content.requiresVip && !user?.isVip && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-semibold mb-2">Unlock VIP Content</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upgrade to VIP to access this content and all other exclusive material.
                </p>
                <Button className="w-full" asChild>
                  <a href="/profile/vip">Upgrade to VIP</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
