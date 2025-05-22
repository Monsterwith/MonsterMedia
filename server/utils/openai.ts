import OpenAI from "openai";
import { Content } from "@shared/schema";

// Create OpenAI instance with API key
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

/**
 * Get content recommendations based on user preferences and history
 */
export async function getContentRecommendations(
  userId: number,
  userFavorites: Content[],
  userDownloads: Content[],
  contentType?: string
): Promise<Content[]> {
  try {
    // Check if OpenAI is available
    if (!openai) {
      return []; // Return empty array if no API key
    }

    // Combine user's favorites and downloads to analyze preferences
    const userContent = [...userFavorites, ...userDownloads];
    
    if (userContent.length === 0) {
      return []; // Not enough data to generate recommendations
    }

    // Prepare data for OpenAI
    const userPreferences = userContent.map(item => ({
      title: item.title,
      type: item.type,
      tags: item.tags || []
    }));

    // Create prompt for OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content recommendation specialist for MONSTERWITH, a multimedia platform for anime, music, movies, manga and TV shows."
        },
        {
          role: "user",
          content: `Based on this user's preferences, recommend 5 content items they might enjoy${contentType ? ` in the ${contentType} category` : ''}. 
          User preferences: ${JSON.stringify(userPreferences)}
          
          Return a JSON array with objects having: title, type (anime/music/movie/manga/tv), description, tags array.`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const recommendations = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!recommendations.recommendations || !Array.isArray(recommendations.recommendations)) {
      return [];
    }

    // Convert the recommendations to Content format
    return recommendations.recommendations.map((rec: any, index: number) => ({
      id: -1000 - index, // Use negative IDs to indicate these are recommendations, not stored content
      title: rec.title,
      description: rec.description,
      type: rec.type,
      tags: rec.tags || [],
      requiresVip: Math.random() > 0.7, // Randomly mark some as VIP content
      createdAt: new Date()
    }));
  } catch (error) {
    console.error("Error getting content recommendations:", error);
    return [];
  }
}

/**
 * Enhance search results with AI
 */
export async function enhanceSearchResults(
  query: string,
  initialResults: Content[]
): Promise<Content[]> {
  try {
    // Check if OpenAI is available
    if (!openai) {
      return initialResults; // Return original results if no API key
    }

    // If we have enough results or query is a URL, don't enhance
    if (initialResults.length > 5 || query.startsWith('http')) {
      return initialResults;
    }

    // Get AI-based search enhancement
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a search enhancement assistant for MONSTERWITH, a multimedia platform for anime, music, movies, manga and TV shows."
        },
        {
          role: "user",
          content: `The user searched for "${query}" but we only found ${initialResults.length} results. 
          Suggest 3 content items that might match what they're looking for.
          
          Return a JSON array with objects having: title, type (anime/music/movie/manga/tv), description, tags array.`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const suggestions = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!suggestions.suggestions || !Array.isArray(suggestions.suggestions)) {
      return initialResults;
    }

    // Convert the suggestions to Content format and append to results
    const aiSuggestions = suggestions.suggestions.map((sug: any, index: number) => ({
      id: -2000 - index, // Use negative IDs to indicate these are AI suggestions
      title: sug.title,
      description: sug.description,
      type: sug.type,
      tags: sug.tags || [],
      requiresVip: Math.random() > 0.7, // Randomly mark some as VIP content
      createdAt: new Date(),
      isAiSuggestion: true // Mark as AI suggestion
    }));

    return [...initialResults, ...aiSuggestions];
  } catch (error) {
    console.error("Error enhancing search results:", error);
    return initialResults;
  }
}

/**
 * Analyze content to extract metadata and tags
 */
export async function analyzeContent(
  title: string,
  description?: string,
  url?: string
): Promise<{
  type: string;
  tags: string[];
  metadata: any;
}> {
  try {
    // Check if OpenAI is available
    if (!openai) {
      return {
        type: "movie", // Default type
        tags: [],
        metadata: {}
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content analyzer for MONSTERWITH, a multimedia platform for anime, music, movies, manga and TV shows."
        },
        {
          role: "user",
          content: `Analyze this content and categorize it:
          Title: ${title}
          Description: ${description || 'N/A'}
          URL: ${url || 'N/A'}
          
          Return a JSON object with:
          - type: most likely content type (anime/music/movie/manga/tv)
          - tags: array of relevant tags
          - metadata: object with relevant metadata fields based on the content type`
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse and return the analysis
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error analyzing content:", error);
    return {
      type: "movie", // Default type
      tags: [],
      metadata: {}
    };
  }
}