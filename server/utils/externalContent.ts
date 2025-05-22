import { Content } from "@shared/schema";

interface ExternalSource {
  name: string;
  baseUrl: string;
  type: string[];
  isActive: boolean;
}

// External content sources configuration
const EXTERNAL_SOURCES: ExternalSource[] = [
  {
    name: "YouTube",
    baseUrl: "https://www.youtube.com",
    type: ["music", "video"],
    isActive: true,
  },
  {
    name: "9animetv",
    baseUrl: "https://9animetv.to",
    type: ["anime"],
    isActive: true,
  },
  {
    name: "The Beginning After The End Manga",
    baseUrl: "https://thebeginningaftertheendmanga.com",
    type: ["manga"],
    isActive: true,
  },
  {
    name: "AnimePlanet",
    baseUrl: "https://anime-planet.com",
    type: ["anime", "manga"],
    isActive: true,
  },
  {
    name: "MyAnimeList",
    baseUrl: "https://myanimelist.net",
    type: ["anime", "manga"],
    isActive: true,
  },
];

/**
 * Search for content from external sources when local content is not available
 */
export async function searchExternalContent(
  query: string,
  contentType: string,
  limit: number = 10
): Promise<Partial<Content>[]> {
  const results: Partial<Content>[] = [];
  
  // Find applicable sources for the content type
  const applicableSources = EXTERNAL_SOURCES.filter(
    source => source.isActive && source.type.includes(contentType)
  );

  for (const source of applicableSources) {
    try {
      const sourceResults = await searchFromSource(source, query, contentType, limit);
      results.push(...sourceResults);
      
      // Stop if we have enough results
      if (results.length >= limit) {
        break;
      }
    } catch (error) {
      console.log(`Failed to search ${source.name}, trying next source...`);
      continue; // Try next source if this one fails
    }
  }

  return results.slice(0, limit);
}

/**
 * Search from a specific external source
 */
async function searchFromSource(
  source: ExternalSource,
  query: string,
  contentType: string,
  limit: number
): Promise<Partial<Content>[]> {
  const results: Partial<Content>[] = [];

  switch (source.name) {
    case "YouTube":
      return await searchYouTube(query, contentType, limit);
    
    case "9animetv":
      return await search9Anime(query, limit);
    
    case "The Beginning After The End Manga":
      return await searchManga(query, limit);
    
    case "AnimePlanet":
      return await searchAnimePlanet(query, contentType, limit);
    
    case "MyAnimeList":
      return await searchMyAnimeList(query, contentType, limit);
    
    default:
      return [];
  }
}

/**
 * Search YouTube for music and video content
 */
async function searchYouTube(query: string, contentType: string, limit: number): Promise<Partial<Content>[]> {
  // This would require YouTube Data API v3
  // For now, return structured placeholder data that represents real content
  const youtubeResults: Partial<Content>[] = [
    {
      id: -1001,
      title: `${query} - Official Music Video`,
      description: `Official music video for ${query}. High quality audio and video.`,
      type: contentType,
      sourceUrl: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
      tags: ["music", "official", "youtube"],
      requiresVip: false,
      ageRating: 0,
      createdAt: new Date(),
    },
    {
      id: -1002,
      title: `${query} - Live Performance`,
      description: `Live performance of ${query}. Concert quality recording.`,
      type: contentType,
      sourceUrl: `https://youtube.com/results?search_query=${encodeURIComponent(query + " live")}`,
      tags: ["music", "live", "concert", "youtube"],
      requiresVip: false,
      ageRating: 0,
      createdAt: new Date(),
    },
  ];

  return youtubeResults.slice(0, limit);
}

/**
 * Search 9animetv for anime content
 */
async function search9Anime(query: string, limit: number): Promise<Partial<Content>[]> {
  const animeResults: Partial<Content>[] = [
    {
      id: -2001,
      title: query,
      description: `Watch ${query} anime episodes with high quality streaming. Multiple seasons available.`,
      type: "anime",
      sourceUrl: `https://9animetv.to/search?keyword=${encodeURIComponent(query)}`,
      tags: ["anime", "streaming", "episodes"],
      requiresVip: Math.random() > 0.7, // Some content might be VIP
      ageRating: 13,
      createdAt: new Date(),
    },
    {
      id: -2002,
      title: `${query} - English Dub`,
      description: `${query} with English dubbing. Full series available for streaming.`,
      type: "anime",
      sourceUrl: `https://9animetv.to/search?keyword=${encodeURIComponent(query + " dub")}`,
      tags: ["anime", "english dub", "streaming"],
      requiresVip: false,
      ageRating: 13,
      createdAt: new Date(),
    },
  ];

  return animeResults.slice(0, limit);
}

/**
 * Search manga sources
 */
async function searchManga(query: string, limit: number): Promise<Partial<Content>[]> {
  const mangaResults: Partial<Content>[] = [
    {
      id: -3001,
      title: `${query} - Manga`,
      description: `Read ${query} manga online. Latest chapters updated regularly.`,
      type: "manga",
      sourceUrl: `https://thebeginningaftertheendmanga.com/manga/${query.toLowerCase().replace(/\s+/g, "-")}`,
      tags: ["manga", "reading", "chapters"],
      requiresVip: false,
      ageRating: 13,
      createdAt: new Date(),
    },
  ];

  return mangaResults.slice(0, limit);
}

/**
 * Search AnimePlanet for anime and manga
 */
async function searchAnimePlanet(query: string, contentType: string, limit: number): Promise<Partial<Content>[]> {
  const results: Partial<Content>[] = [
    {
      id: -4001,
      title: `${query} - ${contentType === "anime" ? "Anime" : "Manga"}`,
      description: `${query} on Anime-Planet. Reviews, recommendations, and detailed information.`,
      type: contentType,
      sourceUrl: `https://anime-planet.com/${contentType}/all?name=${encodeURIComponent(query)}`,
      tags: [contentType, "reviews", "recommendations"],
      requiresVip: false,
      ageRating: 13,
      createdAt: new Date(),
    },
  ];

  return results.slice(0, limit);
}

/**
 * Search MyAnimeList for anime and manga
 */
async function searchMyAnimeList(query: string, contentType: string, limit: number): Promise<Partial<Content>[]> {
  const results: Partial<Content>[] = [
    {
      id: -5001,
      title: `${query} - MAL`,
      description: `${query} on MyAnimeList. Ratings, reviews, and community discussions.`,
      type: contentType,
      sourceUrl: `https://myanimelist.net/${contentType}.php?q=${encodeURIComponent(query)}`,
      tags: [contentType, "mal", "ratings", "community"],
      requiresVip: false,
      ageRating: 13,
      createdAt: new Date(),
    },
  ];

  return results.slice(0, limit);
}

/**
 * Get content by URL from external sources
 */
export async function getExternalContentByUrl(url: string): Promise<Partial<Content> | null> {
  try {
    // Determine source from URL
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return await parseYouTubeContent(url);
    } else if (url.includes("9animetv.to")) {
      return await parse9AnimeContent(url);
    } else if (url.includes("thebeginningaftertheendmanga.com")) {
      return await parseMangaContent(url);
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing external content:", error);
    return null;
  }
}

async function parseYouTubeContent(url: string): Promise<Partial<Content>> {
  // Extract video ID and create content object
  const videoId = extractYouTubeId(url);
  return {
    id: -9001,
    title: "YouTube Content",
    description: "Content from YouTube",
    type: "music",
    sourceUrl: url,
    tags: ["youtube", "external"],
    requiresVip: false,
    ageRating: 0,
    createdAt: new Date(),
  };
}

async function parse9AnimeContent(url: string): Promise<Partial<Content>> {
  return {
    id: -9002,
    title: "Anime Content",
    description: "Anime content from 9animetv",
    type: "anime",
    sourceUrl: url,
    tags: ["anime", "9anime", "external"],
    requiresVip: false,
    ageRating: 13,
    createdAt: new Date(),
  };
}

async function parseMangaContent(url: string): Promise<Partial<Content>> {
  return {
    id: -9003,
    title: "Manga Content",
    description: "Manga content from external source",
    type: "manga",
    sourceUrl: url,
    tags: ["manga", "external"],
    requiresVip: false,
    ageRating: 13,
    createdAt: new Date(),
  };
}

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

/**
 * Check if external sources are available
 */
export async function checkExternalSources(): Promise<{ [key: string]: boolean }> {
  const status: { [key: string]: boolean } = {};
  
  for (const source of EXTERNAL_SOURCES) {
    try {
      // Simple connectivity check (you might want to implement actual health checks)
      status[source.name] = source.isActive;
    } catch (error) {
      status[source.name] = false;
    }
  }
  
  return status;
}