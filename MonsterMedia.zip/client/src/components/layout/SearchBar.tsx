import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { isValidUrl } from '@/lib/utils';

export default function SearchBar() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // If the query is a URL, we can directly navigate to the appropriate view
    if (isValidUrl(query)) {
      navigate(`/search?query=${encodeURIComponent(query)}&type=${type}`);
      return;
    }
    
    // Otherwise, perform a search with the query
    navigate(`/search?query=${encodeURIComponent(query)}${type !== 'all' ? `&type=${type}` : ''}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex">
        <Input
          type="text"
          className="rounded-l-lg focus-visible:ring-primary"
          placeholder="Search or enter URL..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-auto min-w-[100px] rounded-none border-l-0">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-[100px]">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="anime">Anime</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="manga">Manga</SelectItem>
            <SelectItem value="tv">TV Shows</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="rounded-l-none rounded-r-lg">
          <Search size={18} />
        </Button>
      </div>
    </form>
  );
}
