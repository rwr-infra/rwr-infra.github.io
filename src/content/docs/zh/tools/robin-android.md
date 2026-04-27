---
title: Robin Android
description: 用于浏览 RWR 游戏服务器的现代 Android 客户端
---

# Robin Android

一款用于浏览 Running With Rifles (RWR) 游戏服务器的现代 Android 客户端，提供实时服务器信息和全面的搜索功能。

## 功能特性

### 核心功能
- **服务器监控**: 追踪活跃的 RWR 服务器，显示详细信息
- **实时更新**: 每 5 秒自动刷新
- **智能搜索**: 多字段搜索，300ms 防抖
- **缓存系统**: 两级缓存（内存：5分钟，持久化：24小时）

### 架构
- **现代 Android**: 使用 Jetpack Compose 和 Material 3 构建
- **仓库模式**: 清晰的关注点分离
- **协程**: 异步操作配合合适的线程管理
- **灵活配置**: 外部化的 API 区域支持

### 附加功能
- 多区域支持，自动故障转移
- 双语界面（英文和中文）
- 无需重启应用即可动态切换语言

## 技术栈

- **框架**: Jetpack Compose + Material 3
- **语言**: Kotlin
- **导航**: Navigation Compose
- **HTTP 客户端**: Retrofit 2，支持 XML/JSON 转换器
- **异步**: Kotlin Coroutines

## 配置

### API 区域

格式: `id|url|label_en|label_zh`

```properties
# 示例（中文使用 Unicode 转义）
API_REGIONS=china|https://robin.kreedzt.cn/|China Mainland|\u4e2d\u56fd\u5927\u9646;global|https://robin.kreedzt.com/|Global|\u5168\u7403
```

### 配置方法

1. **gradle.properties** - 项目级配置
2. **local.properties** - 本地覆盖（不追踪）
3. **环境变量** - `export API_REGIONS="..."`
4. **命令行** - `./gradlew assembleDebug -PAPI_REGIONS="..."`

> [!WARNING]
> 在 properties 文件中使用中文字符时，请使用 Unicode 转义序列以避免编码问题。

## 构建

### 前提条件
- Android Studio Hedgehog | 2023.1.1 或更高版本
- Android SDK（API 26+）
- JDK 17

### 命令

```bash
# 克隆并构建
git clone https://github.com/rwr-infra/robin-android.git
cd robin-android

# 构建 debug APK
./gradlew assembleDebug

# 构建 release APK
./gradlew assembleRelease
```

### 构建配置

- **最低 SDK**: 26 (Android 8.0)
- **目标 SDK**: 36 (Android 14)
- **编译 SDK**: 36 (Android 14)

## 开发

### 项目结构

```
app/src/main/java/com/kreedzt/robin/
├── data/           # 数据层
│   ├── SettingsManager.kt      # 应用设置管理
│   ├── ServerRepository.kt      # 数据仓库
│   └── ApiRegionConfig.kt       # API 区域配置
├── ui/            # UI 层
│   ├── MainScreen.kt            # 服务器浏览界面
│   ├── SettingsScreen.kt       # 设置配置
│   └── FirstLaunchSetup.kt      # 首次启动向导
└── App.kt         # 应用入口点
```

## API 集成

Robin Android 与 [Robin Server](/zh/tools/robin-server/) 后端集成：

- **服务器数据**: 从 `/api/server_list` 解析 XML
- **地图信息**: 从 `/api/maps` 解析 JSON
- **错误处理**: 优雅降级，使用缓存数据
- **区域支持**: 中国和全球端点，自动故障转移

## CI/CD

GitHub Actions 提供自动构建和部署：

- 推送到 `master` 或 `develop` 分支触发构建
- 版本标签（v1.0.0 等）创建 GitHub Releases

```bash
# 创建发布
git commit -am "Release v1.0.0"
git tag v1.0.0
git push origin v1.0.0
```

## 链接

- **仓库**: [github.com/rwr-infra/robin-android](https://github.com/rwr-infra/robin-android)
- **下载**: 查看 releases 页面获取 APK 下载

## 免责声明

Robin Android 是一款非官方的社区开发应用，与 Running With Rifles 的创作者或发行商不存在任何关联、认可或授权关系。

所有服务器数据均来自 Running With Rifles 官方游戏服务器。本应用仅读取公开可用的服务器信息，用于社区目的。

Running With Rifles 是其各自所有者的商标。

## 相关工具

- [Robin Web](/zh/tools/robin-web/) - Web 界面
- [Robin Server](/zh/tools/robin-server/) - 后端服务
