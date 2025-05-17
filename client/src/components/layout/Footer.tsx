import { Link } from 'wouter';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail, 
  MessageSquare, 
  Bug 
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-card py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-poppins mb-4">
              <span className="text-primary">MONSTER</span>
              <span className="text-secondary">WITH</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              Your ultimate platform for anime, manga, music, and movies.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition"
                aria-label="Discord"
              >
                <FaDiscord size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Content</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/anime">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    Anime
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/manga">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    Manga
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/movie">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    Movies
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/music">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    Music
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/category/tv">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    TV Shows
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/profile/vip">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    VIP Membership
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    Help Center
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/api-docs">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    API
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/app">
                  <a className="text-muted-foreground hover:text-foreground transition">
                    Download App
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                <Mail size={16} className="inline-block mr-2 text-primary" />
                <a 
                  href="mailto:admin@monsterwith.com" 
                  className="hover:text-foreground transition"
                >
                  admin@monsterwith.com
                </a>
              </li>
              <li className="text-muted-foreground">
                <MessageSquare size={16} className="inline-block mr-2 text-primary" />
                <Link href="/profile/vip">
                  <a className="hover:text-foreground transition">
                    Request VIP Access
                  </a>
                </Link>
              </li>
              <li className="text-muted-foreground">
                <Bug size={16} className="inline-block mr-2 text-primary" />
                <a 
                  href="mailto:support@monsterwith.com" 
                  className="hover:text-foreground transition"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} MONSTERWITH. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm">
            <Link href="/privacy">
              <a className="text-muted-foreground hover:text-foreground transition">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-muted-foreground hover:text-foreground transition">
                Terms of Service
              </a>
            </Link>
            <Link href="/dmca">
              <a className="text-muted-foreground hover:text-foreground transition">
                DMCA
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
