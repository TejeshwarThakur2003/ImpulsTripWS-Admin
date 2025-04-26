# ImpulsTrip Admin Dashboard

The Admin Dashboard is a comprehensive management interface for the ImpulsTrip website, built with Astro and Node.js. It provides administrators with tools to manage content, users, and other aspects of the ImpulsTrip platform.

## Project Overview

- **Technology Stack**: Astro, Node.js, Express
- **Status**: Production-ready
- **Version**: 0.1.0

## Features

- Secure authentication system
- Content management interface
- User management tools
- Analytics dashboard
- Configuration management
- Responsive design for desktop and mobile administration

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Access to the ImpulsTrip API backend

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with appropriate values for:
   - `PORT`: The port where the admin dashboard will run (default: 8082)
   - `NODE_ENV`: Set to `development`
   - `PUBLIC_API_URL`: Your API endpoint
   - `PUBLIC_FASTAPI_URL`: Your FastAPI endpoint (if applicable)

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the dashboard**:
   Open your browser and navigate to `http://localhost:8082`

## Production Deployment

### Option 1: Docker Deployment (Recommended)

The easiest and recommended way to deploy the admin dashboard is using Docker:

1. **Prerequisites**:
   - Docker and Docker Compose installed on your server
   - A domain or subdomain pointing to your server

2. **Deployment Steps**:
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd impulstripwebsite/admin-dashboard
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   
   # Build and start the container
   docker-compose up -d --build
   ```

3. **Configure Nginx** (recommended):
   Set up Nginx as a reverse proxy with HTTPS for secure access.

### Option 2: Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   NODE_ENV=production npm start
   ```

3. **Process Management**:
   For production, use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name admin-dashboard
   ```

### Option 3: Cloud Platform Deployment

This application can be deployed to various cloud platforms:

- **Vercel/Netlify**: Requires minor adjustments for serverless functions
- **AWS/GCP/Azure**: Can be deployed as a container service or on VM instances
- **Digital Ocean App Platform**: Supports direct deployment from GitHub

## Security Considerations

- Always deploy behind HTTPS
- Use strong authentication mechanisms
- Consider IP restrictions for admin access
- Regularly update dependencies 
- Set proper Content Security Policy headers

## Configuration Options

All configuration is done through environment variables in the `.env` file:

| Variable                | Description                               | Default Value               |
|------------------------|-------------------------------------------|----------------------------|
| PORT                   | The port to run the server on             | 8082                       |
| NODE_ENV               | Environment (development/production)      | development                |
| PUBLIC_WEBSITE_URL     | The base URL of the admin dashboard       | http://localhost:8082      |
| PUBLIC_API_URL         | The URL of the Node.js API                | http://localhost:8001      |
| PUBLIC_FASTAPI_URL     | The URL of the FastAPI API                | http://localhost:8000      |
| PUBLIC_API_TIMEOUT     | API request timeout in milliseconds       | 30000                      |
| PUBLIC_AUTH_TOKEN_NAME | Name of the auth token in localStorage    | adminToken                 |
| PUBLIC_COOKIE_SECURE   | Whether cookies should be secure          | false (true in production) |
| PUBLIC_COOKIE_SAME_SITE| SameSite attribute for cookies           | lax (strict in production) |

## Maintenance

- Regular backups of configuration
- Monitoring of server resources
- Scheduled dependency updates
- Security audits

## Troubleshooting

See the [RUNNING.md](./RUNNING.md) file for detailed troubleshooting information.

## Deployment Guide

For a more detailed deployment guide, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Development Workflow

When developing new features:

1. Create a feature branch from main
2. Implement and test your changes
3. Run linting and formatting checks: `npm run lint && npm run format`
4. Submit a pull request for review

## License

Proprietary - All rights reserved
