---
title: Robin Server
description: Backend server for Robin Web built with Rust and Salvo
---

# Robin Server

Backend server for [Robin Web](/tools/robin-web/), built using Rust and the Salvo framework. Its primary function is to proxy API requests for the Running with Rifles game server list, provide static file serving, and serve game map configuration data.

## Technical Stack

- **Language**: Rust
- **Framework**: Salvo
- **Testing**: Vitest, Playwright

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `127.0.0.1` | Server bind address |
| `PORT` | `5800` | Server port |
| `MAPS_CONFIG` | `maps.json` | Maps configuration file path |
| `CACHE_DURATION_SECS` | `3` | Cache expiry time in seconds |
| `RATE_LIMIT_SECS` | `3` | Rate limit interval in seconds |
| `ANDROID_REPO_URL` | (empty) | GitHub repository URL for Android app releases |
| `WEB_REPO_URL` | (empty) | GitHub repository URL for Web app releases |

## API Endpoints

### GET /api/ping

Health check endpoint that returns "pong".

### GET /api/version

Returns the latest release information for Android and Web applications configured through environment variables.

```json
{
  "android": {
    "version": "v2.0.0",
    "url": "https://github.com/owner/android-repo/releases/tag/v2.0.0"
  },
  "web": {
    "version": "v1.5.0",
    "url": "https://github.com/owner/web-repo/releases/tag/v1.5.0"
  }
}
```

### GET /api/maps

Returns game map configuration data.

### GET /api/server_list

Proxies requests to the Running with Rifles game server list API. Supports query parameters for filtering.

### GET /api/player_list

Proxies requests to the Running with Rifles player statistics API. Returns HTML content with player rankings and statistics.

```bash
# Get players sorted by kills in descending order
curl "http://localhost:5800/api/player_list?sort=kills&order=desc"
```

## Maps Configuration

Maps are configured through a JSON file specified by the `MAPS_CONFIG` environment variable.

```json
{
  "maps": [
    {
      "name": "map9",
      "path": "media/packages/vanilla.desert/maps/map9",
      "image": "md5_1.png"
    }
  ]
}
```

- **`name`**: Human-readable map name
- **`path`**: Full game path for the map (unique identifier)
- **`image`**: Image filename or CDN URL for map preview

## Development

```bash
# Install Rust first, then:
git clone https://github.com/rwr-infra/robin-server.git
cd robin-server

# Run development server
cargo run

# Custom configuration
HOST=0.0.0.0 PORT=8080 cargo run
```

## Building

```bash
# Local build
cargo build --release

# Docker build
docker build -t robin-server .
```

## Deployment

### Docker Deployment

```bash
# Basic deployment
docker pull zhaozisong0/rwrs-server:latest
docker run -d -p 80:80 --name robin-server \
  -e HOST=0.0.0.0 \
  -e PORT=80 \
  zhaozisong0/rwrs-server:latest
```

### With Frontend

```bash
# Copy frontend build to static directory
docker cp ./dist/. robin-server:/static/
```

### Docker Compose

```yaml
version: '3'
services:
  robin-server:
    image: zhaozisong0/rwrs-server:latest
    ports:
      - "80:80"
    environment:
      - HOST=0.0.0.0
      - PORT=80
      - ANDROID_REPO_URL=https://github.com/rwr-infra/robin-android
      - WEB_REPO_URL=https://github.com/rwr-infra/robin-web
    volumes:
      - ./dist:/static
      - ./maps.json:/maps.json
```

## Testing

```bash
# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test module
cargo test api_cache_tests

# Generate coverage report
cargo install cargo-llvm-cov
cargo llvm-cov --all-features
```

## Links

- **Repository**: [github.com/rwr-infra/robin-server](https://github.com/rwr-infra/robin-server)

## Related Tools

- [Robin Web](/tools/robin-web/) - Frontend web interface
- [Robin Android](/tools/robin-android/) - Android client
