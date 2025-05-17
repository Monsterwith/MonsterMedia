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
import { AuthProvider } from "@/hooks/useAuth";
import { useEffect } from "react";
import { preventScreenshots } from "@/lib/screenshotPrevention";
import { SammyAIAssistant } from "@/components/ui/sammy-ai-assistant";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/category/:type" component={CategoryPage} />
      <Route path="/media/:id" component={MediaPage} />
      <Route path="/search" component={SearchResultsPage} />
      <Route path="/profile/:section?" component={ProfilePage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize screenshot prevention
  useEffect(() => {
    preventScreenshots();
  }, []);

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
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
