# Internal Traffic Filter

A Brave/Chrome browser extension to filter out your own visits from websites using Umami or datafa.st analytics.

## Supported Analytics Services

- **Umami** - Sets `localStorage.setItem('umami.disabled', '1')`
- **datafa.st** - Sets `localStorage.setItem('datafast_ignore', 'true')`

## Features

- Automatically sets the appropriate localStorage flags on blocked websites for both analytics services
- Manage blocked domains through a simple popup interface
- View all blocked sites in one place
- Easy enable/disable tracking for the current site
- Persists settings across browser sessions

## Installation

### For Development

1. Clone or download this repository
2. Open Brave browser and navigate to `brave://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `internal-traffic-filter` folder

## Usage

1. Click the extension icon in your browser toolbar
2. The popup will show the current website domain
3. Click "Disable Tracking" to prevent analytics services from tracking your visits on this site
4. Click "Enable Tracking" to allow tracking again
5. View all blocked sites in the "Blocked Sites" section
6. Remove sites from the blocked list using the "Remove" button

## How It Works

The extension uses three main components:

1. **Content Script** (`content.js`): Runs on every page and automatically sets the localStorage flags (`umami.disabled` and `datafast_ignore`) for blocked domains
2. **Popup UI** (`popup.html/js/css`): Provides the user interface for managing blocked domains
3. **Background Service** (`background.js`): Initializes extension storage

When you block a site:
- The domain is saved to browser sync storage
- The localStorage flags are set immediately for all supported analytics services
- The flags persist and are automatically set on future visits

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Uses Chrome sync storage to sync your blocked domains across devices (optional)

## Compatibility

- Brave Browser
- Chrome
- Microsoft Edge
- Any Chromium-based browser supporting Manifest V3

## Technical Details

Based on the official documentation for excluding your own visits:
- **Umami**: https://umami.is/docs/exclude-my-own-visits
- **datafa.st**: https://datafa.st/docs/excluding-analytics

The extension automates the process of running:
```javascript
// For Umami
localStorage.setItem('umami.disabled', '1');

// For datafa.st
localStorage.setItem('datafast_ignore', 'true');
```

## Files Structure

```
umami-extension/
├── manifest.json       # Extension configuration
├── popup.html          # Popup UI structure
├── popup.css           # Popup styling
├── popup.js            # Popup logic
├── content.js          # Content script for localStorage manipulation
├── background.js       # Background service worker
├── icons/              # Extension icons
│   ├── icon.svg        # Source SVG icon
│   ├── icon16.png      # 16x16 icon
│   ├── icon32.png      # 32x32 icon
│   ├── icon48.png      # 48x48 icon
│   └── icon128.png     # 128x128 icon
└── README.md           # This file
```

## License

MIT - see [LICENSE](LICENSE)

## Links

- [GitHub Repository](https://github.com/hauju/internal-traffic-filter)
- [Privacy Policy](PRIVACY.md)
