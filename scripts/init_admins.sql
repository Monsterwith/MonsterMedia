-- Initialize admin users for MONSTERWITH platform

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  "isVip" BOOLEAN NOT NULL DEFAULT FALSE,
  "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add first admin user (if not exists)
INSERT INTO users (username, email, password, "isVip", "isAdmin")
VALUES ('sammy1', 'sammynewlife1@gmail.com', 'King k763', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Add second admin user (if not exists)
INSERT INTO users (username, email, password, "isVip", "isAdmin")
VALUES ('sammy2', 'sammynewlife2@gmail.com', 'King k763', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;