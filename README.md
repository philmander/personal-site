# Personal Site

A modern Node.js blog site built with Express, TypeScript, and Node's native type stripping.

## Domains

One server, three domains, routed on the Host header (`src/sites/site-for-host.ts`):

| Domain | Site |
|---|---|
| philmander.com | Personal blog (default for unrecognized hosts, including localhost) |
| deck.dj | Product site for Deck: landing page, `/support`, `/privacy` |
| safestudios.nl | Serves the full Deck site under `/deck` (landing, `/deck/support`, `/deck/privacy`); the root 302-redirects to `/deck`. Once deck.dj's DNS is live, `/deck/*` can go back to a 301 redirect (see `src/sites/safestudios.ts`) |

`philmander.com/deck/privacy` (the privacy URL published in the Deck app)
temporarily 302-redirects to `safestudios.nl/deck/privacy`; once deck.dj is
live it should return to a 301 to `deck.dj/privacy`.

For local development the sites are reachable at
http://deck.localhost:3000 and http://safestudios.localhost:3000
(`*.localhost` resolves to 127.0.0.1 in modern browsers); plain
http://localhost:3000 serves the blog.

All three domains must point at this server, with TLS certificates for each,
before the redirects and the published privacy URL resolve.

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
├── index.ts              # Main Express server + host dispatch
├── sites/                # One router per domain
│   ├── site-for-host.ts  # Host header → site mapping
│   ├── philmander.ts     # philmander.com (blog)
│   ├── deck.ts           # deck.dj (+ deck-*-html.ts page templates)
│   └── safestudios.ts    # safestudios.nl (redirects only)
├── blog-service.ts       # Blog content fetching and rendering
├── blog-list-html.ts     # Blog list HTML generation
├── page-html.ts          # Page template
├── contact-html.ts       # Contact section
├── serve-images.ts       # Image serving with GitHub caching
├── logger.ts             # Bunyan logger configuration
├── static/               # Static assets (CSS, images; static/deck/ for deck.dj)
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
