# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Internal Traffic Filter is a Chrome/Brave browser extension (Manifest V3) that filters out users' own visits from websites using Umami or datafa.st analytics. It automates setting the appropriate localStorage flags on blocked domains:
- `umami.disabled` = `'1'` (for Umami)
- `datafast_ignore` = `'true'` (for datafa.st)

## Development Commands

**No build process required** - this is a vanilla JavaScript extension that loads directly into the browser.

### Load Extension for Development
1. Open `brave://extensions/` or `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this folder

### Generate Icons (one-time setup)
```bash
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 32x32 icons/icon32.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

## Architecture

Three-component architecture with Chrome APIs:

1. **content.js** - Content script injected at `document_start` on all pages
   - Reads blocked domains from `chrome.storage.sync`
   - Sets/removes `umami.disabled` and `datafast_ignore` localStorage flags
   - Listens for messages from popup

2. **popup.js/html/css** - Extension popup UI
   - Manages blocked domains list
   - Sends messages to content script
   - Updates Chrome sync storage

3. **background.js** - Service worker
   - Minimal initialization on install
   - Initializes empty `blockedDomains` array

### Data Flow
```
popup.js → sends message → content.js → sets localStorage flag
popup.js → updates → chrome.storage.sync
content.js → reads storage on page load → applies flag
```

### Storage
- Uses `chrome.storage.sync` for cross-device sync
- Stores array of blocked domain origins (e.g., `https://example.com`)

## Key Files

| File | Purpose |
|------|---------|
| manifest.json | Extension config - permissions, content scripts, icons |
| content.js | Runs on every page, manages analytics localStorage flags |
| popup.js | Main extension logic, manages blocked domains |
| background.js | Service worker initialization |

## Browser Compatibility

Works on any Chromium-based browser supporting Manifest V3: Brave, Chrome, Microsoft Edge.
