import { Link } from 'wouter';
import { Content } from '@/lib/types';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn, truncateText } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { recordDownload } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface ContentCardProps {
  content: Content;
  className?: string;
}

export default function ContentCard({ content, className }: ContentCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: (contentId: number) => recordDownload(contentId),
    onSuccess: () => {
      toast({
        title: "Download started",
        description: `${content.title} will be downloaded shortly.`,
      });
      
      // In a real app, this would trigger an actual download
      // Here we'll just open the sourceUrl if available
      if (content.sourceUrl) {
        window.open(content.sourceUrl, '_blank');
      }
    },
    onError: (error) => {
      toast({
        title: "Download failed",
        description: (error as Error).message || "Could not start download",
        variant: "destructive",
      });
    }
  });
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to download content",
        variant: "destructive",
      });
      return;
    }
    
    if (content.requiresVip && !user.isVip) {
      toast({
        title: "VIP access required",
        description: "This content is only available to VIP members",
        variant: "destructive",
      });
      return;
    }
    
    downloadMutation.mutate(content.id);
  };
  
  return (
    <Link href={`/media/${content.id}`}>
      <a className={cn(
        "content-card block relative rounded-lg overflow-hidden bg-card h-full",
        className
      )}>
        {/* Image */}
        <div className="aspect-[2/3] relative">
          <img 
            src={content.imageUrl || 'https://via.placeholder.com/500x750?text=No+Image'} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
          
          {/* VIP badge if required */}
          {content.requiresVip && (
            <div className="absolute top-2 right-2">
              <span className="vip-badge text-xs px-2 py-0.5 rounded-full text-white">
                VIP
              </span>
            </div>
          )}
        </div>
        
        {/* Content info */}
        <div className="p-2">
          <h3 className="font-semibold text-sm truncate">{content.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground capitalize">
              {content.type}
              {content.metadata?.episodes && ` • ${content.metadata.episodes} ep`}
              {content.metadata?.duration && ` • ${content.metadata.duration} min`}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-accent hover:text-white transition h-6 w-6"
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
            >
              <Download size={16} />
            </Button>
          </div>
        </div>
      </a>
    </Link>
  );
}
