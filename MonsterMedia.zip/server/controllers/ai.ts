import { Request, Response } from 'express';
import { storage } from '../storage';
import { getContentRecommendations, enhanceSearchResults, analyzeContent } from '../utils/openai';

// Get AI-powered content recommendations for a user
export const getRecommendations = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        message: 'AI recommendations are not available at this time',
        reason: 'Missing OpenAI API key' 
      });
    }

    const contentType = req.query.type as string | undefined;
    
    // Get user's favorites and downloads
    const favorites = await storage.getUserFavorites(req.userId);
    const downloads = await storage.getUserDownloads(req.userId);
    
    // Generate recommendations
    const recommendations = await getContentRecommendations(
      req.userId,
      favorites,
      downloads,
      contentType
    );
    
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ 
      message: 'Failed to generate recommendations',
      error: (error as Error).message
    });
  }
};

// Enhance search results with AI suggestions
export const enhanceSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        message: 'AI search enhancement is not available at this time',
        reason: 'Missing OpenAI API key' 
      });
    }
    
    // Get initial search results
    const initialResults = await storage.searchContent(query);
    
    // Enhance results with AI
    const enhancedResults = await enhanceSearchResults(query, initialResults);
    
    res.status(200).json(enhancedResults);
  } catch (error) {
    console.error('Error enhancing search:', error);
    res.status(500).json({ 
      message: 'Failed to enhance search results',
      error: (error as Error).message
    });
  }
};

// Analyze content URL or title/description to extract metadata
export const analyzeContentMetadata = async (req: Request, res: Response) => {
  try {
    const { title, description, url } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Content title is required' });
    }
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        message: 'AI content analysis is not available at this time',
        reason: 'Missing OpenAI API key' 
      });
    }
    
    // Analyze the content
    const analysis = await analyzeContent(title, description, url);
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing content:', error);
    res.status(500).json({ 
      message: 'Failed to analyze content',
      error: (error as Error).message
    });
  }
};