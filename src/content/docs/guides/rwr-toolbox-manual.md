---
title: User Manual
description: Complete guide for RWR Toolbox, covering server browsing, data management, local mod installation, archiving, and Steam launch configuration.
---

# RWR Toolbox User Manual

This document describes how to use the RWR Toolbox desktop application. The toolbox is designed for Running With Rifles players and modders, providing server browsing, local data lookup, mod installation archiving, and hotkey management.

## Quick Start

### First Launch

After opening the app for the first time, it is recommended to go to **Settings** and complete the following basic configurations:

1. **Language**: Switch the interface language at the top of the settings page.
2. **Game Path**: Select your RWR installation directory. Dashboard and Mod features will only work after the path is validated.
3. **Scan Directories**: Add directories containing `media/packages` (such as Steam Workshop folders) to load local weapons, items, vehicles, and other data.

### Path Selection Tips

- **Windows**: The game directory is usually `C:\Program Files (x86)\Steam\steamapps\common\RunningWithRifles`.
- **macOS**: Steam installs may place resources inside `RunningWithRifles.app/Contents/Resources`. The toolbox can recognize common layouts automatically.
- The **Validate** button in settings can verify directory validity and count packages in real time.

---

## Dashboard

Dashboard is the default home page of the app, providing the following information:

- **Game Path Status**: Prompts you to go to Settings if not configured.
- **Scan Directories Overview**: Shows the number of added scan directories and total valid packages.
- **Mod Archive Stats**: Shows the number of archived mods (requires enabling the archive feature).

---

## Servers

The Servers page is used to browse online Running With Rifles servers. The following operations are supported:

### Browse and Search

- The list displays server name, map, current/max players, game mode, version, region, and latency by default.
- The top search bar supports real-time filtering by keywords such as name, map, mode, and version.
- Clicking list headers toggles sort fields (e.g., by latency or player count).

### Favorites and Filters

- The star button on each row adds a server to favorites. Favorites can be viewed separately via the filter.
- Supports combined filtering by region, game mode, version, and other dimensions.

### Latency Test

- Ping testing is enabled by default (can be disabled or timeout adjusted in Settings).
- The latency column displays the round-trip time for each server; unresponsive servers show a timeout status.

### Pagination and Refresh

- Pagination controls are provided at the bottom of the list, supporting per-page count adjustment.
- The refresh button re-fetches the latest server list.

---

## Players

The Players page supports searching public data of in-game players:

- **Search**: Enter a player name for fuzzy search.
- **Result List**: Displays player name, faction, K/D, score, and other statistics.
- **Sort and Pagination**: Supports sorting by columns, with pagination controls at the bottom of the list.

---

## Data

Data management consists of two main sections: **Local Data** and **Hotkeys**.

### Local Data

After configuring scan directories in Settings, the Local Data page loads and indexes all weapons, items, vehicles, armors, audio, effects, and other game resources.

#### Browse Modes

- **Grid View**: Displays each resource as a card with thumbnail and name.
- **List View**: Displays resources in a table, suitable for quickly comparing numerical attributes.

#### Filter and Search

- Category filters (Weapons, Items, Vehicles, Armors, etc.) are provided on the left/top.
- The search bar supports filtering by name and internal ID.
- Supports further filtering by rarity, type, faction, and other tags.

#### Detail Panel

Clicking any resource card or list row opens a detail panel on the right or in a modal:

- **Weapon Details**: Displays damage, range, fire rate, magazine, accuracy, and other parameters; supports texture preview.
- **Item Details**: Displays price, weight, effect description, etc.
- **Vehicle Details**: Displays health, speed, passenger capacity, weapon mounts, etc.

#### Quick Actions

- The detail panel provides an **Open in Editor** button to directly open the original XML configuration file for editing (requires an associated editor on the system).

### Hotkeys

The Hotkeys page allows browsing, editing, and importing/exporting game key bindings.

#### Browse Configuration

- Loads `hotkeys.xml` from the game installation directory and displays all key bindings in a list.
- Each row shows the action name, key, and modifier keys (Ctrl/Shift/Alt).

#### Edit and Save

- Click the edit button to modify the key binding for a specific action.
- After making changes, click Save and the app will write the new configuration back to `hotkeys.xml`.

#### Import / Export

- **Export**: Exports the current key binding configuration as a standalone file for backup or migration between devices.
- **Import**: Select an existing key binding configuration file to overwrite the current one.

---

## Mods

The Mods page is the core entry point for mod management, containing three tabs: **Install**, **Bundle**, and **Assets**.

### Install

The installation flow uses a three-step wizard design:

#### Step 1: Select Mod Package

- Click the **Select Mod File** button and choose a `.zip` format RWRMI mod package in the file dialog.
- Only RWRMI format packages packed with this tool are supported. Typical file name: `[RWRMI][game_version]title vversion.zip`.

#### Step 2: Review Mod Info

- After selecting the file, the toolbox automatically parses `config.json` inside the archive and displays the mod title, description, version, supported game version, authors, and other info.
- This step provides three auxiliary buttons:
  - **File List**: Opens the file selection modal to review and check files to install.
  - **README**: View the documentation provided by the mod author.
  - **CHANGELOG**: View version update logs.

#### File Selection (File List)

The file list modal allows precise control over which files will be written to the game directory before installation:

- **Default Behavior**: When opened for the first time, `.txt` files are **unchecked** by default, while all other files are **checked** by default.
- **Select All / Invert**: Quick action buttons are provided at the top of the modal.
- **Single File Toggle**: Clicking a row or its checkbox toggles the checked state.
- **Estimated Size**: The bottom of the modal displays the total size of checked files in real time for disk usage assessment.

#### Step 3: Installation Options and Execution

- **Target Path**: Displays the current game installation directory. Continue after confirming it is correct.
- **Backup original files**: When checked, the toolbox automatically backs up the original game files that will be overwritten before installation (only the most recent backup is retained).
- **Overwrite existing files**: When checked, allows overwriting existing files with the same name.
- **Selected Files Summary**: The top of the installation page shows the number of selected files and the estimated installation size again. Click **Install** to execute after confirmation.

After successful installation, if **Mod Archive** is enabled, the package will be automatically copied to the archive directory.

### Bundle

The Bundle feature is used to package a local mod folder into the standard RWRMI format for distribution.

#### Bundle Flow

1. Click **Select Folder** and choose the mod root directory.
2. The toolbox checks whether `config.json`, README, and CHANGELOG exist in the directory; if missing, default templates will be generated automatically.
3. After bundling is complete, a `[RWRMI][game_version]title vversion.zip` file will be output in the same directory.

### Assets

The Assets tab is used to manage archived copies of previously installed mod packages. You need to enable the archive feature and specify a directory in Settings first.

#### Enable Archive

Go to **Settings → Mod Archive**:

1. Turn on the **Enable archive** toggle.
2. Click **Select Directory** and choose a directory to store archived `.zip` files.
3. From then on, every time a mod is successfully installed, the package will be automatically copied to this directory (deduplication via MD5; files with identical content will not be saved repeatedly).

#### Archive List

- The list displays metadata for each archived mod: title, version, supported game version, authors, etc.
- Click a row to view details (full info + file list).
- **Refresh**: Rescans the archive directory and refreshes the list.

#### Reinstall

- The download icon on each row brings the corresponding archived package into the Install wizard's Step 2, allowing the user to reconfirm file selection and installation options just like a fresh install.

#### Delete Archive

- The delete icon on each row supports deleting the archived file (with a confirmation dialog). Note: Deletion only affects the archive copy and does not affect files already installed in the game.

---

## Settings

The Settings page is divided into multiple sections. All configurations are persisted automatically.

### Language & Theme

- **Language**: Switch the interface display language (switched at runtime, no restart required).
- **Theme**: Switch between Light, Dark, or Auto (follow system).

### Steam Launch

Used to configure command-line arguments when launching RWR through Steam.

#### Boolean Parameters

Provides toggles for common launch parameters, such as:

- `skip_nat_server_usage`
- `debugmode`
- `verbose`
- `opengl`
- `big_water`

#### Key-Value Parameters

Supports adding custom key-value pairs (e.g., `server 192.168.1.1`).

#### Custom Tokens

A text area supports entering any additional parameters line by line.

#### Launch and Copy

- **Copy Args**: Copies the current full launch argument text to the clipboard.
- **Launch**: Attempts to launch the game directly via the Steam protocol (requires the Steam client to be running).

### Game Path

- Select the RWR installation directory. After selection, it is recommended to click **Validate** to verify directory validity.
- After validation passes, the number of packages contained in the directory is displayed.

### Directory Management

- **Add Directory**: Add additional `media/packages` scan directories (suitable for Steam Workshop directories and custom resource directories).
- Each row displays the directory path, validation status, package count, and last scan time.
- Supports enabling/disabling individual directories, revalidating, and deleting.

### Mod Archive

- **Enable archive**: When enabled, a copy of the mod package is automatically retained after each successful installation.
- **Archive Directory**: Specifies the archive storage directory. Clearing it pauses the archive function until a new directory is selected.

---

## FAQ

### Game path validation failed

- Make sure the selected directory is the game root directory (containing `media/packages` or `RunningWithRifles.app`).
- macOS users who installed via Steam should try selecting the `RunningWithRifles` folder in the Steam library rather than the `.app` itself.

### Game behaves abnormally after mod installation

- Check **Backup original files** before installing. If problems occur after installation, go to the Install page Step 3 and click **Recover Backup** to restore original files.
- Note: Only the most recent backup is retained; repeated backups will overwrite the old one.

### Duplicate files in the archive directory

- The toolbox performs MD5 comparison when archiving. If the content is identical, copying is skipped; if the names are the same but the content differs, both versions are saved with a timestamp suffix.

### "Game path not configured" prompt during installation

- Correctly set the Game Path in Settings and ensure it passes validation, and that the target path contains a writable `media/packages` directory.

---

## Shortcuts and Tips

- All tables support clicking column headers to sort and pagination controls at the bottom.
- Modals can be closed by clicking the backdrop overlay or the **Close** button.
- In the file selection modal, clicking a row or its checkbox toggles the checked state.
- All changes in Settings are saved automatically; no manual Save button is required.
