import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const categories = [
  { name: 'Anime', path: '/category/anime' },
  { name: 'Music', path: '/category/music' },
  { name: 'Movies', path: '/movies' },
  { name: 'Manga', path: '/category/manga' },
  { name: 'TV Shows', path: '/category/tv' },
  { name: 'Videos', path: '/videos' },
  { name: 'Community', path: '/community' },
  { name: 'Latest', path: '/category/latest' },
  { name: 'Trending', path: '/category/trending' },
];

export default function CategoryTabs() {
  const [location] = useLocation();
  
  return (
    <div className="category-tabs flex justify-between overflow-x-auto custom-scrollbar pb-1">
      {categories.map((category) => (
        <Link key={category.path} href={category.path}>
          <a 
            className={cn(
              "px-4 py-2 font-medium whitespace-nowrap",
              location === category.path 
                ? "active-tab text-white" 
                : "text-muted-foreground hover:text-white"
            )}
          >
            {category.name}
          </a>
        </Link>
      ))}
    </div>
  );
}
