import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Bookmark,
  BookmarkCheck,
  Settings,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface MangaChapter {
  id: number;
  title: string;
  number: number;
  pages: string[];
  nextChapter?: number;
  prevChapter?: number;
}

interface MangaInfo {
  id: number;
  title: string;
  author: string;
  genre: string[];
  status: 'ongoing' | 'completed';
  description: string;
  cover: string;
  chapters: MangaChapter[];
}

// Mock manga data - In a real app, this would come from an API
const mockManga: MangaInfo = {
  id: 1,
  title: "Sample Manga",
  author: "Sample Author",
  genre: ["Action", "Adventure", "Shounen"],
  status: "ongoing",
  description: "A sample manga for demonstrating the reader functionality.",
  cover: "/api/placeholder/400/600",
  chapters: [
    {
      id: 1,
      title: "Chapter 1: The Beginning",
      number: 1,
      pages: [
        "/api/placeholder/800/1200",
        "/api/placeholder/800/1200",
        "/api/placeholder/800/1200",
        "/api/placeholder/800/1200",
        "/api/placeholder/800/1200"
      ],
      nextChapter: 2
    },
    {
      id: 2,
      title: "Chapter 2: The Journey",
      number: 2,
      pages: [
        "/api/placeholder/800/1200",
        "/api/placeholder/800/1200",
        "/api/placeholder/800/1200",
        "/api/placeholder/800/1200"
      ],
      prevChapter: 1,
      nextChapter: 3
    }
  ]
};

export default function MangaReaderPage() {
  const { user } = useAuth();
  const params = useParams();
  const mangaId = params.id;
  const chapterId = params.chapter;
  
  const [manga] = useState<MangaInfo>(mockManga);
  const [currentChapter, setCurrentChapter] = useState<MangaChapter | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [readingDirection, setReadingDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    if (chapterId) {
      const chapter = manga.chapters.find(c => c.id === parseInt(chapterId));
      if (chapter) {
        setCurrentChapter(chapter);
        setCurrentPage(0);
      }
    } else {
      setCurrentChapter(manga.chapters[0]);
      setCurrentPage(0);
    }
  }, [chapterId, manga]);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (currentChapter?.prevChapter) {
      const prevChapter = manga.chapters.find(c => c.id === currentChapter.prevChapter);
      if (prevChapter) {
        setCurrentChapter(prevChapter);
        setCurrentPage(prevChapter.pages.length - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (currentChapter && currentPage < currentChapter.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (currentChapter?.nextChapter) {
      const nextChapter = manga.chapters.find(c => c.id === currentChapter.nextChapter);
      if (nextChapter) {
        setCurrentChapter(nextChapter);
        setCurrentPage(0);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Bookmark added",
      description: `${manga.title} - Chapter ${currentChapter?.number}, Page ${currentPage + 1}`,
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        readingDirection === 'ltr' ? handlePrevPage() : handleNextPage();
        break;
      case 'ArrowRight':
        readingDirection === 'ltr' ? handleNextPage() : handlePrevPage();
        break;
      case 'ArrowUp':
        handlePrevPage();
        break;
      case 'ArrowDown':
        handleNextPage();
        break;
      case 'b':
        handleBookmark();
        break;
      case '+':
        handleZoomIn();
        break;
      case '-':
        handleZoomOut();
        break;
      case '0':
        handleResetZoom();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, currentChapter, readingDirection]);

  if (!currentChapter) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Chapter not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="font-semibold text-sm">{manga.title}</h1>
                <p className="text-xs text-muted-foreground">
                  {currentChapter.title} - Page {currentPage + 1} of {currentChapter.pages.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={isBookmarked ? 'text-yellow-500' : ''}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-16 right-4 z-50 bg-card border rounded-lg shadow-lg p-4 w-64">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDarkMode(true)}
                >
                  <Moon className="w-4 h-4 mr-1" />
                  Dark
                </Button>
                <Button
                  variant={!darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDarkMode(false)}
                >
                  <Sun className="w-4 h-4 mr-1" />
                  Light
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Reading Direction</label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant={readingDirection === 'ltr' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setReadingDirection('ltr')}
                >
                  LTR
                </Button>
                <Button
                  variant={readingDirection === 'rtl' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setReadingDirection('rtl')}
                >
                  RTL
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Zoom: {zoomLevel}%</label>
              <div className="flex gap-2 mt-1">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetZoom}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reader Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Current Page */}
          <div className="mb-6 relative">
            <img
              src={currentChapter.pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="max-w-full h-auto rounded-lg shadow-lg"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center top'
              }}
            />
            
            {/* Navigation Overlays */}
            <div 
              className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
              onClick={readingDirection === 'ltr' ? handlePrevPage : handleNextPage}
            />
            <div 
              className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
              onClick={readingDirection === 'ltr' ? handleNextPage : handlePrevPage}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 0 && !currentChapter.prevChapter}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {currentChapter.pages.length}
              </span>
            </div>
            
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === currentChapter.pages.length - 1 && !currentChapter.nextChapter}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Chapter Navigation */}
          <div className="flex items-center gap-4">
            {currentChapter.prevChapter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const prevChapter = manga.chapters.find(c => c.id === currentChapter.prevChapter);
                  if (prevChapter) {
                    setCurrentChapter(prevChapter);
                    setCurrentPage(0);
                  }
                }}
              >
                ← Previous Chapter
              </Button>
            )}
            
            <Badge variant="secondary">
              Chapter {currentChapter.number}
            </Badge>
            
            {currentChapter.nextChapter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nextChapter = manga.chapters.find(c => c.id === currentChapter.nextChapter);
                  if (nextChapter) {
                    setCurrentChapter(nextChapter);
                    setCurrentPage(0);
                  }
                }}
              >
                Next Chapter →
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 bg-card border rounded-lg p-3 text-xs text-muted-foreground">
        <p className="font-medium mb-1">Keyboard Shortcuts:</p>
        <p>← → : Navigate pages</p>
        <p>B : Toggle bookmark</p>
        <p>+ - : Zoom in/out</p>
        <p>0 : Reset zoom</p>
      </div>
    </div>
  );
}