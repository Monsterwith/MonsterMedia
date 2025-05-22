# MONSTERWITH

MONSTERWITH is a multimedia platform for streaming and downloading anime, music, videos, movies, and manga with both free and VIP access options, for more information contact sammynewlife1@gmail.com 
or whatsapp country code Zambia +260970901273.

## Features

- **Content Library**: Browse anime, music, movies, manga, and TV shows
- **User Authentication**: Register, login, and manage user profiles
- **VIP Content**: Exclusive content for VIP members
- **Search Functionality**: Search by keywords or direct URLs
- **Admin Panel**: Manage users, VIP requests, and theme settings
- **Favorites & Downloads**: Track favorite content and download history
- **Theme Customization**: Toggle between light/dark mode and customize theme colors
- **AI Integration**: OpenAI API integration for content recommendations and search enhancements

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js
- **State Management**: React Query
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Session-based authentication
- **Storage**: In-memory storage (can be replaced with a database)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
SESSION_SECRET=your_session_secret

# OpenAI API (optional)
OPENAI_API_KEY=your_openai_api_key
```

## User Roles

- **Standard User**: Access to free content, can request VIP status
- **VIP User**: Access to exclusive content and unlimited downloads
- **Admin**: Full access to admin panel, can manage users and approve VIP requests

## Deployment Options

MONSTERWITH can be deployed on the following platforms:

### Render
1. Connect your GitHub repository to Render
2. Create a Web Service
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables from the `.env` file

### GitHub Pages (Frontend Only)
For frontend-only deployment:
1. Adjust `vite.config.ts` to set the correct base path
2. Set up GitHub Actions for automatic deployment
3. Configure API endpoints to point to your backend server

### UptimeRobot Monitoring
1. Create an account on UptimeRobot
2. Add a new monitor pointing to your deployed application URL
3. Set check interval to your preference

### Railway
1. Connect your GitHub repository
2. Railway will automatically detect the Node.js project
3. Add environment variables in the Railway dashboard

## Folder Structure

```
├── client/              # Frontend React application
│   ├── src/
│       ├── components/  # Reusable UI components
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utility functions and types
│       ├── pages/       # Page components
├── server/              # Backend Express application
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── utils/           # Utility functions
├── shared/              # Shared code between client and server
│   └── schema.ts        # Database schema and types
```

## AI Integration

MONSTERWITH integrates with OpenAI's API to enhance content discovery and recommendations. To use this feature:

1. Obtain an API key from OpenAI
2. Add the key to your environment variables as `OPENAI_API_KEY`
3. The AI features include:
   - Content recommendations
   - Enhanced search results
   - Smart content categorization

## Customization

### Theme Settings
- The application defaults to dark mode
- Users can toggle between light and dark mode
- Admins can customize the primary, secondary, accent, and background colors

## License

This project is licensed under the MIT License - see the LICENSE file for details.