import { db } from '../db';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { initializeAdminUsers } from './migration';

export async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Create tables if they don't exist
    await migrate(db, { migrationsFolder: 'drizzle' });
    
    // Initialize admin users
    await initializeAdminUsers();
    
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}