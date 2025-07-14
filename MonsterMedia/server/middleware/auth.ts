import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Adding user to request object
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
      isAdmin?: boolean;
      isVip?: boolean;
    }
  }
}

// Check if user is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.userId;
  
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user info to request
    req.userId = user.id;
    req.user = user;
    req.isAdmin = user.isAdmin;
    req.isVip = user.isVip;
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Check if user is admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Check if user is VIP
export const isVip = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isVip) {
    return res.status(403).json({ message: 'VIP access required' });
  }
  
  next();
};

// Optional authentication - populate user info if session exists, but continue either way
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.userId;
  
  if (userId) {
    try {
      const user = await storage.getUser(userId);
      
      if (user) {
        req.userId = user.id;
        req.user = user;
        req.isAdmin = user.isAdmin;
        req.isVip = user.isVip;
      }
    } catch (error) {
      // Continue even if there's an error retrieving the user
    }
  }
  
  next();
};
