// This script adds admin users directly to the database
import pg from 'pg';
const { Pool } = pg;

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createAdminUsers() {
  try {
    console.log('Creating admin users...');
    
    // Check if table exists, create if not
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        "isVip" BOOLEAN NOT NULL DEFAULT FALSE,
        "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    // Create first admin user
    const checkUser1 = await pool.query('SELECT * FROM users WHERE email = $1', ['sammynewlife1@gmail.com']);
    
    if (checkUser1.rowCount === 0) {
      await pool.query(`
        INSERT INTO users (username, email, password, "isVip", "isAdmin")
        VALUES ($1, $2, $3, $4, $5)
      `, ['Monsterwith', 'sammynewlife1@gmail.com', 'King k763', true, true]);
      console.log('Admin user 1 created successfully');
    } else {
      console.log('Admin user 1 already exists');
    }
    
    // Create second admin user
    const checkUser2 = await pool.query('SELECT * FROM users WHERE email = $1', ['sammynewlife2@gmail.com']);
    
    if (checkUser2.rowCount === 0) {
      await pool.query(`
        INSERT INTO users (username, email, password, "isVip", "isAdmin")
        VALUES ($1, $2, $3, $4, $5)
      `, ['SAMMY', 'sammynewlife2@gmail.com', 'King k763', true, true]);
      console.log('Admin user 2 created successfully');
    } else {
      console.log('Admin user 2 already exists');
    }
    
    console.log('Admin users setup complete!');
  } catch (error) {
    console.error('Error creating admin users:', error);
  } finally {
    pool.end();
  }
}

createAdminUsers();