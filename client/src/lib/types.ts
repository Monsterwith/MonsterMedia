export interface User {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface VipRequestData {
  email: string;
  reason?: string;
}

export type ContentType = 'anime' | 'music' | 'movie' | 'manga' | 'tv';

export interface Content {
  id: number;
  title: string;
  description?: string;
  type: ContentType;
  imageUrl?: string;
  sourceUrl?: string;
  requiresVip: boolean;
  tags?: string[];
  metadata?: any;
  createdAt: string;
}

export interface VipRequest {
  id: number;
  userId?: number;
  email: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ThemeSettings {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  isActive: boolean;
  createdAt: string;
}

export interface SearchQuery {
  query: string;
  type?: ContentType;
}
