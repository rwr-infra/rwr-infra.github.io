---
title: Robin Server
description: 使用 Rust 和 Salvo 构建的 Robin Web 后端服务器
---

# Robin Server

[Robin Web](/zh/tools/robin-web/) 的后端服务器，使用 Rust 和 Salvo 框架构建。主要功能是为 Running with Rifles 游戏服务器列表代理 API 请求、提供静态文件服务以及游戏地图配置数据。

## 技术栈

- **语言**: Rust
- **框架**: Salvo
- **测试**: Vitest, Playwright

## 环境变量

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `HOST` | `127.0.0.1` | 服务器绑定地址 |
| `PORT` | `5800` | 服务器端口 |
| `MAPS_CONFIG` | `maps.json` | 地图配置文件路径 |
| `CACHE_DURATION_SECS` | `3` | 缓存过期时间（秒） |
| `RATE_LIMIT_SECS` | `3` | 速率限制间隔（秒） |
| `ANDROID_REPO_URL` | (空) | Android 应用发布的 GitHub 仓库 URL |
| `WEB_REPO_URL` | (空) | Web 应用发布的 GitHub 仓库 URL |

## API 端点

### GET /api/ping

健康检查端点，返回 "pong"。

### GET /api/version

返回通过环境变量配置的 Android 和 Web 应用的最新发布信息。

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

返回游戏地图配置数据。

### GET /api/server_list

代理 Running with Rifles 游戏服务器列表 API 的请求。支持过滤查询参数。

### GET /api/player_list

代理 Running with Rifles 玩家统计 API 的请求。返回包含玩家排名和统计信息的 HTML 内容。

```bash
# 按击杀数降序获取玩家列表
curl "http://localhost:5800/api/player_list?sort=kills&order=desc"
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
    environment:
      - HOST=0.0.0.0
      - PORT=80
      - ANDROID_REPO_URL=https://github.com/rwr-infra/robin-android
      - WEB_REPO_URL=https://github.com/rwr-infra/robin-web
    volumes:
      - ./dist:/static
      - ./maps.json:/maps.json
```

## 测试

```bash
# 运行所有测试
cargo test

# 带输出运行
cargo test -- --nocapture

# 运行特定测试模块
cargo test api_cache_tests

# 生成覆盖率报告
cargo install cargo-llvm-cov
cargo llvm-cov --all-features
```

## 链接

- **仓库**: [github.com/rwr-infra/robin-server](https://github.com/rwr-infra/robin-server)

## 相关工具

- [Robin Web](/zh/tools/robin-web/) - 前端 Web 界面
- [Robin Android](/zh/tools/robin-android/) - Android 客户端
