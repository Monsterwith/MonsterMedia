import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  getFeaturedContent, 
  getVipContent, 
  getContentByType 
} from '@/lib/api';
import { Content } from '@/lib/types';
import FeaturedContent from '@/components/content/FeaturedContent';
import ContentGrid from '@/components/content/ContentGrid';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import VipRequestForm from '@/components/auth/VipRequestForm';
import { useState } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const [showVipModal, setShowVipModal] = useState(false);
  
  // Query for featured content
  const featuredQuery = useQuery({
    queryKey: ['/api/content/featured'],
    queryFn: getFeaturedContent,
  });
  
  // Query for VIP content
  const vipContentQuery = useQuery({
    queryKey: ['/api/content/vip'],
    queryFn: () => getVipContent(6),
  });
  
  // Query for anime content
  const animeQuery = useQuery({
    queryKey: ['/api/content/type/anime'],
    queryFn: () => getContentByType('anime', 6),
  });
  
  // Query for music content
  const musicQuery = useQuery({
    queryKey: ['/api/content/type/music'],
    queryFn: () => getContentByType('music', 6),
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Ad-Free Banner */}
      <div className="mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">100% Ad-Free Experience</h2>
            <p className="text-muted-foreground">
              MONSTERWITH is proudly ad-free for all users. For advertising partnerships or inquiries, 
              please contact <a href="mailto:sammynewlife1@gmail.com" className="text-primary hover:underline">sammynewlife1@gmail.com</a>
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-secondary hover:bg-secondary/80"
            onClick={() => setShowVipModal(true)}
          >
            Upgrade to VIP
          </Button>
        </div>
      </div>
      
      {/* Featured Content */}
      <FeaturedContent 
        content={featuredQuery.data} 
        isLoading={featuredQuery.isLoading} 
      />
      
      {/* VIP Content Section */}
      <section className="mb-12 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            <span className="vip-badge px-3 py-1 rounded-lg text-white">VIP</span>
            <span className="ml-2">Exclusive Content</span>
          </h2>
          <Link href="/category/vip">
            <a className="text-primary hover:text-secondary transition">View All</a>
          </Link>
        </div>
        
        <ContentGrid 
          contents={vipContentQuery.data || []}
          isLoading={vipContentQuery.isLoading}
          emptyMessage="No VIP content available"
        />
        
        {/* VIP Upsell for non-VIP users */}
        {(!user?.isVip) && (
          <div className="mt-6 bg-gradient-to-r from-card to-background p-6 rounded-xl border border-primary border-opacity-50 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Unlock VIP Access</h3>
              <p className="text-muted-foreground max-w-xl">
                Get unlimited downloads, exclusive content, and ad-free experience with our VIP membership.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/profile/vip">
                <Button asChild>
                  <a>Upgrade to VIP</a>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => setShowVipModal(true)}
              >
                Request VIP
              </Button>
            </div>
          </div>
        )}
      </section>
      
      {/* Popular Anime Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Anime</h2>
          <Link href="/category/anime">
            <a className="text-primary hover:text-secondary transition">View All</a>
          </Link>
        </div>
        
        <ContentGrid 
          contents={animeQuery.data || []}
          isLoading={animeQuery.isLoading}
          emptyMessage="No anime content available"
        />
      </section>
      
      {/* Popular Music Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Music</h2>
          <Link href="/category/music">
            <a className="text-primary hover:text-secondary transition">View All</a>
          </Link>
        </div>
        
        <ContentGrid 
          contents={musicQuery.data || []}
          isLoading={musicQuery.isLoading}
          emptyMessage="No music content available"
        />
      </section>
      
      {/* VIP Request Modal */}
      <Dialog open={showVipModal} onOpenChange={setShowVipModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request VIP Access</DialogTitle>
          </DialogHeader>
          <VipRequestForm 
            onSuccess={() => setShowVipModal(false)}
            defaultEmail={user?.email || ''}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
