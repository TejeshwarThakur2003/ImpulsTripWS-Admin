# ImpulsTrip Admin Dashboard Deployment Guide

This guide provides instructions for deploying the ImpulsTrip Admin Dashboard in a production environment.

## Prerequisites

- Docker and Docker Compose installed on the server
- Git access to the repository
- A domain name pointing to your server (for HTTPS)

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd impulstripwebsite/admin-dashboard
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your production values:

```bash
cp .env.example .env
```

Edit the `.env` file to set all required environment variables. At a minimum, you need to set:

- `PORT`: The port where the admin dashboard will be available (default: 8082)
- `NODE_ENV`: Set to `production`
- `PUBLIC_WEBSITE_URL`: Your admin dashboard URL (e.g., https://admin.impulstrip.com)
- `PUBLIC_API_URL`: Your Node.js API URL (e.g., https://api.impulstrip.com)
- `PUBLIC_FASTAPI_URL`: Your FastAPI URL (e.g., https://api.impulstrip.com)
- `PUBLIC_COOKIE_SECURE`: Set to `true` for HTTPS
- `PUBLIC_COOKIE_SAME_SITE`: Set to `strict` for production

### 3. Build and Start the Docker Container

```bash
docker-compose up -d --build
```

This will:
- Build a Docker image for the admin dashboard
- Start the container in detached mode
- Expose the service on the configured port

### 4. Verify Deployment

Check if the container is running:

```bash
docker-compose ps
```

Access the admin dashboard at `http://your-server-ip:8082` (or the domain name you've configured).

## Updating the Deployment

To update to a new version:

```bash
git pull
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Viewing Logs

```bash
docker-compose logs -f admin-dashboard
```

### Common Issues

1. **Server not starting**: Check if the port is already in use or if there's an error in your .env configuration
2. **API connection issues**: Verify the `PUBLIC_API_URL` and `PUBLIC_FASTAPI_URL` values in your .env file
3. **Authentication problems**: Check both API services are running and accessible

## Security Considerations

- The admin dashboard should be deployed behind a reverse proxy (like Nginx) with HTTPS enabled
- Consider setting up IP restrictions for admin access
- Regularly update dependencies with `npm audit fix`

## Maintenance

- Regularly backup your configuration
- Monitor server resources
- Set up automated alert monitoring for any service disruptions 