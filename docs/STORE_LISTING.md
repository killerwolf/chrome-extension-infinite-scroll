# Chrome Web Store Listing

This is the canonical copy for the [SuperScroll Chrome Web Store listing](https://chromewebstore.google.com/detail/superscroll/lelhnakechcmiefkfbmkfdkpdjjeapem).
Tracked here so listing changes go through the same review as code changes.
When updating the live listing, copy the description below into the
**Fiche Play Store** (Store listing) tab of the
[Developer Dashboard](https://chrome.google.com/webstore/devconsole).

## Description

A modern, smooth, and intelligent auto-scrolling extension that transforms your web browsing experience.

### 🎯 Core Features (Implemented)

- **🚀 Ultra-Fast Scrolling**: 8 speed presets from 50 px/s to 10,000 px/s
- **⚡ Browser Limitation Bypass**: Direct DOM manipulation for maximum speed
- **🎮 Intuitive Controls**: Clean 3-button interface (Up, Pause, Down)
- **⌨️ Keyboard Shortcuts**: Alt+S (toggle), Alt+↑/↓ (direction), Alt+P (pause)
- **🛡️ Auto-Pause**: Intelligent pause on user interaction
- **🎨 Modern UI**: Gradient buttons with smooth animations

### 🏎️ Speed Presets

| Speed Level | Pixels/Second   | Use Case             |
|-------------|-----------------|-----------------------|
| Very Slow   | 50 px/s         | Careful reading       |
| Slow        | 150 px/s        | Comfortable browsing  |
| Moderate    | 300 px/s        | Normal scanning       |
| Fast        | 600 px/s        | Quick navigation      |
| Very Fast   | 1,200 px/s      | Speed reading         |
| Ultra Fast  | 2,500 px/s      | Rapid browsing        |
| Ludicrous   | 5,000 px/s      | Very fast scrolling   |
| **Insane**  | **10,000 px/s** | **Maximum velocity!** |

### Use Cases

#### 📖 Reading Long Articles
Perfect for news articles, blog posts, and documentation. Use **Slow** or **Moderate** speed for comfortable reading pace.

#### 📱 Social Media Browsing
Great for scrolling through feeds on Twitter, Reddit, or Instagram. Use **Fast** or **Very Fast** speed for quick content scanning.

#### 🎬 Teleprompter Mode
Ideal for presentations and video recording. Use **Very Slow** speed for consistent, predictable scrolling.

#### 📚 Code Review
Excellent for examining code line by line. Use **Very Slow** speed for careful inspection.

## Permissions justification

Reference for the "why does this extension need X" fields in the dashboard:

- **activeTab**: lets the popup identify and message the current tab.
- **scripting**: re-injects the content script into tabs that were already open
  before the extension was installed or updated, so the scroll controls work on
  the first click instead of requiring a manual page reload.
- **host_permissions (`<all_urls>`)**: the content script and scroll controls
  need to run on any site the user chooses to scroll.

## Version history

| Version | Notes |
|---------|-------|
| 1.0.1   | Fix: scroll buttons unresponsive on tabs opened before install/update (auto-recovers by re-injecting the content script). |
| 1.0.0   | Previous public release. |
