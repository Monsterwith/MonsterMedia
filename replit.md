# Overview

MonsterMedia (formerly MONSTERWITH) is a comprehensive multimedia platform for streaming and downloading anime, music, videos, movies, and manga with both free and VIP access options. It's built as a full-stack web application with a React frontend and Express.js backend, featuring user authentication, content management, AI-powered recommendations, and a community chat system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: React Query for server state, React Context for authentication and theme
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives via shadcn/ui

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with express-session
- **Database Provider**: Neon serverless PostgreSQL
- **API Design**: RESTful endpoints with consistent error handling
- **Real-time**: Socket.IO for community chat functionality

# Key Components

## Authentication System
- Session-based authentication with secure cookie storage
- User roles: Regular users, VIP members, and Administrators
- VIP request system with admin approval workflow
- Magic link authentication support (configured but not implemented)
- Social login integration (Google, Facebook, Xbox - configured)

## Content Management
- Content types: anime, music, movies, manga, TV shows
- VIP-gated content with access control
- Tagging system for improved searchability
- Age rating system for content restrictions
- External content integration (YouTube, IMDb, anime sites, manga platforms)
- Featured content system for homepage

## User Features
- Favorites system for bookmarking content
- Download tracking and history
- Profile management with customizable themes
- AI-powered content recommendations (OpenAI integration)
- Advanced search with type filtering and URL parsing
- Screenshot prevention system

## Admin Panel
- User management (promote/demote, VIP status)
- VIP request approval system
- Theme customization (colors, branding)
- Content moderation capabilities

## Community Features
- Real-time chat with Socket.IO
- AI bot integration (Sammy bot with Cohere/OpenAI)
- User tagging and mentions
- Image generation in chat (Bing, Replicate)
- Online user tracking

## External Integrations
- **YouTube API**: Video search and embedding
- **IMDb API**: Movie and TV show information
- **OpenAI**: AI recommendations and chat assistant
- **Cohere**: Alternative AI chat backend
- **Replicate**: Image generation

# Data Flow

## Database Schema
The application uses PostgreSQL with Drizzle ORM and includes:
- `users` table with authentication and role information
- `content` table with multimedia content metadata
- `vip_requests` table for VIP membership applications
- `theme_settings` table for customizable UI themes
- `favorites` table for user bookmarks
- `downloads` table for tracking user downloads

## API Structure
- `/api/auth/*` - Authentication endpoints
- `/api/content/*` - Content management and retrieval
- `/api/admin/*` - Administrative functions
- `/api/search` - Content search functionality
- `/api/favorites` - User favorites management
- `/api/downloads` - Download tracking
- `/api/ai/*` - AI-powered features
- `/api/chat` - Chat functionality

## State Management
- React Query for server state caching and synchronization
- React Context for authentication state
- React Context for theme management
- Local state for UI components

# External Dependencies

## Core Dependencies
- React 18 with TypeScript
- Express.js with TypeScript
- Drizzle ORM with PostgreSQL
- Neon serverless database
- Socket.IO for real-time features

## UI/UX Dependencies
- TailwindCSS for styling
- Radix UI primitives
- shadcn/ui component library
- Wouter for routing

## External APIs
- OpenAI API for AI features
- YouTube Data API v3
- IMDb API for movie data
- Cohere API for chat
- Replicate API for image generation

## Payment Integration (Configured)
- Stripe for card payments
- PayPal integration
- Mobile money providers (MTN, Airtel, Zamtel)

# Deployment Strategy

## Environment Configuration
- Database connection via `DATABASE_URL`
- API keys for external services
- Session secrets for authentication
- OAuth credentials for social login

## Build Process
- Vite builds the frontend to `dist/public`
- esbuild bundles the backend to `dist/index.js`
- Database migrations handled by Drizzle Kit

## Deployment Targets
- Railway deployment configuration included
- Health check endpoint at `/api/health`
- Production build optimizations
- Auto-restart policies configured

## Development Setup
- Hot reload via Vite
- TypeScript checking
- Database schema management with Drizzle
- Environment variable management

## Security Features
- Screenshot prevention system
- Session-based authentication
- CORS configuration
- Input validation with Zod
- Role-based access control

The application is designed to be scalable and maintainable, with clear separation of concerns between frontend and backend, comprehensive error handling, and robust user management systems.