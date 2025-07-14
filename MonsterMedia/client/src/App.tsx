import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import MediaPage from "@/pages/MediaPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPanel from "@/pages/AdminPanel";
import VideosPage from "@/pages/VideosPage";
import CommunityPage from "@/pages/CommunityPage";
import MangaReaderPage from "@/pages/MangaReaderPage";
import MoviesPage from "@/pages/MoviesPage";
import { AuthProvider } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { preventScreenshots } from "@/lib/screenshotPrevention";
import { SammyAIAssistant } from "@/components/ui/sammy-ai-assistant";
import { FloatingTab } from "@/components/ui/floating-tab";
import { MusicPlayer } from "@/components/ui/music-player";
import { useMusicFiles } from "@/hooks/useMusicFiles";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/category/:type" component={CategoryPage} />
      <Route path="/media/:id" component={MediaPage} />
      <Route path="/search" component={SearchResultsPage} />
      <Route path="/profile/:section?" component={ProfilePage} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/videos" component={VideosPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/manga/:id/:chapter?" component={MangaReaderPage} />
      <Route path="/movies" component={MoviesPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isMusicPlayerOpen, setIsMusicPlayerOpen] = useState(false);
  const [isSammyOpen, setIsSammyOpen] = useState(false);
  const { tracks: musicTracks, isLoading: musicLoading } = useMusicFiles();

  // Initialize screenshot prevention
  useEffect(() => {
    preventScreenshots();
  }, []);

  const handleMusicClick = () => {
    setIsMusicPlayerOpen(true);
  };

  const handleSammyClick = () => {
    setIsSammyOpen(true);
  };

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          
          {/* Floating Tab with File Cabinet Icon */}
          <FloatingTab 
            onMusicClick={handleMusicClick}
            onSammyClick={handleSammyClick}
          />
          
          {/* Music Player */}
          <MusicPlayer 
            isOpen={isMusicPlayerOpen}
            onClose={() => setIsMusicPlayerOpen(false)}
            tracks={musicTracks}
          />
          
          {/* Sammy AI Assistant - only show if triggered from floating tab */}
          {isSammyOpen && (
            <SammyAIAssistant />
          )}
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
