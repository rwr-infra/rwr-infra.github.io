---
title: Robin Server
description: Backend server for Robin Web, providing normalized JSON APIs, MCP tools, and static file serving
---

# Robin Server

Backend server for [Robin Web](/tools/robin-web/), built with Rust and Salvo. It provides normalized JSON over HTTP, a read-only MCP server over Streamable HTTP, raw upstream passthrough endpoints, and static file serving.

:::tip[Hosted MCP endpoint]
The global deployment is available at `https://robin.rwr-infra.uk/mcp`.
:::

```bash
claude mcp add --transport http robin-rwr https://robin.rwr-infra.uk/mcp
```

## Technical Stack

- **Language**: Rust
- **HTTP framework**: Salvo
- **MCP transport**: `rmcp` + `axum` (Streamable HTTP)
- **Upstream parsing**: `roxmltree` (server XML), `scraper` (player HTML)
- **Tests**: `cargo test --all-features`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `127.0.0.1` | Main HTTP server bind address |
| `PORT` | `5800` | Main HTTP server port |
| `MAPS_CONFIG` | `maps.json` | Maps configuration file path |
| `CACHE_DURATION_SECS` | `3` | Upstream response cache expiry in seconds |
| `ANDROID_REPO_URL` | (empty) | GitHub repository URL for Android app releases |
| `WEB_REPO_URL` | (empty) | GitHub repository URL for Web app releases |
| `ANNOUNCEMENT_PATH` | (empty) | HTML file served by `/api/announcement`; disabled when unset or empty |
| `MCP_HOST` | `127.0.0.1` | MCP listener bind address; independent of `HOST`. IPv6 may be written `::1` or `[::1]` |
| `MCP_PORT` | `5801` | MCP listener port; `0` disables MCP; must differ from `PORT` |
| `MCP_ALLOWED_HOSTS` | (empty) | Comma-separated `Host` allowlist for MCP. Unset on a loopback bind uses the loopback defaults; unset on a non-loopback bind disables `Host` validation with a warning |

## API Endpoints

### GET /ping

Health check endpoint that returns `pong`.

### GET /api/version

Returns the latest release information for the configured Android and Web repositories.

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

Returns the configured maps as a JSON array:

```json
[
  {
    "name": "map9",
    "path": "media/packages/vanilla.desert/maps/map9",
    "image": "md5_1.png"
  }
]
```

### GET /api/announcement

Returns the operator-controlled announcement loaded from `ANNOUNCEMENT_PATH` at startup:

```json
{
  "enabled": true,
  "html": "<div class=\"notice\">Server maintenance at 20:00 UTC</div>"
}
```

### GET /api/servers.json

Returns normalized server data. Query parameters use snake_case; response fields use camelCase.

| Parameter | Description |
|-----------|-------------|
| `search` | Case-insensitive search across server name, address, comment and IP |
| `online_only` | `true` or `false` |
| `map` | Filter by map name |
| `mode` | Filter by game mode |
| `country` | Filter by country |
| `offset` | Pagination offset |
| `limit` | Page size, default `20`, maximum `100` |

Abbreviated response:

```json
{
  "total": 128,
  "offset": 0,
  "limit": 20,
  "servers": [
    {
      "id": "203.0.113.10:7777",
      "name": "Example server"
    }
  ]
}
```

### GET /api/players.json

Returns normalized player leaderboard data from the upstream `view_players.php` page.

| Parameter | Description |
|-----------|-------------|
| `search` | Search the upstream leaderboard |
| `db` | `invasion`, `pacific`, or `prereset_invasion`; default `invasion` |
| `sort` | One of `rank_progression`, `username`, `kills`, `deaths`, `kd`, `score`, `time_played`, `teamkills`, `longest_kill_streak`, `targets_destroyed`, `vehicles_destroyed`, `soldiers_healed`, `distance_moved`, `shots_fired`, `throwables_thrown`, `sid` |
| `offset` | Pagination offset |
| `limit` | Page size, default `20`, maximum `100` |

Abbreviated response:

```json
{
  "db": "invasion",
  "offset": 0,
  "limit": 2,
  "hasNext": true,
  "hasPrevious": false,
  "players": [
    {
      "id": "invasion:RUNNING-PUSH",
      "username": "RUNNING-PUSH",
      "kills": 2449822
    }
  ]
}
```

```bash
curl "http://localhost:5800/api/players.json?db=invasion&sort=kills&limit=10"
```

### Errors

Both JSON endpoints return a JSON error body:

- `400 Bad Request` — invalid query parameter; the upstream is not contacted.
- `502 Bad Gateway` — the upstream request failed or returned unparsable data.

### Raw upstream passthroughs

`GET /api/server_list` and `GET /api/player_list` proxy the upstream XML/HTML endpoints unchanged, including the original query string. Prefer the normalized JSON endpoints unless you need the raw upstream format.

## MCP Server

The process also serves a read-only [Model Context Protocol](https://modelcontextprotocol.io) server over **Streamable HTTP**.

- Self-hosted endpoint: `http://<MCP_HOST>:<MCP_PORT>/mcp`; default `http://127.0.0.1:5801/mcp`.
- Transport: stateless Streamable HTTP with JSON responses. Every `POST /mcp` is independent; no session ID is required.
- Tool results use `structuredContent`. Invalid arguments return JSON-RPC `-32602`; upstream or not-found failures set `isError: true` with `structuredContent.error`.
- Current release: `0.6.1`. The `initialize` response reports `serverInfo.name` as `robin rwr`.

### Tools

| Tool | Parameters | Result |
|------|------------|--------|
| `list_servers` | Same as `/api/servers.json` | `{total, offset, limit, servers}` |
| `get_server` | `address` (string), `port` (integer) | One server object |
| `search_players` | Same as `/api/players.json` | `{db, offset, limit, hasNext, hasPrevious, players}` |
| `list_maps` | None | `{maps: [...]}` |

### Connecting

Claude Code:

```bash
claude mcp add --transport http robin-rwr http://127.0.0.1:5801/mcp
```

Any Streamable HTTP MCP client can use the same URL. There is no authentication layer in the server itself.

### Security

- MCP has no authentication, OAuth, or rate limiting. Keep the listener on loopback, or put it behind an authenticating reverse proxy / network policy.
- MCP validates the incoming `Host` header to block DNS rebinding. Set `MCP_ALLOWED_HOSTS` to the public hostname when exposing it through a proxy.
- `MCP_PORT=0` disables the MCP listener; the main HTTP server keeps running.
- `MCP_PORT` must differ from `PORT`.

### Kubernetes

Keep only the existing ingress port public; do not expose `5801` at the edge.

- Set `MCP_HOST=0.0.0.0` inside the Pod so the Service can reach it.
- Add a ClusterIP Service port for `5801` and route the `/mcp` Ingress path to it.
- Set `MCP_ALLOWED_HOSTS` to the public Ingress hostname.
- Use a `NetworkPolicy` to allow only the ingress controller to reach `5801`.

```yaml
env:
  - name: MCP_HOST
    value: "0.0.0.0"
  - name: MCP_PORT
    value: "5801"
  - name: MCP_ALLOWED_HOSTS
    value: "robin.example.com"
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

To expose MCP directly, publish `5801` as well and set an explicit allowlist:

```bash
docker run -d -p 80:80 -p 5801:5801 --name robin-server \
  -e HOST=0.0.0.0 \
  -e PORT=80 \
  -e MCP_HOST=0.0.0.0 \
  -e MCP_PORT=5801 \
  -e MCP_ALLOWED_HOSTS=robin.example.com \
  zhaozisong0/rwrs-server:latest
```

For production, prefer a single public ingress port and route `/mcp` internally as described in the Kubernetes section.

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
      - "5801:5801"
    environment:
      - HOST=0.0.0.0
      - PORT=80
      - MCP_HOST=0.0.0.0
      - MCP_PORT=5801
      - MCP_ALLOWED_HOSTS=robin.example.com
      - ANDROID_REPO_URL=https://github.com/rwr-infra/robin-android
      - WEB_REPO_URL=https://github.com/rwr-infra/robin-web
    volumes:
      - ./dist:/static
      - ./maps.json:/maps.json
```

## Testing

```bash
# Run all tests
cargo test --all-features

# Run with output
cargo test --all-features -- --nocapture

# Run a specific test module
cargo test --all-features cache_tests

# Generate coverage report
cargo install cargo-llvm-cov
cargo llvm-cov --all-features
```

## Links

- **Repository**: [github.com/rwr-infra/robin-server](https://github.com/rwr-infra/robin-server)

## Related Tools

- [Robin Web](/tools/robin-web/) - Frontend web interface
- [Robin Android](/tools/robin-android/) - Android client
