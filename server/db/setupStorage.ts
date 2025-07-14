import { pool } from '../db';
import { IStorage } from '../storage';

// Database storage implementation that uses direct SQL queries
export class DBStorage implements IStorage {
  // User methods
  async getUser(id: number) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(user) {
    try {
      const result = await pool.query(
        'INSERT INTO users (username, email, password, "isVip", "isAdmin") VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user.username, user.email, user.password, user.isVip || false, user.isAdmin || false]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, user) {
    try {
      let query = 'UPDATE users SET ';
      const values = [];
      const params = [];
      let paramIndex = 1;

      if (user.username) {
        params.push(`username = $${paramIndex++}`);
        values.push(user.username);
      }

      if (user.email) {
        params.push(`email = $${paramIndex++}`);
        values.push(user.email);
      }

      if (user.password) {
        params.push(`password = $${paramIndex++}`);
        values.push(user.password);
      }

      if (user.isVip !== undefined) {
        params.push(`"isVip" = $${paramIndex++}`);
        values.push(user.isVip);
      }

      if (user.isAdmin !== undefined) {
        params.push(`"isAdmin" = $${paramIndex++}`);
        values.push(user.isAdmin);
      }

      if (params.length === 0) {
        return await this.getUser(id);
      }

      query += params.join(', ') + ` WHERE id = $${paramIndex} RETURNING *`;
      values.push(id);

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  async getAllUsers() {
    try {
      const result = await pool.query('SELECT * FROM users');
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Content methods
  async getContent(id: number) {
    try {
      const result = await pool.query(
        'SELECT * FROM content WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting content by ID:', error);
      return undefined;
    }
  }

  async getContentByType(type: string, limit: number = 10) {
    try {
      const result = await pool.query(
        'SELECT * FROM content WHERE type = $1 LIMIT $2',
        [type, limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting content by type:', error);
      return [];
    }
  }

  async searchContent(query: string, type?: string) {
    try {
      let sql = 'SELECT * FROM content WHERE title ILIKE $1 OR description ILIKE $1';
      const params = [`%${query}%`];

      if (type) {
        sql += ' AND type = $2';
        params.push(type);
      }

      const result = await pool.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }

  async createContent(content) {
    try {
      const fields = ['type', 'title', 'description', 'imageUrl', 'sourceUrl', 'requiresVip', 'tags', 'metadata'];
      const columns = fields.filter(field => content[field] !== undefined);
      
      if (columns.length === 0) {
        throw new Error('No valid content fields provided');
      }

      const placeholders = columns.map((_, i) => `$${i + 1}`);
      const values = columns.map(col => content[col]);

      const sql = `INSERT INTO content ("${columns.join('", "')}") VALUES (${placeholders.join(', ')}) RETURNING *`;
      
      const result = await pool.query(sql, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  async getFeaturedContent() {
    try {
      const result = await pool.query(
        'SELECT * FROM content ORDER BY RANDOM() LIMIT 1'
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting featured content:', error);
      return undefined;
    }
  }

  async getVipContent(limit: number = 6) {
    try {
      const result = await pool.query(
        'SELECT * FROM content WHERE "requiresVip" = true LIMIT $1',
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting VIP content:', error);
      return [];
    }
  }

  // VIP request methods
  async createVipRequest(request) {
    try {
      const result = await pool.query(
        'INSERT INTO vip_requests (email, "userId", reason, status) VALUES ($1, $2, $3, $4) RETURNING *',
        [request.email, request.userId, request.reason || null, request.status || 'pending']
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating VIP request:', error);
      throw error;
    }
  }

  async getVipRequestsByStatus(status: string) {
    try {
      const result = await pool.query(
        'SELECT * FROM vip_requests WHERE status = $1',
        [status]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting VIP requests by status:', error);
      return [];
    }
  }

  async updateVipRequestStatus(id: number, status: string) {
    try {
      const result = await pool.query(
        'UPDATE vip_requests SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating VIP request status:', error);
      return undefined;
    }
  }

  // Theme settings methods
  async getActiveTheme() {
    try {
      const result = await pool.query(
        'SELECT * FROM theme_settings WHERE "isActive" = true'
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error getting active theme:', error);
      return undefined;
    }
  }

  async updateThemeSettings(settings) {
    try {
      // Deactivate all themes
      await pool.query('UPDATE theme_settings SET "isActive" = false');
      
      // Create new active theme
      const result = await pool.query(
        'INSERT INTO theme_settings ("primaryColor", "secondaryColor", "accentColor", "backgroundColor", "isActive") VALUES ($1, $2, $3, $4, true) RETURNING *',
        [
          settings.primaryColor || '#7C4DFF',
          settings.secondaryColor || '#FF4081',
          settings.accentColor || '#00BCD4',
          settings.backgroundColor || '#121212'
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error updating theme settings:', error);
      throw error;
    }
  }

  // User interactions
  async addToFavorites(favorite) {
    try {
      const result = await pool.query(
        'INSERT INTO favorites ("userId", "contentId") VALUES ($1, $2) RETURNING *',
        [favorite.userId, favorite.contentId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }

  async removeFavorite(userId: number, contentId: number) {
    try {
      await pool.query(
        'DELETE FROM favorites WHERE "userId" = $1 AND "contentId" = $2',
        [userId, contentId]
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getUserFavorites(userId: number) {
    try {
      const result = await pool.query(
        'SELECT c.* FROM favorites f JOIN content c ON f."contentId" = c.id WHERE f."userId" = $1',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return [];
    }
  }

  // Downloads
  async recordDownload(download) {
    try {
      const result = await pool.query(
        'INSERT INTO downloads ("userId", "contentId") VALUES ($1, $2) RETURNING *',
        [download.userId, download.contentId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error recording download:', error);
      throw error;
    }
  }

  async getUserDownloads(userId: number) {
    try {
      const result = await pool.query(
        'SELECT c.* FROM downloads d JOIN content c ON d."contentId" = c.id WHERE d."userId" = $1',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error getting user downloads:', error);
      return [];
    }
  }
}