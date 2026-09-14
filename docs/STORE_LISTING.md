# Chrome Web Store Listing

This is the canonical copy for the [SuperScroll Chrome Web Store listing](https://chromewebstore.google.com/detail/superscroll/lelhnakechcmiefkfbmkfdkpdjjeapem).
Tracked here so listing changes go through the same review as code changes.

> **The dashboard's description field is plain text — it does not render
> Markdown.** ([source](https://developer.chrome.com/docs/webstore/best-listing))
> Headers, `**bold**`, and tables show up as literal characters. Use the
> [Description](#description) section below for readability in the repo; when
> updating the live listing, copy the
> [plain-text version](#description-plain-text-for-pasting-into-the-dashboard)
> instead, into the **Fiche Play Store** (Store listing) tab of the
> [Developer Dashboard](https://chrome.google.com/webstore/devconsole).

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

### Description (plain text, for pasting into the dashboard)

```text
A modern, smooth, and intelligent auto-scrolling extension that transforms your web browsing experience.

🎯 Core Features
🚀 Ultra-Fast Scrolling — 8 speed presets from 50 px/s to 10,000 px/s
⚡ Browser Limitation Bypass — direct DOM manipulation for maximum speed
🎮 Intuitive Controls — clean 3-button interface (Up, Pause, Down)
⌨️ Keyboard Shortcuts — Alt+S (toggle), Alt+↑/↓ (direction), Alt+P (pause)
🛡️ Auto-Pause — intelligent pause on user interaction
🎨 Modern UI — gradient buttons with smooth animations

🏎️ Speed Presets
Very Slow — 50 px/s — careful reading
Slow — 150 px/s — comfortable browsing
Moderate — 300 px/s — normal scanning
Fast — 600 px/s — quick navigation
Very Fast — 1,200 px/s — speed reading
Ultra Fast — 2,500 px/s — rapid browsing
Ludicrous — 5,000 px/s — very fast scrolling
Insane — 10,000 px/s — maximum velocity!

Use Cases
📖 Reading Long Articles — perfect for news articles, blog posts, and documentation. Use Slow or Moderate speed for a comfortable reading pace.
📱 Social Media Browsing — great for scrolling through feeds on Twitter, Reddit, or Instagram. Use Fast or Very Fast speed for quick content scanning.
🎬 Teleprompter Mode — ideal for presentations and video recording. Use Very Slow speed for consistent, predictable scrolling.
📚 Code Review — excellent for examining code line by line. Use Very Slow speed for careful inspection.
```

## Permissions justification

Reference for the "why does this extension need X" fields in the dashboard:

- **activeTab**: lets the popup identify and message the current tab.
- **scripting**: re-injects the content script into tabs that were already open
  before the extension was installed or updated, so the scroll controls work on
  the first click instead of requiring a manual page reload.
- **host_permissions (`<all_urls>`)**: the content script and scroll controls
  need to run on any site the user chooses to scroll.

### Scripting justification (plain text, for the dashboard field)

```text
SuperScroll uses the scripting permission to re-inject its own content script into
the active tab when messaging fails. This happens for tabs that were already open
before the extension was installed or updated — Chrome does not automatically
inject content scripts into pre-existing tabs, so without this, clicking the
extension's controls on such a tab does nothing until the user manually reloads
the page.

The permission is used narrowly: only the extension's own bundled content script
is injected, only into the single active tab, and only in direct response to the
user clicking a control in the popup — never automatically, in the background, or
into arbitrary tabs.
```

## Version history

| Version | Notes |
|---------|-------|
| 1.0.1   | Fix: scroll buttons unresponsive on tabs opened before install/update (auto-recovers by re-injecting the content script). |
| 1.0.0   | Previous public release. |
