# Personal Site

A modern Node.js blog site built with Express, TypeScript, and Node's native type stripping.

## Features

- **Node 24** with native type stripping (no build step required)
- **TypeScript** with ES6 modules
- **Structured logging** with Bunyan
- **Markdown blog** posts fetched from GitHub
- **Syntax highlighting** with highlight.js
- **Production-ready** Docker support

## Prerequisites

- Node.js 24 or later
- npm

## Development

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

The app will run on http://localhost:3000

### Run tests

```bash
npm test
```

### Type checking

```bash
npm run compile
```

## Docker

### Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your Docker registry details:

```env
DOCKER_REGISTRY=registry.digitalocean.com
DOCKER_USERNAME=philmander
IMAGE_TAG=latest
```

### Using Docker Compose (Recommended)

Start the application:

```bash
npm run docker:up
```

Or manually:

```bash
docker compose up -d
```

View logs:

```bash
npm run docker:logs
```

Stop the application:

```bash
npm run docker:down
```

### Publishing to Docker Registry

#### Option 1: Manual login (traditional)

```bash
# Login to DigitalOcean Container Registry
docker login registry.digitalocean.com

# Build and push
npm run docker:push
```

#### Option 2: Using API token (recommended for automation)

```bash
# Set your DigitalOcean API token
export DO_API_TOKEN=your_digitalocean_api_token

# Push with authentication
npm run docker:push:auth
```

Or use the script:

```bash
export DO_API_TOKEN=your_digitalocean_api_token
./scripts/push-with-auth.sh
```

#### Option 3: Using doctl CLI

```bash
# Install doctl (DigitalOcean CLI)
# macOS: brew install doctl
# Linux: snap install doctl

# Authenticate
doctl auth init

# Login to registry
doctl registry login

# Build and push
npm run docker:push
```

The image will be published to:
`registry.digitalocean.com/philmander/personal-site:latest`

### CI/CD (GitHub Actions)

A GitHub Actions workflow is included at `.github/workflows/docker-publish.yml`.

To use it:
1. Add `DO_API_TOKEN` to your GitHub repository secrets
2. Push to `main` branch or create a tag (`v1.0.0`)
3. The workflow will automatically build and push the image

### Pull from Registry

```bash
npm run docker:pull
```

### Using Docker directly

Build the Docker image:

```bash
npm run docker:build
# or
docker build -t personal-site .
```

Run the Docker container:

```bash
npm run docker:run
# or
docker run -p 3000:3000 personal-site
```

The app will be available at http://localhost:3000

## Environment Variables

- `LOG_LEVEL` - Set log level (default: `info`, options: `debug`, `info`, `warn`, `error`)
- `NODE_ENV` - Environment (set to `production` in Docker)

## Project Structure

```
.
├── index.ts              # Main Express server
├── blog-service.ts       # Blog content fetching and rendering
├── blog-list-html.ts     # Blog list HTML generation
├── page-html.ts          # Page template
├── contact-html.ts       # Contact section
├── serve-images.ts       # Image serving with GitHub caching
├── logger.ts             # Bunyan logger configuration
├── static/               # Static assets (CSS, images)
├── spec/                 # Test files
└── Dockerfile           # Production Docker image

```

## Technology Stack

- **Runtime**: Node.js 24 with native type stripping
- **Language**: TypeScript with ES6 modules
- **Framework**: Express.js
- **Markdown**: Marked with highlight.js
- **Logging**: Bunyan
- **Testing**: Node.js native test runner
- **Containerization**: Docker (Alpine Linux)
