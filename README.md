# RWR Infra Documentation

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
[![Deploy to GitHub Pages](https://github.com/rwr-infra/rwr-infra.github.io/actions/workflows/astro.yml/badge.svg)](https://github.com/rwr-infra/rwr-infra.github.io/actions/workflows/astro.yml)

Documentation site for RWR (Running with Rifles) Community Game Enhancement Organization tools.

## Tools

- **Robin Web** - Server status and archive query web interface
- **Robin Server** - Backend service for robin-web
- **Robin Android** - Android client for server queries
- **RWR Toolbox** - Desktop client with mod enhancement and Steam config
- **RWR QQ Bot** - QQ bot for server status queries
- **RWRSG** - Trade image generator
- **VSCode RWR Mod Tool** - VSCode extension for RWR modding

See [Documentation](https://rwr-infra.github.io/) for details.

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `pnpm install`    | Install dependencies                         |
| `pnpm dev`        | Start dev server at localhost:4321          |
| `pnpm build`      | Build production site to `./dist/`           |
| `pnpm preview`    | Preview build locally                        |
| `pnpm astro check`| Run Astro type checking                     |

## Development

```bash
pnpm dev
```

Then visit http://localhost:4321

## Deployment

Auto-deploys to GitHub Pages on push to master branch via GitHub Actions.
