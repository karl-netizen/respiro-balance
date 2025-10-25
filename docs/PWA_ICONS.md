# PWA Icons Documentation

## Overview

This document describes the PWA (Progressive Web App) icon setup for Respiro Balance, including how to regenerate icons and customize the design.

---

## Generated Icons

### Icon Files (11 total)

**PWA Icons** (8 files):
- `icon-72x72.png` - Android Chrome (3.2 KB)
- `icon-96x96.png` - Android Chrome (4.1 KB)
- `icon-128x128.png` - Android Chrome (5.4 KB)
- `icon-144x144.png` - Windows Start Menu (6.0 KB)
- `icon-152x152.png` - iPad home screen (6.5 KB)
- `icon-192x192.png` - Android home screen (8.2 KB)
- `icon-384x384.png` - Android splash screen (18 KB)
- `icon-512x512.png` - Android splash screen (26 KB)

**Apple Icons** (1 file):
- `apple-touch-icon.png` - iOS home screen (7.7 KB, 180x180)

**Favicon Icons** (2 files):
- `favicon-16x16.png` - Browser tab (735 bytes)
- `favicon-32x32.png` - Browser tab (1.7 KB)

---

## Source Files

### Logo Design
- **File**: `public/logo.svg`
- **Size**: 512x512 viewBox
- **Design**: Breathing/meditation symbol with:
  - Blue gradient background (#3b82f6 → #2563eb)
  - White breath wave patterns
  - Central meditation icon representing lungs/breathing
  - Concentric circles suggesting breath expansion

### Colors
- **Primary Blue**: `#3b82f6` (Tailwind blue-500)
- **Dark Blue**: `#2563eb` (Tailwind blue-600)
- **Accent**: White (#ffffff)

---

## Regenerating Icons

### Quick Regeneration
```bash
npm run generate-icons
```

This will:
1. Read `public/logo.svg`
2. Generate all 11 PNG icon sizes
3. Optimize images with maximum quality
4. Output to `public/` directory

### Manual Regeneration
```bash
node scripts/generate-icons.js
```

---

## Customizing the Logo

### Option 1: Edit the SVG
1. Open `public/logo.svg` in a code editor or design tool
2. Modify the design (keep 512x512 viewBox)
3. Run `npm run generate-icons`

### Option 2: Replace with Custom Logo
1. Create your logo as SVG (512x512 recommended)
2. Save as `public/logo.svg`
3. Run `npm run generate-icons`

### Design Guidelines
- **Format**: SVG for scalability
- **Size**: 512x512 minimum
- **Safe Zone**: Keep important elements within 448x448 center
- **Colors**: Use brand colors (#3b82f6 theme)
- **Simplicity**: Icons should be recognizable at 72x72px

---

## Technical Setup

### HTML Head (index.html)
```html
<!-- PWA Manifest and Icons -->
<link rel="manifest" href="/manifest.json" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="theme-color" content="#3b82f6" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Respiro" />
```

### Manifest Configuration (public/manifest.json)
All icons are referenced with `"purpose": "any maskable"` for maximum compatibility:
- Supports Android adaptive icons
- Works on all PWA platforms
- Maskable icons adapt to device shape

---

## Platform-Specific Behavior

### Android
- **Home Screen**: Uses `icon-192x192.png`
- **Splash Screen**: Uses `icon-512x512.png`
- **Adaptive**: Maskable icons adapt to circle/squircle/rounded square
- **Install Prompt**: Shows when manifest is valid

### iOS
- **Home Screen**: Uses `apple-touch-icon.png` (180x180)
- **Status Bar**: Blue (#3b82f6)
- **App Title**: "Respiro"
- **Install**: Add to Home Screen from Share menu

### Desktop (Chrome/Edge)
- **Install Prompt**: Shows when manifest criteria met
- **App Window**: Uses largest available icon
- **Taskbar**: Uses `icon-192x192.png` or larger

---

## Testing PWA Installation

### Chrome DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Manifest" in sidebar
4. Verify all icons show correctly
5. Check "Installability" section

### Mobile Testing
**Android**:
1. Open site in Chrome
2. Tap menu → "Install app" or "Add to Home screen"
3. Verify icon appears on home screen
4. Launch app to test standalone mode

**iOS**:
1. Open site in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Verify icon and name
5. Launch from home screen

### Lighthouse Audit
```bash
# Run PWA audit
npm run build
npx serve dist
# Open Chrome DevTools → Lighthouse → Run PWA audit
```

---

## Troubleshooting

### Icons Not Showing
- Clear browser cache
- Verify manifest.json syntax: `npx json-validate public/manifest.json`
- Check browser console for errors
- Ensure HTTPS (required for PWA)

### Wrong Icon Displayed
- Check file sizes match manifest declaration
- Verify PNG files are not corrupted
- Regenerate icons: `npm run generate-icons`

### Can't Install PWA
- Verify manifest.json is served with correct MIME type
- Check service worker is registered
- Ensure HTTPS connection
- Verify all required manifest fields

---

## File Structure

```
respiro-balance/
├── public/
│   ├── logo.svg                 # Source SVG logo
│   ├── icon-72x72.png           # Generated PWA icons
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── apple-touch-icon.png     # iOS icon
│   ├── favicon-16x16.png        # Browser favicons
│   ├── favicon-32x32.png
│   ├── favicon.ico              # Legacy favicon
│   └── manifest.json            # PWA manifest
├── scripts/
│   └── generate-icons.js        # Icon generation script
└── docs/
    └── PWA_ICONS.md            # This file
```

---

## Dependencies

### Required
- **sharp**: Fast image processing library
  ```bash
  npm install --save-dev sharp
  ```

### Optional
- **imagemin**: For additional optimization
- **svgo**: For SVG optimization

---

## Best Practices

1. **Always regenerate** after logo changes
2. **Test on multiple devices** before production
3. **Use SVG source** for maximum quality
4. **Keep designs simple** for small sizes
5. **Check file sizes** - should be under 50KB each
6. **Maintain aspect ratio** - always square icons
7. **Test offline** - PWA should work without network

---

## Future Enhancements

### Planned Improvements
- [ ] Adaptive icon support (separate foreground/background)
- [ ] Dark mode icon variants
- [ ] Screenshot generation for app stores
- [ ] Automated icon testing in CI/CD
- [ ] WebP format support for smaller sizes

---

## Resources

- [PWA Icons Guide](https://web.dev/add-manifest/)
- [Maskable Icons](https://maskable.app/)
- [Apple Touch Icon Specs](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Android Adaptive Icons](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)

---

**Last Updated**: 2025-10-25
**Status**: ✅ Complete - All icons generated and tested
