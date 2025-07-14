import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getUserFavorites, getUserDownloads } from '@/lib/api';
import AdminPanel from '@/components/admin/AdminPanel';
import ContentGrid from '@/components/content/ContentGrid';
import VipRequestForm from '@/components/auth/VipRequestForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Heart, 
  Download, 
  Settings, 
  Crown, 
  Loader2, 
  LogOut,
  Shield
} from 'lucide-react';
import { logout } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

export default function ProfilePage() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(params.section || 'profile');
  
  // Handle section param changes
  useEffect(() => {
    if (params.section) {
      setActiveTab(params.section);
    }
  }, [params.section]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/profile/${value === 'profile' ? '' : value}`, { replace: true });
  };
  
  // Query for favorites
  const favoritesQuery = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: getUserFavorites,
    enabled: activeTab === 'favorites' && !!user,
  });
  
  // Query for downloads
  const downloadsQuery = useQuery({
    queryKey: ['/api/downloads'],
    queryFn: getUserDownloads,
    enabled: activeTab === 'downloads' && !!user,
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: (error as Error).message || "Could not log out",
        variant: "destructive",
      });
    },
  });
  
  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              You need to be logged in to access your profile, favorites, and downloads.
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Admin panel
  if (activeTab === 'admin') {
    return <AdminPanel />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.isVip && (
              <span className="vip-badge text-xs px-2 py-0.5 rounded-full text-white mt-1 inline-block">
                VIP Member
              </span>
            )}
            {user.isAdmin && (
              <span className="bg-accent/80 text-xs px-2 py-0.5 rounded-full text-white mt-1 inline-block ml-2">
                Admin
              </span>
            )}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="gap-2 text-destructive hover:text-destructive"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
          Logout
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <Heart size={16} />
            <span>Favorites</span>
          </TabsTrigger>
          <TabsTrigger value="downloads" className="gap-2">
            <Download size={16} />
            <span>Downloads</span>
          </TabsTrigger>
          {!user.isVip && (
            <TabsTrigger value="vip" className="gap-2">
              <Crown size={16} />
              <span>VIP Access</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="settings" className="gap-2">
            <Settings size={16} />
            <span>Settings</span>
          </TabsTrigger>
          {user.isAdmin && (
            <TabsTrigger value="admin" className="gap-2">
              <Shield size={16} />
              <span>Admin Panel</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Account Details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Account Type:</span>
                      <span className="font-medium">
                        {user.isAdmin ? (
                          <span className="bg-red-600 text-xs px-2 py-0.5 rounded-full text-white">
                            Admin Owner
                          </span>
                        ) : user.isVip ? (
                          <span className="vip-badge text-xs px-2 py-0.5 rounded-full text-white">
                            VIP
                          </span>
                        ) : (
                          "Standard"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium">
                        {user.isAdmin ? "Administrator" : "User"}
                      </span>
                    </div>
                  </div>
                </div>
                
                {user.isVip && (
                  <div>
                    <h3 className="text-lg font-medium">VIP Benefits</h3>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>Access to exclusive content</li>
                      <li>Unlimited downloads</li>
                      <li>Ad-free experience</li>
                      <li>Priority support</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorites</CardTitle>
              <CardDescription>
                Content you've added to your favorites
              </CardDescription>
            </CardHeader>
            <CardContent>
              {favoritesQuery.isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Loading your favorites...</span>
                </div>
              ) : favoritesQuery.error ? (
                <div className="text-center py-8">
                  <p className="text-destructive">
                    {(favoritesQuery.error as Error).message || "Error loading favorites"}
                  </p>
                </div>
              ) : (
                <ContentGrid 
                  contents={favoritesQuery.data || []}
                  emptyMessage="You haven't added any favorites yet"
                  columns={4}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="downloads">
          <Card>
            <CardHeader>
              <CardTitle>Your Downloads</CardTitle>
              <CardDescription>
                Content you've downloaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {downloadsQuery.isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <span>Loading your downloads...</span>
                </div>
              ) : downloadsQuery.error ? (
                <div className="text-center py-8">
                  <p className="text-destructive">
                    {(downloadsQuery.error as Error).message || "Error loading downloads"}
                  </p>
                </div>
              ) : (
                <ContentGrid 
                  contents={downloadsQuery.data || []}
                  emptyMessage="You haven't downloaded any content yet"
                  columns={4}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vip">
          <Card>
            <CardHeader>
              <CardTitle>VIP Access</CardTitle>
              <CardDescription>
                Unlock exclusive content and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">VIP Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Access to exclusive VIP content
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Unlimited downloads
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Early access to new releases
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Ad-free experience
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Premium audio quality for music
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Priority customer support
                    </li>
                  </ul>
                  
                  <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2">Why Get VIP?</h4>
                    <p className="text-sm text-muted-foreground">
                      VIP members get access to our full library, including the newest and most exclusive content.
                      Support MONSTERWITH and unlock a premium experience!
                    </p>
                  </div>
                </div>
                
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-4">Request VIP Access</h3>
                  <p className="text-muted-foreground mb-6">
                    Fill out this form to request VIP access. Our admin team will review your request.
                  </p>
                  <VipRequestForm defaultEmail={user.email} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your preferences and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Account settings are not available in this version.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
