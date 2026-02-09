# Use Node 24 for type stripping support
FROM node:24-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source
COPY *.ts ./
COPY static ./static
COPY logger.ts ./

# Create images directory for caching
RUN mkdir -p images

# Expose port (can be overridden by PORT env var)
EXPOSE 3000
EXPOSE 80

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Run the application with type stripping
CMD ["node", "--experimental-strip-types", "index.ts"]
