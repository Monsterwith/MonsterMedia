import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with authentication and role information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  age: integer("age"), // User's age for content restrictions
  isVip: boolean("is_vip").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  receiveNotifications: boolean("receive_notifications").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content types enumeration
export const contentTypeEnum = z.enum([
  "anime",
  "music",
  "movie",
  "manga",
  "tv"
]);

export type ContentType = z.infer<typeof contentTypeEnum>;

// Content metadata
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // anime, music, movie, manga, tv
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"), // URL to stream/download from
  requiresVip: boolean("requires_vip").default(false).notNull(),
  tags: text("tags").array(), // For search functionality
  metadata: jsonb("metadata"), // Store additional type-specific metadata
  ageRating: integer("age_rating").default(0).notNull(), // Age restriction (0 = all ages, 18 = adults only)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// VIP requests
export const vipRequests = pgTable("vip_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  reason: text("reason"),
  status: text("status").default("pending").notNull(), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Theme settings for admin customization
export const themeSettings = pgTable("theme_settings", {
  id: serial("id").primaryKey(),
  primaryColor: text("primary_color").default("#7C4DFF").notNull(),
  secondaryColor: text("secondary_color").default("#FF4081").notNull(),
  accentColor: text("accent_color").default("#00BCD4").notNull(),
  backgroundColor: text("background_color").default("#121212").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User favorites/bookmarks
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").references(() => content.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User download history
export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").references(() => content.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Images platform
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  ageRating: integer("age_rating").default(0).notNull(), // Age restriction (0 = all ages, 18 = adults only)
  tags: text("tags").array(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notification system
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  isGlobal: boolean("is_global").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userNotifications = pgTable("user_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  notificationId: integer("notification_id").references(() => notifications.id).notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SEO metadata for Google searchability
export const seoMetadata = pgTable("seo_metadata", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(), // 'content', 'image', etc.
  entityId: integer("entity_id").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords").array(),
  canonicalUrl: text("canonical_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat groups for users to share ideas and interact with ۞𝑺𝑨𝑴𝑴𝒀۞ bot
export const chatGroups = pgTable("chat_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: integer("created_by").references(() => users.id),
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat group members
export const chatGroupMembers = pgTable("chat_group_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  groupId: integer("group_id").references(() => chatGroups.id).notNull(),
  role: text("role").default("member").notNull(), // 'member', 'moderator', 'admin'
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Messages for both private and group chats
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id), // NULL if group message
  groupId: integer("group_id").references(() => chatGroups.id), // NULL if private message
  content: text("content"),
  contentType: text("content_type").default("text").notNull(), // 'text', 'image', 'video', 'audio', 'file'
  mediaUrl: text("media_url"), // URL for media content (image, video, audio, etc.)
  mediaSource: text("media_source"), // Source of media (Google, YouTube, etc.)
  isFromBot: boolean("is_from_bot").default(false).notNull(), // True if message is from ۞𝑺𝑨𝑴𝑴𝒀۞ bot
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Message reactions
export const messageReactions = pgTable("message_reactions", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => messages.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  reaction: text("reaction").notNull(), // 'like', 'heart', 'laugh', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  age: z.number().min(13).optional(),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export const insertVipRequestSchema = createInsertSchema(vipRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertThemeSettingsSchema = createInsertSchema(themeSettings).omit({
  id: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertDownloadSchema = createInsertSchema(downloads).omit({
  id: true,
  createdAt: true,
});

// Define types using z.infer
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

export type InsertVipRequest = z.infer<typeof insertVipRequestSchema>;
export type VipRequest = typeof vipRequests.$inferSelect;

export type InsertThemeSettings = z.infer<typeof insertThemeSettingsSchema>;
export type ThemeSettings = typeof themeSettings.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloads.$inferSelect;

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  type: contentTypeEnum.optional(),
});

export type SearchQuery = z.infer<typeof searchSchema>;
