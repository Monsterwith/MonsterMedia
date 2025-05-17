import { db } from '../db';
import { users } from '@shared/schema';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';

// Function to hash passwords
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize admin users
export async function initializeAdminUsers() {
  try {
    console.log('Setting up admin users...');
    
    // Check if first admin user exists
    const existingAdmin1 = await db.select().from(users).where(eq(users.email, 'sammynewlife1@gmail.com')).execute();
    
    if (existingAdmin1.length === 0) {
      // Add first admin user
      await db.insert(users).values({
        username: 'sammy1',
        email: 'sammynewlife1@gmail.com',
        password: hashPassword('King k763'),
        isAdmin: true,
        isVip: true,
        createdAt: new Date()
      }).execute();
      console.log('Admin user 1 created: sammynewlife1@gmail.com');
    } else {
      console.log('Admin user 1 already exists: sammynewlife1@gmail.com');
    }
    
    // Check if second admin user exists
    const existingAdmin2 = await db.select().from(users).where(eq(users.email, 'sammynewlife2@gmail.com')).execute();
    
    if (existingAdmin2.length === 0) {
      // Add second admin user
      await db.insert(users).values({
        username: 'sammy2',
        email: 'sammynewlife2@gmail.com',
        password: hashPassword('King k763'),
        isAdmin: true,
        isVip: true,
        createdAt: new Date()
      }).execute();
      console.log('Admin user 2 created: sammynewlife2@gmail.com');
    } else {
      console.log('Admin user 2 already exists: sammynewlife2@gmail.com');
    }
    
    console.log('Admin users setup complete.');
  } catch (error) {
    console.error('Error setting up admin users:', error);
  }
}