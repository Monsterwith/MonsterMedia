import { db } from './db';
import { eq, and, desc, sql, like, or } from 'drizzle-orm';
import {
  users, content, vipRequests, themeSettings, favorites, downloads,
  type User, type InsertUser, type Content, type InsertContent,
  type VipRequest, type InsertVipRequest, type ThemeSettings, type InsertThemeSettings,
  type Favorite, type InsertFavorite, type Download, type InsertDownload
} from "@shared/schema";
import { IStorage } from './storage';

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(eq(content.id, id));
    return contentItem;
  }

  async getContentByType(type: string, limit: number = 10): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.type, type))
      .limit(limit);
  }

  async searchContent(query: string, type?: string): Promise<Content[]> {
    const searchQuery = `%${query}%`;
    
    let queryBuilder = db
      .select()
      .from(content)
      .where(
        or(
          like(content.title, searchQuery),
          like(content.description, searchQuery)
        )
      );
    
    if (type) {
      queryBuilder = queryBuilder.where(eq(content.type, type));
    }
    
    return await queryBuilder;
  }

  async createContent(contentData: InsertContent): Promise<Content> {
    const [newContent] = await db.insert(content).values(contentData).returning();
    return newContent;
  }

  async getFeaturedContent(): Promise<Content | undefined> {
    // Get a random featured content item
    const [featured] = await db
      .select()
      .from(content)
      .orderBy(sql`RANDOM()`)
      .limit(1);
    
    return featured;
  }

  async getVipContent(limit: number = 6): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.requiresVip, true))
      .limit(limit);
  }

  // VIP request methods
  async createVipRequest(requestData: InsertVipRequest): Promise<VipRequest> {
    const [vipRequest] = await db.insert(vipRequests).values(requestData).returning();
    return vipRequest;
  }

  async getVipRequestsByStatus(status: string): Promise<VipRequest[]> {
    return await db
      .select()
      .from(vipRequests)
      .where(eq(vipRequests.status, status));
  }

  async updateVipRequestStatus(id: number, status: string): Promise<VipRequest | undefined> {
    const [updatedRequest] = await db
      .update(vipRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(vipRequests.id, id))
      .returning();
    
    return updatedRequest;
  }

  // Theme settings methods
  async getActiveTheme(): Promise<ThemeSettings | undefined> {
    const [theme] = await db
      .select()
      .from(themeSettings)
      .where(eq(themeSettings.isActive, true));
    
    return theme;
  }

  async updateThemeSettings(settings: InsertThemeSettings): Promise<ThemeSettings> {
    // First deactivate all themes
    await db
      .update(themeSettings)
      .set({ isActive: false });
    
    // Then create a new active theme
    const [newTheme] = await db
      .insert(themeSettings)
      .values({ ...settings, isActive: true })
      .returning();
    
    return newTheme;
  }

  // User interactions
  async addToFavorites(favoriteData: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values(favoriteData)
      .returning();
    
    return favorite;
  }

  async removeFavorite(userId: number, contentId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.contentId, contentId)
        )
      );
  }

  async getUserFavorites(userId: number): Promise<Content[]> {
    const userFavorites = await db
      .select({
        content: content
      })
      .from(favorites)
      .innerJoin(content, eq(favorites.contentId, content.id))
      .where(eq(favorites.userId, userId));
    
    return userFavorites.map(item => item.content);
  }

  // Downloads
  async recordDownload(downloadData: InsertDownload): Promise<Download> {
    const [download] = await db
      .insert(downloads)
      .values(downloadData)
      .returning();
    
    return download;
  }

  async getUserDownloads(userId: number): Promise<Content[]> {
    const userDownloads = await db
      .select({
        content: content
      })
      .from(downloads)
      .innerJoin(content, eq(downloads.contentId, content.id))
      .where(eq(downloads.userId, userId));
    
    return userDownloads.map(item => item.content);
  }
}