import { apiRequest } from './queryClient';
import { User, LoginCredentials, RegisterData, Content, VipRequestData, ThemeSettings, VipRequest } from './types';

// Auth API
export async function login(credentials: LoginCredentials): Promise<User> {
  const res = await apiRequest('POST', '/api/auth/login', credentials);
  return res.json();
}

export async function register(data: RegisterData): Promise<User> {
  const res = await apiRequest('POST', '/api/auth/register', data);
  return res.json();
}

export async function logout(): Promise<void> {
  await apiRequest('POST', '/api/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiRequest('GET', '/api/auth/me');
  return res.json();
}

export async function requestVip(data: VipRequestData): Promise<{ message: string }> {
  const res = await apiRequest('POST', '/api/auth/request-vip', data);
  return res.json();
}

// Content API
export async function getFeaturedContent(): Promise<Content> {
  const res = await apiRequest('GET', '/api/content/featured');
  return res.json();
}

export async function getContentByType(type: string, limit?: number): Promise<Content[]> {
  const url = `/api/content/type/${type}${limit ? `?limit=${limit}` : ''}`;
  const res = await apiRequest('GET', url);
  return res.json();
}

export async function getVipContent(limit?: number): Promise<Content[]> {
  const url = `/api/content/vip${limit ? `?limit=${limit}` : ''}`;
  const res = await apiRequest('GET', url);
  return res.json();
}

export async function getContentById(id: number): Promise<Content> {
  const res = await apiRequest('GET', `/api/content/${id}`);
  return res.json();
}

export async function searchContent(query: string, type?: string): Promise<Content[]> {
  const url = `/api/search?query=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`;
  const res = await apiRequest('GET', url);
  return res.json();
}

// User content interactions
export async function addToFavorites(contentId: number): Promise<{ message: string }> {
  const res = await apiRequest('POST', '/api/favorites', { contentId });
  return res.json();
}

export async function removeFromFavorites(contentId: number): Promise<{ message: string }> {
  const res = await apiRequest('DELETE', `/api/favorites/${contentId}`);
  return res.json();
}

export async function getUserFavorites(): Promise<Content[]> {
  const res = await apiRequest('GET', '/api/favorites');
  return res.json();
}

export async function recordDownload(contentId: number): Promise<{ message: string }> {
  const res = await apiRequest('POST', '/api/downloads', { contentId });
  return res.json();
}

export async function getUserDownloads(): Promise<Content[]> {
  const res = await apiRequest('GET', '/api/downloads');
  return res.json();
}

// Admin API
export async function getAllUsers(): Promise<User[]> {
  const res = await apiRequest('GET', '/api/admin/users');
  return res.json();
}

export async function updateUser(id: number, data: { isVip?: boolean, isAdmin?: boolean }): Promise<User> {
  const res = await apiRequest('PATCH', `/api/admin/users/${id}`, data);
  return res.json();
}

export async function getVipRequests(status: string = 'pending'): Promise<VipRequest[]> {
  const res = await apiRequest('GET', `/api/admin/vip-requests?status=${status}`);
  return res.json();
}

export async function updateVipRequestStatus(id: number, status: 'approved' | 'rejected'): Promise<VipRequest> {
  const res = await apiRequest('PATCH', `/api/admin/vip-requests/${id}`, { status });
  return res.json();
}

// Theme settings
export async function getThemeSettings(): Promise<ThemeSettings> {
  const res = await apiRequest('GET', '/api/theme');
  return res.json();
}

export async function updateThemeSettings(settings: Omit<ThemeSettings, 'id' | 'isActive' | 'createdAt'>): Promise<ThemeSettings> {
  const res = await apiRequest('POST', '/api/admin/theme', settings);
  return res.json();
}
