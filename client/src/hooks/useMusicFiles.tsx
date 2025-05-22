import { useState, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

export function useMusicFiles() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load music files from your music folder
    const loadMusicFiles = async () => {
      try {
        const musicTracks: Track[] = [
          {
            id: "1",
            title: "Strongest",
            artist: "Alan Walker & Ina Wroldsen",
            url: "/music/Alan Walker & Ina Wroldsen - Strongest (Lyrics)",
            duration: 210 // 3:30 approximate
          },
          {
            id: "2",
            title: "Mirrors",
            artist: "Justin Timberlake",
            url: "/music/Justin Timberlake - Mirrors (Official Audio)",
            duration: 485 // 8:05 approximate
          },
          {
            id: "3",
            title: "That's What I Get",
            artist: "charlieonnafriday",
            url: "/music/charlieonnafriday - That's What I Get (Official Music Video)",
            duration: 195 // 3:15 approximate
          }
        ];

        setTracks(musicTracks);
      } catch (error) {
        console.error('Error loading music files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMusicFiles();
  }, []);

  return { tracks, isLoading };
}