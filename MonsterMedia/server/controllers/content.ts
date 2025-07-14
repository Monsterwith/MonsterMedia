import { Request, Response } from 'express';
import { storage } from '../storage';
import { searchSchema } from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Get featured content for homepage
export const getFeaturedContent = async (req: Request, res: Response) => {
  try {
    const featuredContent = await storage.getFeaturedContent();
    
    if (!featuredContent) {
      return res.status(404).json({ message: 'No featured content found' });
    }
    
    res.status(200).json(featuredContent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured content' });
  }
};

// Get content by type (anime, music, movies, etc.)
export const getContentByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    
    const contentList = await storage.getContentByType(type, limit);
    
    res.status(200).json(contentList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
};

// Get VIP content
export const getVipContent = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    
    const vipContent = await storage.getVipContent(limit);
    
    res.status(200).json(vipContent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching VIP content' });
  }
};

// Get single content item
export const getContentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contentId = parseInt(id);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ message: 'Invalid content ID' });
    }
    
    const content = await storage.getContent(contentId);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check VIP access
    if (content.requiresVip && !req.isVip) {
      return res.status(403).json({ message: 'VIP access required for this content' });
    }
    
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content' });
  }
};

// Search content
export const searchContent = async (req: Request, res: Response) => {
  try {
    const { query, type } = req.query;
    
    // Validate search parameters
    const validParams = searchSchema.parse({ 
      query: query as string, 
      type: type as string | undefined 
    });
    
    const results = await storage.searchContent(validParams.query, validParams.type);
    
    res.status(200).json(results);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    
    res.status(500).json({ message: 'Error searching content' });
  }
};

// Add content to favorites
export const addToFavorites = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const { contentId } = req.body;
    
    if (!contentId) {
      return res.status(400).json({ message: 'Content ID is required' });
    }
    
    // Check if content exists
    const content = await storage.getContent(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Add to favorites
    const favorite = await storage.addToFavorites({
      userId: req.userId,
      contentId,
    });
    
    res.status(201).json({ 
      message: 'Added to favorites',
      favorite
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to favorites' });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const { contentId } = req.params;
    const contentIdNum = parseInt(contentId);
    
    if (isNaN(contentIdNum)) {
      return res.status(400).json({ message: 'Invalid content ID' });
    }
    
    // Remove from favorites
    await storage.removeFavorite(req.userId, contentIdNum);
    
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from favorites' });
  }
};

// Get user favorites
export const getUserFavorites = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const favorites = await storage.getUserFavorites(req.userId);
    
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

// Record download
export const recordDownload = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const { contentId } = req.body;
    
    if (!contentId) {
      return res.status(400).json({ message: 'Content ID is required' });
    }
    
    // Check if content exists
    const content = await storage.getContent(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Check VIP access for VIP content
    if (content.requiresVip && !req.isVip) {
      return res.status(403).json({ message: 'VIP access required for this content' });
    }
    
    // Record download
    const download = await storage.recordDownload({
      userId: req.userId,
      contentId,
    });
    
    res.status(201).json({ 
      message: 'Download recorded',
      download
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording download' });
  }
};

// Get user downloads
export const getUserDownloads = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const downloads = await storage.getUserDownloads(req.userId);
    
    res.status(200).json(downloads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching downloads' });
  }
};
