# Overview

MonsterMedia (formerly MONSTERWITH) is a comprehensive multimedia platform for streaming and downloading anime, music, videos, movies, and manga with both free and VIP access options. It's built as a full-stack TypeScript application with a React frontend and Express.js backend, featuring user authentication, content management, AI-powered recommendations, community chat with Sammy bot, and YouTube integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: React Query for server state, React Context for auth/theme
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with express-session
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful endpoints with consistent error handling

# Key Components

## Authentication System
- Session-based authentication with secure cookie storage
- User roles: Regular users, VIP members, and Administrators
- VIP request system with admin approval workflow
- Default admin accounts are auto-created on startup

## Content Management
- Content types: anime, music, movies, manga, TV shows
- VIP-gated content with access control
- Tagging system for improved searchability
- Age rating system for content restrictions
- External content integration (YouTube, anime sites, manga platforms)

## User Features
- Favorites system for bookmarking content
- Download tracking and history
- Profile management with customizable themes
- AI-powered content recommendations (OpenAI integration)
- Advanced search with type filtering and URL parsing

## Admin Panel
- User management (promote/demote, VIP status)
- VIP request approval system
- Theme customization (primary, secondary, accent colors)
- System-wide settings management

## AI Integration
- OpenAI GPT-4o for content recommendations
- Chat assistant (Sammy) for user interaction
- Search enhancement with AI-powered suggestions
- Fallback responses when AI is unavailable

## Community Features
- Real-time community chat with Socket.IO
- Sammy bot (۞𝑺𝑨𝑴𝑴𝒀۞) integration with Cohere API
- User tagging system (@username)
- Image generation with Replicate API
- Live user presence indicators

## YouTube Integration
- YouTube API integration for video search
- Embedded video player with playlist support
- Video categorization (anime, music, general)
- Search filters and recommendations

# Data Flow

## User Authentication Flow
1. User registers/logs in via form validation
2. Session created and stored in memory/database
3. Authentication middleware validates session on protected routes
4. User role determines access to VIP/admin features

## Content Discovery Flow
1. Featured content displayed on homepage
2. Category-based browsing with pagination
3. Search functionality with type filtering
4. AI recommendations based on user history
5. External content integration for expanded catalog

## VIP Request Flow
1. User submits VIP request with reason
2. Admin receives notification and reviews request
3. Admin approves/rejects request
4. User gains access to VIP content upon approval

# External Dependencies

## Core Services
- **Neon PostgreSQL**: Serverless database hosting
- **OpenAI API**: AI-powered recommendations and chat
- **YouTube API**: Video content integration
- **Replicate API**: Image generation capabilities

## Payment Integration
- Stripe for card payments
- PayPal integration
- Mobile money support (MTN, Airtel, Zamtel)

## Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **React Query**: Server state management
- **Zod**: Runtime type validation
- **shadcn/ui**: Pre-built component library

# Deployment Strategy

## Environment Configuration
- Development: Local development with hot reload
- Production: Railway deployment with health checks
- Database: Neon serverless PostgreSQL
- Static Assets: Served via Express in production

## Build Process
1. Frontend assets built with Vite
2. Backend bundled with esbuild
3. Database migrations run automatically
4. Admin users created on startup
5. Health check endpoint for monitoring

## Security Features
- Session-based authentication with secure cookies
- Input validation with Zod schemas
- SQL injection prevention via Drizzle ORM
- Screenshot prevention on sensitive content
- CORS configuration for API security

## Monitoring & Maintenance
- Health check endpoint at `/api/health`
- Error handling with structured logging
- Database connection pooling
- Session cleanup and memory management