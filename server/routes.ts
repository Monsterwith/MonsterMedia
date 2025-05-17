import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";

// Import controllers
import * as authController from "./controllers/auth";
import * as contentController from "./controllers/content";
import * as adminController from "./controllers/admin";
import * as aiController from "./controllers/ai";
import * as chatController from "./controllers/chat";

// Import middleware
import { isAuthenticated, isAdmin, isVip, optionalAuth } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'monsterwith-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // prune expired entries every 24h
      })
    })
  );

  // Base API route
  const apiRouter = express.Router();
  app.use('/api', apiRouter);

  // Auth routes
  apiRouter.post('/auth/register', authController.register);
  apiRouter.post('/auth/login', authController.login);
  apiRouter.get('/auth/me', isAuthenticated, authController.getCurrentUser);
  apiRouter.post('/auth/logout', authController.logout);
  apiRouter.post('/auth/request-vip', isAuthenticated, authController.requestVip);

  // Content routes
  apiRouter.get('/content/featured', contentController.getFeaturedContent);
  apiRouter.get('/content/type/:type', contentController.getContentByType);
  apiRouter.get('/content/vip', contentController.getVipContent);
  apiRouter.get('/content/:id', optionalAuth, contentController.getContentById);
  apiRouter.get('/search', contentController.searchContent);

  // User content interaction routes
  apiRouter.post('/favorites', isAuthenticated, contentController.addToFavorites);
  apiRouter.delete('/favorites/:contentId', isAuthenticated, contentController.removeFromFavorites);
  apiRouter.get('/favorites', isAuthenticated, contentController.getUserFavorites);
  apiRouter.post('/downloads', isAuthenticated, contentController.recordDownload);
  apiRouter.get('/downloads', isAuthenticated, contentController.getUserDownloads);
  
  // Admin routes
  apiRouter.get('/admin/users', isAuthenticated, isAdmin, adminController.getAllUsers);
  apiRouter.patch('/admin/users/:id', isAuthenticated, isAdmin, adminController.updateUser);
  apiRouter.get('/admin/vip-requests', isAuthenticated, isAdmin, adminController.getVipRequests);
  apiRouter.patch('/admin/vip-requests/:id', isAuthenticated, isAdmin, adminController.updateVipRequestStatus);
  apiRouter.get('/theme', adminController.getThemeSettings);
  apiRouter.post('/admin/theme', isAuthenticated, isAdmin, adminController.updateThemeSettings);

  // AI routes
  apiRouter.get('/ai/recommendations', isAuthenticated, aiController.getRecommendations);
  apiRouter.get('/ai/enhance-search', aiController.enhanceSearch);
  apiRouter.post('/ai/analyze-content', isAuthenticated, aiController.analyzeContentMetadata);
  apiRouter.post('/ai/chat', chatController.handleChatMessage);
  
  // Health check endpoint for monitoring services (UptimeRobot, etc.)
  apiRouter.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok',
      timestamp: new Date(),
      uptime: process.uptime()
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
