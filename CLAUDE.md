# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Astro.js + Starlight** documentation site for RWR Infra (Running with Rifles community game enhancement organization). It serves as documentation for various community tools including robin-web, robin-server, robin-android, rwr-toolbox, rwr-qq-bot, rwrsg, and vscode-rwr-mod-tool.

## Commands

```bash
pnpm dev          # Start development server at localhost:4321
pnpm build        # Build production site to ./dist/
pnpm preview      # Preview built site locally
pnpm astro check  # Run Astro type checking
```

## Architecture

- **Framework**: Astro 6.x with Starlight 0.x theme
- **Content**: Markdown/MDX files in `src/content/docs/`
- **Configuration**: [astro.config.mjs](astro.config.mjs) defines site title, sidebar navigation, and social links
- **Deployment**: GitHub Actions (see [.github/workflows/astro.yml](.github/workflows/astro.yml)) auto-deploys to GitHub Pages on master branch push
- **Output**: Static site generated to `dist/`

## Content Structure

- Sidebar is configured in `astro.config.mjs` with `guides/` and `reference/` directories
- Each `.md` or `.mdx` file in `src/content/docs/` becomes a route
- Images go in `src/assets/` and are referenced with relative paths

## Dependencies

Uses pnpm (see `package.json`). Key dependencies:
- `astro` - Core framework
- `@astrojs/starlight` - Documentation theme
- `sharp` - Image processing
