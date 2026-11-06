---
title: Robin Server
description: 为 Robin Web 提供标准化 JSON API、MCP 工具和静态文件服务的后端
---

# Robin Server

[Robin Web](/zh/tools/robin-web/) 的后端服务器，使用 Rust 和 Salvo 构建。它提供标准化的 HTTP JSON API、基于 Streamable HTTP 的只读 MCP Server、原始上游透传接口以及静态文件服务。

:::tip[在线 MCP 端点]
国际站部署可直接使用：`https://robin.rwr-infra.uk/mcp`。
:::

```bash
claude mcp add --transport http robin-rwr https://robin.rwr-infra.uk/mcp
```

## 技术栈

- **语言**: Rust
- **HTTP 框架**: Salvo
- **MCP 传输**: `rmcp` + `axum`（Streamable HTTP）
- **上游解析**: `roxmltree`（服务器 XML）、`scraper`（玩家 HTML）
- **测试**: `cargo test --all-features`

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `HOST` | `127.0.0.1` | 主 HTTP 服务绑定地址 |
| `PORT` | `5800` | 主 HTTP 服务端口 |
| `MAPS_CONFIG` | `maps.json` | 地图配置文件路径 |
| `CACHE_DURATION_SECS` | `3` | 上游响应缓存过期时间（秒） |
| `ANDROID_REPO_URL` | (空) | Android 应用发布的 GitHub 仓库 URL |
| `WEB_REPO_URL` | (空) | Web 应用发布的 GitHub 仓库 URL |
| `ANNOUNCEMENT_PATH` | (空) | 由 `/api/announcement` 返回的 HTML 文件；未设置或内容为空时禁用 |
| `MCP_HOST` | `127.0.0.1` | MCP 监听地址；独立于 `HOST`。IPv6 可写 `::1` 或 `[::1]` |
| `MCP_PORT` | `5801` | MCP 监听端口；`0` 关闭 MCP；不能与 `PORT` 相同 |
| `MCP_ALLOWED_HOSTS` | (空) | 逗号分隔的 MCP `Host` 白名单。绑定 loopback 且未设置时使用 loopback 默认值；绑定非 loopback 且未设置时关闭 `Host` 校验并输出警告 |

## API 端点

### GET /ping

健康检查端点，返回 `pong`。

### GET /api/version

返回通过环境变量配置的 Android 和 Web 仓库的最新发布信息。

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

返回地图配置的 JSON 数组：

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

返回启动时从 `ANNOUNCEMENT_PATH` 加载的运营公告：

```json
{
  "enabled": true,
  "html": "<div class=\"notice\">Server maintenance at 20:00 UTC</div>"
}
```

### GET /api/servers.json

返回标准化的服务器数据。查询参数使用 snake_case，响应字段使用 camelCase。

| 参数 | 说明 |
|------|------|
| `search` | 不区分大小写搜索服务器名称、地址、注释和 IP |
| `online_only` | `true` 或 `false` |
| `map` | 按地图名称过滤 |
| `mode` | 按游戏模式过滤 |
| `country` | 按国家过滤 |
| `offset` | 分页偏移 |
| `limit` | 每页数量，默认 `20`，最大 `100` |

响应示例（已截断）：

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

返回来自上游 `view_players.php` 的标准化玩家排行榜数据。

| 参数 | 说明 |
|------|------|
| `search` | 搜索上游排行榜 |
| `db` | `invasion`、`pacific` 或 `prereset_invasion`；默认 `invasion` |
| `sort` | `rank_progression`、`username`、`kills`、`deaths`、`kd`、`score`、`time_played`、`teamkills`、`longest_kill_streak`、`targets_destroyed`、`vehicles_destroyed`、`soldiers_healed`、`distance_moved`、`shots_fired`、`throwables_thrown`、`sid` 之一 |
| `offset` | 分页偏移 |
| `limit` | 每页数量，默认 `20`，最大 `100` |

响应示例（已截断）：

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

### 错误响应

两个 JSON 端点失败时都返回 JSON 错误体：

- `400 Bad Request` — 查询参数非法；不会请求上游。
- `502 Bad Gateway` — 上游请求失败或返回的数据无法解析。

### 原始上游透传

`GET /api/server_list` 和 `GET /api/player_list` 原样代理上游 XML/HTML 接口，并保留原始查询字符串。除非需要原始上游格式，否则优先使用标准化 JSON 端点。

## MCP Server

进程同时提供基于 **Streamable HTTP** 的只读 [Model Context Protocol](https://modelcontextprotocol.io) Server。

- 自托管端点：`http://<MCP_HOST>:<MCP_PORT>/mcp`，默认 `http://127.0.0.1:5801/mcp`。
- 传输：无状态 Streamable HTTP，返回 JSON 响应。每次 `POST /mcp` 都是独立请求，不需要 session ID。
- 工具结果放在 `structuredContent` 中。参数非法返回 JSON-RPC `-32602`；上游失败或资源不存在时设置 `isError: true`，并在 `structuredContent.error` 中返回错误信息。
- 当前版本：`0.6.1`。`initialize` 响应中的 `serverInfo.name` 为 `robin rwr`。

### 工具

| 工具 | 参数 | 结果 |
|------|------|------|
| `list_servers` | 与 `/api/servers.json` 相同 | `{total, offset, limit, servers}` |
| `get_server` | `address`（字符串）、`port`（整数） | 单个服务器对象 |
| `search_players` | 与 `/api/players.json` 相同 | `{db, offset, limit, hasNext, hasPrevious, players}` |
| `list_maps` | 无 | `{maps: [...]}` |

### 连接

Claude Code：

```bash
claude mcp add --transport http robin-rwr http://127.0.0.1:5801/mcp
```

任何支持 Streamable HTTP 的 MCP 客户端都可以使用同一个 URL。服务本身没有鉴权层。

### 安全

- MCP 没有鉴权、OAuth 或限流。请保持监听在 loopback，或放在带鉴权的反向代理/网络策略之后。
- MCP 会校验请求的 `Host` 头以防止 DNS rebinding。通过代理暴露时，将 `MCP_ALLOWED_HOSTS` 设置为公网域名。
- `MCP_PORT=0` 会关闭 MCP 监听，主 HTTP 服务继续运行。
- `MCP_PORT` 不能与 `PORT` 相同。

### Kubernetes

只保留现有 Ingress 端口对外，不要把 `5801` 暴露到边缘。

- 在 Pod 内设置 `MCP_HOST=0.0.0.0`，让 Service 能访问。
- 为 `5801` 增加一个 ClusterIP Service 端口，并把 Ingress 的 `/mcp` 路径路由到它。
- 将 `MCP_ALLOWED_HOSTS` 设置为公网 Ingress 域名。
- 用 `NetworkPolicy` 限制只有 Ingress Controller 能访问 `5801`。

```yaml
env:
  - name: MCP_HOST
    value: "0.0.0.0"
  - name: MCP_PORT
    value: "5801"
  - name: MCP_ALLOWED_HOSTS
    value: "robin.example.com"
```

## 地图配置

地图通过 `MAPS_CONFIG` 环境变量指定的 JSON 文件进行配置。

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

- **`name`**: 人类可读的地图名称
- **`path`**: 地图的完整游戏路径（唯一标识符）
- **`image`**: 地图预览的图片文件名或 CDN URL

## 开发

```bash
# 先安装 Rust，然后：
git clone https://github.com/rwr-infra/robin-server.git
cd robin-server

# 运行开发服务器
cargo run

# 自定义配置
HOST=0.0.0.0 PORT=8080 cargo run
```

## 构建

```bash
# 本地构建
cargo build --release

# Docker 构建
docker build -t robin-server .
```

## 部署

### Docker 部署

```bash
# 基础部署
docker pull zhaozisong0/rwrs-server:latest
docker run -d -p 80:80 --name robin-server \
  -e HOST=0.0.0.0 \
  -e PORT=80 \
  zhaozisong0/rwrs-server:latest
```

如果需要直接暴露 MCP，同时发布 `5801` 并设置明确的 allowlist：

```bash
docker run -d -p 80:80 -p 5801:5801 --name robin-server \
  -e HOST=0.0.0.0 \
  -e PORT=80 \
  -e MCP_HOST=0.0.0.0 \
  -e MCP_PORT=5801 \
  -e MCP_ALLOWED_HOSTS=robin.example.com \
  zhaozisong0/rwrs-server:latest
```

生产环境建议只保留一个公网 Ingress 端口，并在内部按 Kubernetes 一节的说明路由 `/mcp`。

### 搭配前端

```bash
# 将前端构建复制到静态目录
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

## 测试

```bash
# 运行所有测试
cargo test --all-features

# 带输出运行
cargo test --all-features -- --nocapture

# 运行特定测试模块
cargo test --all-features cache_tests

# 生成覆盖率报告
cargo install cargo-llvm-cov
cargo llvm-cov --all-features
```

## 链接

- **仓库**: [github.com/rwr-infra/robin-server](https://github.com/rwr-infra/robin-server)

## 相关工具

- [Robin Web](/zh/tools/robin-web/) - 前端 Web 界面
- [Robin Android](/zh/tools/robin-android/) - Android 客户端
