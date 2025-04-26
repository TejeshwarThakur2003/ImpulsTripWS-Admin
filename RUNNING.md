# Running the ImpulsTrip Admin Dashboard

This document provides instructions for running the ImpulsTrip Admin Dashboard in both development and production environments.

## Development Environment

### Prerequisites
- Node.js 18 or later
- npm 9 or later
- MongoDB running locally or accessible via network

### Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file to configure the development environment:
   - Set `NODE_ENV=development`
   - Update API URLs to point to your development backend

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the dashboard**:
   Open your browser and navigate to `http://localhost:8082` (or the port specified in your `.env` file)

### Development Commands

- `npm run dev`: Start the development server with hot-reloading
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build locally
- `npm run check`: Run type checking
- `npm run lint`: Run code linting

## Production Environment

### Using Docker (Recommended)

1. **Build and start the container**:
   ```bash
   docker-compose up -d --build
   ```

2. **Verify the container is running**:
   ```bash
   docker-compose ps
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f admin-dashboard
   ```

### Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   NODE_ENV=production npm start
   ```

## Deployment with the Full Stack

To run the entire stack (MongoDB, Backend API, Admin Dashboard):

1. Navigate to the project root:
   ```bash
   cd /path/to/impulstripwebsite
   ```

2. Create a root `.env` file (based on the provided example)

3. Start all services:
   ```bash
   docker-compose up -d
   ```

## Configuration Options

The admin dashboard can be configured using environment variables in the `.env` file:

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

## Troubleshooting

- **Server fails to start**: Check if the port is already in use
- **API connection issues**: Verify the API endpoints are correctly configured in your `.env` file
- **Authentication problems**: Ensure the backend API is running and accessible 