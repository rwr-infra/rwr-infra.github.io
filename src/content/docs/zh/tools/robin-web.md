---
title: Robin Web
description: 适用于 Running with Rifles 游戏的简洁现代数据浏览器
---

# Robin Web

> [!WARNING]
> 本项目原名为 **RWRS Another Page V2**，已更名为 **Robin Web**，以更好地体现其社区驱动的性质。

一款适用于 Running with Rifles (RWR) 游戏的简洁现代数据浏览器，灵感来源于 [rwrstats](https://rwrstats.com/)。

## 功能特性

**服务器与玩家数据**

- 实时服务器列表，支持自动刷新
- 玩家排行榜，包含 15+ 项统计（击杀、死亡、K/D、得分、游戏时长、军衔进度等）
- 多数据库支持（Invasion、Pacific、Prereset Invasion）

**搜索与筛选**

- 支持键盘快捷键（/）的全文搜索
- 预设快速筛选（Official、WW2、Dominance、Castling、HellDivers 模组）
- 多级列排序（升序/降序/清除）

**用户界面**

- 双视图模式：数据表格（桌面端）和响应式卡片（移动端）
- 列可见性切换，设置持久化
- 地图预览图，支持弹窗展示
- 动态语言切换（英文和中文）
- 移动端友好，支持无限滚动

**分享与导出**

- 玩家统计分享，提供 PC/移动端优化的卡片
- 服务器信息分享，包含必要的连接详情（IP、端口）
- 高质量 PNG 图片生成
- 支持下载或复制到剪贴板

## 技术栈

- **框架**: SvelteKit 2.x + Svelte 5
- **样式**: Tailwind CSS 4.0 + DaisyUI 组件
- **语言**: TypeScript 5.0
- **测试**: Vitest（单元测试）+ Playwright（端到端测试）
- **国际化**: @inlang/paraglide-js

## 统计分析

应用内置了全面的统计分析系统，在尊重隐私的前提下追踪用户交互：

### 支持的平台

- **Google Analytics (gtag)** - 通过外部注入的 gtag 脚本追踪事件
- **Baidu Analytics (_hmt)** - 通过百度统计平台追踪事件
- **Umami Analytics** - 通过 Umami 隐私友好的分析平台追踪事件

### 隐私优先设计

- **不追踪敏感数据**：搜索查询永远不会发送（仅发送搜索触发事件）
- **无需同意**：检测到脚本时自动启用统计
- **安全集成**：优雅地处理缺失的分析平台，不会报错

## 部署

### Docker

#### 社区镜像

```bash
docker pull zhaozisong0/robin-web-community:latest
docker run -d --name robin-web -p 80:80 zhaozisong0/robin-web-community:latest
```

**特性：**
- 自动使用 `window.location.origin` 作为 meta 标签和 SEO 来源
- 基本使用无需环境变量

可选运行时配置：

```bash
docker run -d --name robin-web -p 80:80 \
  -e "VITE_SITE_URL=https://your-domain.com" \
  zhaozisong0/robin-web-community:latest
```

#### 搭配后端

```bash
# 创建网络
docker network create robin-network

# 启动后端
docker pull zhaozisong0/rwrs-server:latest
docker run -d --name rwrs-server --network robin-network \
  -e "HOST=0.0.0.0" -e "PORT=80" \
  zhaozisong0/rwrs-server:latest

# 启动前端
docker pull zhaozisong0/robin-web-community:latest
docker run -d --name robin-web --network robin-network -p 80:80 \
  zhaozisong0/robin-web-community:latest
```

### 手动构建

```bash
pnpm install
pnpm build
```

### CDN 构建

```bash
# 所有资源使用同一 CDN 路径
CDN_URL=https://assets.example.com pnpm build:cdn

# 图片使用独立 CDN
CDN_URL=https://assets.example.com CDN_IMAGE_URL=https://img.example.com pnpm build:cdn
```

## 链接

- **仓库**: [github.com/rwr-infra/robin-web](https://github.com/rwr-infra/robin-web)
- **在线演示**: 访问 [robin.rwr.dev](https://robin.rwr.dev)（如果可用）

## 免责声明

本项目为独立作品，**与 RWRS (Running with Rifles Stats) 及其作者不存在任何关联、授权、认可或官方连接**。

唯一的关联是本项目**受 RWRS 启发**，但完全从头编写，不包含原始仓库的任何代码、文档或资源。

## 相关工具

- [Robin Server](/zh/tools/robin-server/) - 后端服务
- [Robin Android](/zh/tools/robin-android/) - Android 客户端
