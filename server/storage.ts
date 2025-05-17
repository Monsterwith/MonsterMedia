import { users, content, vipRequests, themeSettings, favorites, downloads } from "@shared/schema";
import type { User, InsertUser, Content, InsertContent, VipRequest, InsertVipRequest, ThemeSettings, InsertThemeSettings, Favorite, InsertFavorite, Download, InsertDownload } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Content methods
  getContent(id: number): Promise<Content | undefined>;
  getContentByType(type: string, limit?: number): Promise<Content[]>;
  searchContent(query: string, type?: string): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  getFeaturedContent(): Promise<Content | undefined>;
  getVipContent(limit?: number): Promise<Content[]>;
  
  // VIP request methods
  createVipRequest(request: InsertVipRequest): Promise<VipRequest>;
  getVipRequestsByStatus(status: string): Promise<VipRequest[]>;
  updateVipRequestStatus(id: number, status: string): Promise<VipRequest | undefined>;
  
  // Theme settings methods
  getActiveTheme(): Promise<ThemeSettings | undefined>;
  updateThemeSettings(settings: InsertThemeSettings): Promise<ThemeSettings>;
  
  // User interactions
  addToFavorites(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, contentId: number): Promise<void>;
  getUserFavorites(userId: number): Promise<Content[]>;
  
  // Downloads
  recordDownload(download: InsertDownload): Promise<Download>;
  getUserDownloads(userId: number): Promise<Content[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private content: Map<number, Content>;
  private vipRequests: Map<number, VipRequest>;
  private themeSettings: Map<number, ThemeSettings>;
  private favorites: Map<number, Favorite>;
  private downloads: Map<number, Download>;
  
  private userId = 1;
  private contentId = 1;
  private vipRequestId = 1;
  private themeSettingsId = 1;
  private favoriteId = 1;
  private downloadId = 1;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.vipRequests = new Map();
    this.themeSettings = new Map();
    this.favorites = new Map();
    this.downloads = new Map();
    
    // Initialize with default theme settings
    this.themeSettings.set(this.themeSettingsId, {
      id: this.themeSettingsId++,
      primaryColor: "#7C4DFF",
      secondaryColor: "#FF4081",
      accentColor: "#00BCD4",
      backgroundColor: "#121212",
      isActive: true,
      createdAt: new Date(),
    });
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "adminpassword", // In a real app, this would be hashed
      email: "admin@monsterwith.com",
      isAdmin: true,
      isVip: true,
    });
    
    // Seed with sample content (only for quick development, would be replaced by real data)
    this.seedSampleContent();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    return this.content.get(id);
  }
  
  async getContentByType(type: string, limit: number = 10): Promise<Content[]> {
    const filtered = Array.from(this.content.values())
      .filter(item => item.type === type)
      .slice(0, limit);
    return filtered;
  }
  
  async searchContent(query: string, type?: string): Promise<Content[]> {
    const lowercaseQuery = query.toLowerCase();
    
    // Check if query is a URL
    const isUrl = lowercaseQuery.startsWith('http://') || lowercaseQuery.startsWith('https://');
    
    return Array.from(this.content.values()).filter(item => {
      // If type is specified, filter by type
      if (type && item.type !== type) return false;
      
      // If query is a URL, match against sourceUrl
      if (isUrl) {
        return item.sourceUrl?.toLowerCase().includes(lowercaseQuery);
      }
      
      // Otherwise search in title, description and tags
      return (
        item.title.toLowerCase().includes(lowercaseQuery) ||
        (item.description?.toLowerCase().includes(lowercaseQuery)) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      );
    });
  }
  
  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentId++;
    const content: Content = { ...insertContent, id, createdAt: new Date() };
    this.content.set(id, content);
    return content;
  }
  
  async getFeaturedContent(): Promise<Content | undefined> {
    // For simplicity, return the first anime content item
    return Array.from(this.content.values()).find(item => item.type === 'anime');
  }
  
  async getVipContent(limit: number = 6): Promise<Content[]> {
    return Array.from(this.content.values())
      .filter(item => item.requiresVip)
      .slice(0, limit);
  }
  
  // VIP request methods
  async createVipRequest(request: InsertVipRequest): Promise<VipRequest> {
    const id = this.vipRequestId++;
    const vipRequest: VipRequest = { 
      ...request, 
      id, 
      status: "pending", 
      createdAt: new Date()
    };
    this.vipRequests.set(id, vipRequest);
    return vipRequest;
  }
  
  async getVipRequestsByStatus(status: string): Promise<VipRequest[]> {
    return Array.from(this.vipRequests.values())
      .filter(request => request.status === status);
  }
  
  async updateVipRequestStatus(id: number, status: string): Promise<VipRequest | undefined> {
    const request = this.vipRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, status };
    this.vipRequests.set(id, updatedRequest);
    
    // If approved, update user to VIP
    if (status === "approved" && request.userId) {
      const user = await this.getUser(request.userId);
      if (user) {
        await this.updateUser(user.id, { isVip: true });
      }
    }
    
    return updatedRequest;
  }
  
  // Theme settings methods
  async getActiveTheme(): Promise<ThemeSettings | undefined> {
    return Array.from(this.themeSettings.values())
      .find(theme => theme.isActive);
  }
  
  async updateThemeSettings(settings: InsertThemeSettings): Promise<ThemeSettings> {
    // Deactivate all existing themes
    for (const [id, theme] of this.themeSettings.entries()) {
      this.themeSettings.set(id, { ...theme, isActive: false });
    }
    
    // Create new active theme
    const id = this.themeSettingsId++;
    const newTheme: ThemeSettings = { 
      ...settings, 
      id, 
      isActive: true, 
      createdAt: new Date()
    };
    this.themeSettings.set(id, newTheme);
    return newTheme;
  }
  
  // User interactions
  async addToFavorites(favorite: InsertFavorite): Promise<Favorite> {
    // Check if already favorited
    const existing = Array.from(this.favorites.values()).find(
      f => f.userId === favorite.userId && f.contentId === favorite.contentId
    );
    
    if (existing) return existing;
    
    const id = this.favoriteId++;
    const newFavorite: Favorite = { ...favorite, id, createdAt: new Date() };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }
  
  async removeFavorite(userId: number, contentId: number): Promise<void> {
    const favorite = Array.from(this.favorites.values()).find(
      f => f.userId === userId && f.contentId === contentId
    );
    
    if (favorite) {
      this.favorites.delete(favorite.id);
    }
  }
  
  async getUserFavorites(userId: number): Promise<Content[]> {
    const favoriteIds = Array.from(this.favorites.values())
      .filter(f => f.userId === userId)
      .map(f => f.contentId);
    
    return Array.from(this.content.values())
      .filter(content => favoriteIds.includes(content.id));
  }
  
  // Downloads
  async recordDownload(download: InsertDownload): Promise<Download> {
    const id = this.downloadId++;
    const newDownload: Download = { ...download, id, createdAt: new Date() };
    this.downloads.set(id, newDownload);
    return newDownload;
  }
  
  async getUserDownloads(userId: number): Promise<Content[]> {
    const downloadIds = Array.from(this.downloads.values())
      .filter(d => d.userId === userId)
      .map(d => d.contentId);
    
    return Array.from(this.content.values())
      .filter(content => downloadIds.includes(content.id));
  }
  
  // Seed with sample content for development
  private seedSampleContent() {
    // Sample anime content
    this.createContent({
      title: "Demon Slayer: Entertainment District Arc",
      description: "Tanjiro and his friends join the Sound Hashira Tengen Uzui on a mission to investigate disappearances in the Entertainment District.",
      type: "anime",
      imageUrl: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516",
      sourceUrl: "https://example.com/stream/demon-slayer",
      requiresVip: false,
      tags: ["action", "supernatural", "demons", "samurai"],
      metadata: { episodes: 11, season: 2, studio: "Ufotable" }
    });
    
    // Seed more contents with similar structure
    const animeNames = ["Naruto Shippuden", "Jujutsu Kaisen", "Violet Evergarden", "My Hero Academia", "Hunter x Hunter", "Dragon Ball Super"];
    const movieNames = ["Interstellar", "The Dark Knight", "Inception", "Spirited Away", "Your Name", "Avengers: Endgame"];
    const musicNames = ["Neon Dreams", "Midnight Echoes", "Solitude", "Urban Rhythms", "Electric Dreams", "Cosmic Journey"];
    
    // Create anime content
    animeNames.forEach((title, index) => {
      this.createContent({
        title,
        description: `Epic adventures await in this ${index % 2 === 0 ? 'popular' : 'critically acclaimed'} anime series.`,
        type: "anime",
        imageUrl: `https://images.unsplash.com/photo-${1580000000000 + index * 10000}`,
        sourceUrl: `https://example.com/stream/${title.toLowerCase().replace(/\s+/g, '-')}`,
        requiresVip: index % 3 === 0,
        tags: ["anime", index % 2 === 0 ? "action" : "drama", index % 3 === 0 ? "fantasy" : "adventure"],
        metadata: { episodes: 24 * (index + 1), season: index + 1 }
      });
    });
    
    // Create movie content
    movieNames.forEach((title, index) => {
      this.createContent({
        title,
        description: `A ${index % 2 === 0 ? 'blockbuster' : 'mind-bending'} film that will keep you on the edge of your seat.`,
        type: "movie",
        imageUrl: `https://images.unsplash.com/photo-${1590000000000 + index * 10000}`,
        sourceUrl: `https://example.com/stream/${title.toLowerCase().replace(/\s+/g, '-')}`,
        requiresVip: index % 2 === 0,
        tags: ["movie", index % 2 === 0 ? "action" : "drama", index % 3 === 0 ? "sci-fi" : "thriller"],
        metadata: { duration: 120 + index * 10, year: 2010 + index, director: `Director ${index + 1}` }
      });
    });
    
    // Create music content
    musicNames.forEach((title, index) => {
      const genres = ["Electronic", "Rock", "Ambient", "Hip Hop", "Synthwave", "Space Ambient"];
      this.createContent({
        title,
        description: `An immersive ${genres[index]} album that transports you to another world.`,
        type: "music",
        imageUrl: `https://images.unsplash.com/photo-${1600000000000 + index * 10000}`,
        sourceUrl: `https://example.com/stream/${title.toLowerCase().replace(/\s+/g, '-')}`,
        requiresVip: index % 2 === 1,
        tags: ["music", genres[index].toLowerCase(), index % 2 === 0 ? "upbeat" : "relaxing"],
        metadata: { tracks: 10 + index, artist: `Artist ${index + 1}`, year: 2018 + index }
      });
    });
  }
}

export const storage = new MemStorage();
