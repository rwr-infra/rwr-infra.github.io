---
title: RWR Toolbox
description: 面向 Running With Rifles 玩家和模组作者的桌面端工具
---

# RWR Toolbox

> [!WARNING]
> **正在开发中**: 本项目处于早期阶段，应被视为**不稳定**。功能可能会在无预警的情况下更改或损坏。

一款专为 **Running With Rifles** 玩家和模组作者设计的高性能桌面工具。RWR Toolbox 以安全性和速度为核心，提供了一套全面的工具来管理游戏数据、服务器和配置。

## 免责声明

**RWR Toolbox** 是一个社区驱动的项目，**不**隶属于、授权、维护、赞助或认可 **Osumia Games**。

所有 **Running With Rifles** 相关的内容、资产和商标——包括但不限于本工具解析的游戏数据——均为 **Osumia Games** 的专有财产。本工具纯粹作为社区资源提供，用于与原始安装提供的游戏文件进行交互。

## 主要功能

- **数据浏览器**: 并行扫描游戏目录，浏览武器和物品，完整解析 XML 属性。
- **服务器浏览器**: 实时服务器列表，支持收藏跟踪和低延迟 Ping 测试。
- **玩家统计**: 追踪和搜索多个游戏数据库中的玩家排名。
- **模组管理**: 简化本地模组的安装和打包，支持备份。
- **热键管理器**: 读取、创建和分享游戏的自定义键盘配置。
- **现代用户体验**: 完全响应式 UI（支持 800x600），支持暗黑模式、搜索高亮和国际化。

## 技术栈

- **前端**: Angular v20, TypeScript, Tailwind CSS v4, DaisyUI v5
- **后端**: Rust, Tauri v2.x
- **性能**: Rayon 并行文件处理, Quick-XML 高效解析
- **状态管理**: Angular Signals
- **国际化**: Transloco

## 链接

- **仓库**: [github.com/rwr-infra/rwr-toolbox](https://github.com/rwr-infra/rwr-toolbox)

## 开发

```bash
pnpm install
pnpm tauri dev
```

## 构建

```bash
pnpm tauri build
```

## 用户手册

- [English Manual](/guides/rwr-toolbox-manual/)
- [简体中文手册](/zh/guides/rwr-toolbox-manual/)

## 相关工具

- [Robin Web](/zh/tools/robin-web/) - 服务器查询功能
- [Robin Server](/zh/tools/robin-server/) - 后端服务
