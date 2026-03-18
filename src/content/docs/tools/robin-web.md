---
title: Robin Web
description: Clean and modern data browser for Running with Rifles game
---

# Robin Web

> [!WARNING]
> This project was formerly known as **RWRS Another Page V2**. It has been renamed to **Robin Web** to better reflect its community-driven nature.

A clean and modern data browser for Running with Rifles (RWR) game, inspired by [rwrstats](https://rwrstats.com/).

## Features

**Server & Player Data**

- Real-time server list with auto-refresh capability
- Player leaderboard with 15+ statistics (kills, deaths, K/D, score, time played, rank progression, etc.)
- Multi-database support (Invasion, Pacific, Prereset Invasion)

**Search & Filtering**

- Full-text search across servers and players with keyboard shortcut (/) support
- Preset quick filters (Official, WW2, Dominance, Castling, HellDivers mods)
- Multi-level column sorting (ascending/descending/clear)

**User Interface**

- Dual view modes: data table (desktop) and responsive cards (mobile)
- Column visibility toggles with persistent settings
- Map preview images with modal display
- Dynamic language switching (English and Chinese)
- Mobile-friendly with infinite scroll

**Share & Export**

- Player statistics sharing with PC/Mobile optimized cards
- Server information sharing with essential connection details (IP, Port)
- High-quality PNG image generation
- Download or copy to clipboard functionality

## Technical Stack

- **Framework**: SvelteKit 2.x with Svelte 5
- **Styling**: Tailwind CSS 4.0 with DaisyUI components
- **Language**: TypeScript 5.0
- **Testing**: Vitest (unit) + Playwright (E2E)
- **i18n**: @inlang/paraglide-js

## Analytics

The application includes a comprehensive analytics system that tracks user interactions while respecting privacy:

### Supported Platforms

- **Google Analytics (gtag)** - Track events via externally injected gtag script
- **Baidu Analytics (_hmt)** - Track events via Baidu's analytics platform
- **Umami Analytics** - Track events via Umami's privacy-focused analytics

### Privacy-First Design

- **No sensitive data tracking**: Search queries are never sent (only search trigger events)
- **No consent required**: Analytics is auto-enabled when scripts are detected
- **Safe integration**: Gracefully handles missing analytics platforms without errors

## Deployment

### Docker

#### Community Image

```bash
docker pull zhaozisong0/robin-web-community:latest
docker run -d --name robin-web -p 80:80 zhaozisong0/robin-web-community:latest
```

**Features:**
- Automatically uses `window.location.origin` for meta tags and SEO
- No environment variables required for basic usage

Optional runtime configuration:

```bash
docker run -d --name robin-web -p 80:80 \
  -e "VITE_SITE_URL=https://your-domain.com" \
  zhaozisong0/robin-web-community:latest
```

#### With Backend

```bash
# Create network
docker network create robin-network

# Start backend
docker pull zhaozisong0/rwrs-server:latest
docker run -d --name rwrs-server --network robin-network \
  -e "HOST=0.0.0.0" -e "PORT=80" \
  zhaozisong0/rwrs-server:latest

# Start frontend
docker pull zhaozisong0/robin-web-community:latest
docker run -d --name robin-web --network robin-network -p 80:80 \
  zhaozisong0/robin-web-community:latest
```

### Manual Build

```bash
pnpm install
pnpm build
```

### CDN Build

```bash
# All assets on same CDN path
CDN_URL=https://assets.example.com pnpm build:cdn

# Separate image CDN
CDN_URL=https://assets.example.com CDN_IMAGE_URL=https://img.example.com pnpm build:cdn
```

## Links

- **Repository**: [github.com/rwr-infra/robin-web](https://github.com/rwr-infra/robin-web)
- **Live Demo**: Visit [robin.rwr.dev](https://robin.rwr.dev) (if available)

## Disclaimer

This project is an independent work and is **not affiliated, associated, authorized, endorsed by, or in any way officially connected with RWRS (Running with Rifles Stats) or its authors**.

The only relation is that this project was **inspired by RWRS**, but it is written entirely from scratch and does not contain any code, documentation, or resources from the original repository.

## Related Tools

- [Robin Server](/tools/robin-server/) - Backend service
- [Robin Android](/tools/robin-android/) - Android client
