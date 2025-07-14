import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SearchBar from './SearchBar';
import CategoryTabs from './CategoryTabs';
import LoginForm from '../auth/LoginForm';
import SignupForm from '../auth/SignupForm';
import UserMenu from '../auth/UserMenu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and branding */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/">
              <a className="text-2xl font-bold font-poppins">
                <span className="text-primary">Monster</span>
                <span className="text-secondary">Media</span>
              </a>
            </Link>
            
            {/* Mobile menu trigger */}
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-card">
                <div className="py-6 space-y-6">
                  <Link href="/">
                    <a onClick={() => setShowMobileMenu(false)} className="text-xl font-bold font-poppins">
                      <span className="text-primary">Monster</span>
                      <span className="text-secondary">Media</span>
                    </a>
                  </Link>
                  
                  <nav className="flex flex-col space-y-4">
                    <Link href="/category/anime">
                      <a 
                        onClick={() => setShowMobileMenu(false)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        Anime
                      </a>
                    </Link>
                    <Link href="/category/music">
                      <a 
                        onClick={() => setShowMobileMenu(false)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        Music
                      </a>
                    </Link>
                    <Link href="/category/movie">
                      <a 
                        onClick={() => setShowMobileMenu(false)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        Movies
                      </a>
                    </Link>
                    <Link href="/category/manga">
                      <a 
                        onClick={() => setShowMobileMenu(false)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        Manga
                      </a>
                    </Link>
                    <Link href="/category/tv">
                      <a 
                        onClick={() => setShowMobileMenu(false)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        TV Shows
                      </a>
                    </Link>
                    <Link href="/videos">
                      <a 
                        onClick={() => setShowMobileMenu(false)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        Videos
                      </a>
                    </Link>
                    <Link href="/community">
                      <a 
                        onClick={() => setShowMobileMenu(false)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        Community
                      </a>
                    </Link>
                  </nav>
                  
                  {user ? (
                    <div className="space-y-4">
                      <Link href="/profile">
                        <a 
                          onClick={() => setShowMobileMenu(false)}
                          className="block px-2 py-1 font-medium text-primary"
                        >
                          My Profile
                        </a>
                      </Link>
                      <Link href="/profile/favorites">
                        <a
                          onClick={() => setShowMobileMenu(false)}
                          className="block px-2 py-1"
                        >
                          Favorites
                        </a>
                      </Link>
                      <Link href="/profile/downloads">
                        <a
                          onClick={() => setShowMobileMenu(false)}
                          className="block px-2 py-1"
                        >
                          Downloads
                        </a>
                      </Link>
                      {user.isAdmin && (
                        <Link href="/profile/admin">
                          <a
                            onClick={() => setShowMobileMenu(false)}
                            className="block px-2 py-1 text-accent"
                          >
                            Admin Panel
                          </a>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Theme</span>
                        <ThemeToggle />
                      </div>
                      <Button
                        onClick={() => {
                          setShowMobileMenu(false);
                          setShowLoginModal(true);
                        }}
                        variant="outline"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => {
                          setShowMobileMenu(false);
                          setShowSignupModal(true);
                        }}
                        className="bg-secondary hover:bg-secondary/80"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Search bar */}
          <div className="w-full md:max-w-xl">
            <SearchBar />
          </div>
          
          {/* User controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </Button>
                <Button 
                  className="bg-secondary hover:bg-secondary/80" 
                  onClick={() => setShowSignupModal(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="hidden md:block mt-4">
          <CategoryTabs />
        </div>
      </div>
      
      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
          </DialogHeader>
          <LoginForm 
            onSuccess={() => setShowLoginModal(false)} 
            onRegisterClick={() => {
              setShowLoginModal(false);
              setShowSignupModal(true);
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create an account</DialogTitle>
          </DialogHeader>
          <SignupForm 
            onSuccess={() => setShowSignupModal(false)} 
            onLoginClick={() => {
              setShowSignupModal(false);
              setShowLoginModal(true);
            }} 
          />
        </DialogContent>
      </Dialog>
    </header>
  );
}
