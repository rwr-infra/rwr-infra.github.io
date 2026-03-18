---
title: Robin Android
description: Modern Android client for browsing RWR game servers
---

# Robin Android

A modern Android client for browsing Running With Rifles (RWR) game servers, providing real-time server information and comprehensive search capabilities.

## Features

### Core Functionality
- **Server Monitoring**: Track active RWR servers with detailed information
- **Real-time Updates**: Automatic refresh every 5 seconds
- **Smart Search**: Multi-field search with 300ms debouncing
- **Caching System**: Two-tier caching (memory: 5min, persistent: 24hr)

### Architecture
- **Modern Android**: Built with Jetpack Compose and Material 3
- **Repository Pattern**: Clean separation of concerns
- **Coroutines**: Asynchronous operations with proper thread management
- **Flexible Configuration**: Externalized API region support

### Additional Features
- Multi-region support with automatic failover
- Bilingual interface (English and Chinese)
- Dynamic language switching without app restart

## Technical Stack

- **Framework**: Jetpack Compose + Material 3
- **Language**: Kotlin
- **Navigation**: Navigation Compose
- **HTTP Client**: Retrofit 2 with XML/JSON converters
- **Async**: Kotlin Coroutines

## Configuration

### API Regions

Format: `id|url|label_en|label_zh`

```properties
# Example (use Unicode escapes for Chinese)
API_REGIONS=china|https://robin.kreedzt.cn/|China Mainland|\u4e2d\u56fd\u5927\u9646;global|https://robin.kreedzt.com/|Global|\u5168\u7403
```

### Configuration Methods

1. **gradle.properties** - Project-wide configuration
2. **local.properties** - Local overrides (not tracked)
3. **Environment Variables** - `export API_REGIONS="..."`
4. **Command Line** - `./gradlew assembleDebug -PAPI_REGIONS="..."`

> [!WARNING]
> When using Chinese characters in properties files, use Unicode escape sequences to avoid encoding issues.

## Build

### Prerequisites
- Android Studio Hedgehog | 2023.1.1 or later
- Android SDK (API 26+)
- JDK 17

### Commands

```bash
# Clone and build
git clone https://github.com/rwr-infra/robin-android.git
cd robin-android

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```

### Build Configuration

- **Minimum SDK**: 26 (Android 8.0)
- **Target SDK**: 36 (Android 14)
- **Compile SDK**: 36 (Android 14)

## Development

### Project Structure

```
app/src/main/java/com/kreedzt/robin/
├── data/           # Data layer
│   ├── SettingsManager.kt      # App settings management
│   ├── ServerRepository.kt      # Data repository
│   └── ApiRegionConfig.kt       # API region configuration
├── ui/            # UI layer
│   ├── MainScreen.kt            # Server browsing interface
│   ├── SettingsScreen.kt       # Settings configuration
│   └── FirstLaunchSetup.kt      # Initial setup wizard
└── App.kt         # Application entry point
```

## API Integration

Robin Android integrates with the [Robin Server](/tools/robin-server/) backend:

- **Server Data**: XML parsing from `/api/server_list`
- **Map Information**: JSON parsing from `/api/maps`
- **Error Handling**: Graceful degradation with cached data
- **Regional Support**: China and global endpoints with automatic failover

## CI/CD

GitHub Actions provides automated building and deployment:

- Push to `master` or `develop` branches triggers builds
- Version tags (v1.0.0, etc.) create GitHub Releases

```bash
# Create release
git commit -am "Release v1.0.0"
git tag v1.0.0
git push origin v1.0.0
```

## Links

- **Repository**: [github.com/rwr-infra/robin-android](https://github.com/rwr-infra/robin-android)
- **Download**: Check releases page for APK download

## Disclaimer

Robin Android is an unofficial, community-developed application that is not affiliated with, endorsed by, or authorized by the creators or publishers of Running With Rifles.

All server data originates from official Running With Rifles game servers. This application only reads publicly available server information for community purposes.

Running With Rifles is a trademark of its respective owners.

## Related Tools

- [Robin Web](/tools/robin-web/) - Web interface
- [Robin Server](/tools/robin-server/) - Backend service
