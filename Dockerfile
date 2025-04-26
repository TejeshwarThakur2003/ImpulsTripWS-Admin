# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the build output from the build stage
COPY --from=build /app/dist ./dist

# Copy server.js and any other necessary files
COPY server.js ./
COPY .env.example ./

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Give ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the port specified in the environment variable
EXPOSE ${PORT:-8082}

# Run the adjust-env script to create default .env if it doesn't exist
CMD ["node", "-e", "require('./adjust-env.cjs'); require('./server.js')"] 