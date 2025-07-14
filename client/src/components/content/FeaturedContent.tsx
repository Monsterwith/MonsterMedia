import { Content } from '@/lib/types';
import { Play, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { addToFavorites, recordDownload } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';

interface FeaturedContentProps {
  content: Content | undefined;
  isLoading?: boolean;
}

export default function FeaturedContent({ content, isLoading = false }: FeaturedContentProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const addToFavoritesMutation = useMutation({
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
      addToFavoritesMutation.mutate(content.id);
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
  
  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="relative rounded-xl overflow-hidden">
          <div className="h-[50vh] md:h-[60vh] relative">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
              <Skeleton className="h-6 w-36 mb-2" />
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-5 w-2/3 mb-4" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (!content) {
    return null;
  }
  
  return (
    <section className="mb-12">
      <div className="relative rounded-xl overflow-hidden">
        <div className="h-[50vh] md:h-[60vh] relative">
          <img
            src={content.imageUrl || 'https://via.placeholder.com/1920x1080?text=Featured+Content'}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            {content.requiresVip && (
              <span className="inline-block vip-badge text-white text-xs px-2 py-1 rounded mb-2">
                VIP
              </span>
            )}
            {!content.requiresVip && (
              <span className="inline-block bg-secondary text-white text-xs px-2 py-1 rounded mb-2">
                FEATURED
              </span>
            )}
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{content.title}</h2>
            <p className="text-muted-foreground mb-4 max-w-2xl">
              {content.description || 'No description available'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/media/${content.id}`}>
                <Button asChild className="gap-2">
                  <a>
                    <Play size={18} />
                    Watch Now
                  </a>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleDownload}
                disabled={downloadMutation.isPending}
              >
                <Download size={18} /> 
                Download
              </Button>
              
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleAddToFavorites}
                disabled={addToFavoritesMutation.isPending}
              >
                <Plus size={18} /> 
                Add to List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
