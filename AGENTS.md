# AGENTS.md — SuperScroll Autonomous Agent Operating Manual

This document is the **single source of truth** for an autonomous AI agent that continuously iterates on, improves, tests, builds, and publishes the SuperScroll Chrome extension. The human operator intervenes **only** for consequential direction changes (major technology shifts, fundamental architecture rewrites, or strategic pivots). Everything else — feature development, bug fixes, refactoring, versioning, store publishing — is fully autonomous.

---

## 1. Project Identity & Mission

| Field | Value |
|-------|-------|
| **Product** | SuperScroll — intelligent auto-scroll Chrome extension |
| **Repository** | `killerwolf/chrome-extension-infinite-scroll` |
| **Chrome Web Store ID** | `lelhnakechcmiefkfbmkfdkpdjjeapem` |
| **Current Version** | `1.0.1` (see `package.json` & `wxt.config.ts`) |
| **Mission** | Provide the smoothest, fastest, most customizable auto-scrolling experience on any webpage — zero telemetry, zero network calls, pure local execution. |

**Core value props** (never compromise):
- 8 speed presets: 50 → 10,000 px/s
- Direct DOM manipulation bypassing browser throttling
- Auto-pause on any user interaction (wheel, touch, key, click)
- Keyboard shortcuts: `Alt+S` (toggle), `Alt+↑/↓` (direction), `Alt+P` (pause)
- Clean, accessible, gradient UI with status feedback
- Works on **any** URL (`<all_urls>` host permission)

---

## 2. Technology Stack (Locked)

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Extension Framework | **WXT** | `0.20.x` | Manifest V3, auto-generates `manifest.json` from `wxt.config.ts` |
| UI Framework | **React** | `19.x` | Functional components, hooks only |
| Language | **TypeScript** | `5.8.x` | Strict mode, `tsconfig.json` extends `.wxt/tsconfig.json` |
| Styling | **Tailwind CSS** | `4.1.x` | CSS variables, dark mode via class, `tailwindcss-animate` |
| Components | **shadcn/ui + Radix UI** | Latest | `components/ui/` — Button, Label, Slider, Switch |
| Build Tool | **Vite** (via WXT) | Bundled | `npm run build` outputs to `.output/chrome-mv3/` |
| Lint/Format | **Biome** | `1.9.x` | `npm run lint`, `npm run format` — **must pass before every commit** |
| Package Manager | **npm** | `>=18` | `package-lock.json` committed |
| CI/CD | **GitHub Actions** | — | `.github/workflows/extension-package.yml` + `gh-pages.yml` |
| Versioning | **SemVer** + Keep a Changelog | — | `CHANGELOG.md` is source of truth |

**Do not change** the stack without explicit human approval.

---

## 3. Repository Structure (Canonical)

```
chrome-extension-infinite-scroll/
├── .github/
│   └── workflows/
│       ├── extension-package.yml   # Build, lint, zip, attach to GitHub Release on tag
│       └── gh-pages.yml            # Deploy demo/ to GitHub Pages
├── assets/                         # Global CSS entry (assets/index.css → tailwind)
├── components/
│   └── ui/                         # shadcn/ui components (Button, Label, Slider, Switch)
├── demo/                           # Static landing page (deployed to GitHub Pages)
├── docs/
│   ├── ARCHITECTURE.md             # Full technical architecture (source of truth)
│   ├── (backlog lives in GitHub Issues) # No local backlog file
│   ├── CONTRIBUTING.md             # Human contributor guide
│   └── STORE_LISTING.md            # Chrome Web Store listing copy (plain-text ready)
├── entrypoints/
│   ├── popup/
│   │   ├── App.tsx                 # Main popup React component
│   │   ├── main.tsx                # React entry point
│   │   ├── index.html              # Popup HTML
│   │   └── index.css               # Tailwind CSS + CSS variables
│   ├── content.ts                  # Content script (scroll engine, message bus)
│   └── background.ts               # Service worker (minimal, logging only)
├── lib/
│   └── utils.ts                    # `cn()` classname utility (clsx + tailwind-merge)
├── public/
│   └── icon/                       # Extension icons (16, 32, 48, 128)
├── .output/                        # **Git-ignored** — WXT build output
├── .wxt/                           # **Git-ignored** — WXT internal cache
├── biome.json                      # Biome config (lint + format)
├── CHANGELOG.md                    # Keep a Changelog format
├── components.json                 # shadcn/ui config (aliases, paths)
├── package.json                    # Version, scripts, deps
├── package-lock.json               # Locked dependencies
├── postcss.config.cjs              # PostCSS (Tailwind v4)
├── README.md                       # Public-facing documentation
├── tailwind.config.js              # Tailwind theme, content paths, plugins
├── tsconfig.json                   # TypeScript config (extends .wxt/tsconfig.json)
└── wxt.config.ts                   # **Single source of manifest** (name, version, permissions, icons)
```

---

## 4. Autonomous Development Loop

The agent operates in a continuous **Observe → Plan → Execute → Verify → Release** cycle.

### 4.1 Observe (Continuous)

**Sources to scan on every cycle:**
1. **GitHub Issues** — Search `repo:killerwolf/chrome-extension-infinite-scroll is:issue is:open` for bugs, feature requests, user feedback
2. **Chrome Web Store Reviews** — Periodically fetch reviews for `lelhnakechcmiefkfbmkfdkpdjjeapem` (rating drops, crash reports, feature asks)
3. **Codebase Health** — Run `npm run lint && npm run compile` to catch drift
4. **Backlog** — Scan GitHub Issues: `repo:killerwolf/chrome-extension-infinite-scroll is:open label:agent-ready` for items ready for the agent. Also watch GitHub Discussions + Chrome Store reviews.
5. **Performance** — Profile scroll engine on heavy pages (YouTube, Twitter/X, infinite feeds)

**Signal → Ticket mapping:**
| Signal | Auto-create | Priority |
|--------|-------------|----------|
| Crash/error in console | `bug: <error summary>` | P0 |
| Store review ≤3 stars mentioning bug | `bug: <review summary>` | P0 |
| Store review requesting feature | `feat: <request summary>` | P1 |
| Lint/compile failure | `chore: fix lint/compile` | P0 |
| Backlog item marked `ready` | Pull next `ready` item | P1 |
| Performance regression (>16ms frame) | `perf: <description>` | P1 |

### 4.2 Plan (Per Ticket)

For each ticket, produce a **Plan** (internal, not committed) with:
- **Objective** — one sentence
- **Files to touch** — explicit list
- **Tests required** — manual + automated checks
- **Version bump** — `patch` / `minor` / `major` (default `patch`)
- **Changelog entry** — draft entry for `CHANGELOG.md`

### 4.3 Execute (Standard Workflow)

```bash
# 1. Create feature branch (if not already on one)
git checkout -b <ticket-slug>

# 2. Implement changes
#    - Follow existing patterns (see ARCHITECTURE.md)
#    - TypeScript strict, no `any` unless justified
#    - Biome formatting enforced

# 3. Verify locally
npm run lint          # Must pass (zero errors)
npm run format        # Auto-fix formatting
npm run compile       # TypeScript check (tsc --noEmit)
npm run build         # Full WXT build → .output/chrome-mv3/

# 4. Manual smoke test
#    - Load .output/chrome-mv3/ as unpacked extension in Chrome
#    - Test on: news article, Twitter/X feed, YouTube, GitHub README, PDF viewer
#    - Verify: all 8 speeds, up/down/pause, keyboard shortcuts, auto-pause, restricted pages

# 5. Update version & changelog (see Section 5)
# 6. Commit (conventional commits)
git add -A
git commit -m "type(scope): description"
# Types: feat, fix, perf, chore, docs, refactor, test
```

### 4.4 Verify (Quality Gates)

**Automated (CI runs on every push):**
- `npm ci` → `npm run build` → `npm run lint` → `npx web-ext lint`
- Artifact: `SuperScroll-<version>.zip` uploaded to GitHub Actions
- On tag push: zip attached to GitHub Release

**Manual (agent must perform before release):**
| Test | Criteria |
|------|----------|
| Cold install | Fresh Chrome profile, install zip, open popup, scroll down |
| Upgrade path | Install v1.0.0 zip → update to new zip → no reload needed |
| Restricted pages | `chrome://extensions`, `chrome.google.com/webstore` show "unsupported" message |
| Pre-existing tabs | Open tab → install extension → click scroll down → works without reload |
| Speed presets | All 8 presets produce visibly different speeds |
| Keyboard shortcuts | `Alt+S`, `Alt+↑`, `Alt+↓`, `Alt+P` work when popup focused |
| Auto-pause | Wheel, click, keydown, touch all pause scrolling |
| Dark mode | Popup renders correctly in Chrome dark mode |
| Memory | No leak after 5 min continuous scrolling (DevTools Memory tab) |

### 4.5 Release (Versioning & Publishing)

**See Section 5 for detailed procedure.** Summary:
1. Bump version in `package.json` AND `wxt.config.ts` (must match)
2. Add entry to `CHANGELOG.md` under `## [Unreleased]` → move to `## [X.Y.Z] - YYYY-MM-DD`
3. `npm run build && npm run zip` → verify `.zip` in `.output/`
4. Create git tag `vX.Y.Z` and push → GitHub Action creates Release + attaches zip
5. **Manual step (human or agent with store credentials):** Upload zip to Chrome Web Store Developer Dashboard
6. Update `docs/STORE_LISTING.md` if description/permissions changed

---

## 5. Versioning & Publishing Protocol

### 5.1 Semantic Versioning Rules

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Bug fix, internal refactor, docs, CI, chore | **PATCH** (`1.0.1 → 1.0.2`) | Auto-pause fix, lint cleanup |
| New speed preset, new keyboard shortcut, new setting, non-breaking UI enhancement | **MINOR** (`1.0.1 → 1.1.0`) | Add "Custom Speed" input, new teleprompter mode |
| Breaking API change, manifest V2→V3, permission removal/addition, storage schema change | **MAJOR** (`1.0.1 → 2.0.0`) | Remove `host_permissions`, change message protocol |

**Default:** Every autonomous release is a **PATCH** unless the Plan explicitly justifies MINOR/MAJOR.

### 5.2 Version Files (Must Stay In Sync)

| File | Field | Update Command |
|------|-------|----------------|
| `package.json` | `"version"` | `npm version patch|minor|major --no-git-tag-version` |
| `wxt.config.ts` | `manifest.version` | Manual edit to match `package.json` |

**Critical:** After `npm version`, immediately sync `wxt.config.ts` to the same version. The GitHub Action reads version from the built `manifest.json` (generated from `wxt.config.ts`).

### 5.3 Changelog Format (Keep a Changelog)

```markdown
## [Unreleased]

## [1.0.2] - 2026-11-20
### Fixed
- Auto-pause now respects `passive: true` on touchstart for iOS Safari compatibility

## [1.0.1] - 2026-09-14
### Fixed
- Scroll buttons no longer fail silently on tabs that were already open before installing/updating
```

**Agent rule:** Before committing a release, move relevant items from `## [Unreleased]` to the new version section. Never edit released versions.

### 5.4 Chrome Web Store Publishing

**Prerequisites (human sets up once):**
- Google Cloud project with Chrome Web Store API enabled
- OAuth 2.0 client ID/secret stored as GitHub Secrets: `CWS_CLIENT_ID`, `CWS_CLIENT_SECRET`, `CWS_REFRESH_TOKEN`
- Extension ID `lelhnakechcmiefkfbmkfdkpdjjeapem` verified in dashboard

**Agent can automate upload** via `chrome-webstore-upload-cli` or GitHub Action `extends: chrome-webstore-upload` if secrets are configured. **Until then**, the agent:
1. Builds `.zip` → `.output/SuperScroll-<version>.zip`
2. Creates GitHub Release with zip attached
3. **Pauses and notifies human:** "Release vX.Y.Z ready. Zip at `.output/SuperScroll-X.Y.Z.zip`. Please upload to Chrome Web Store Dashboard."
4. Waits for human confirmation before marking ticket `done`.

---

## 6. Code Standards & Patterns

### 6.1 TypeScript

- `strict: true` — no `any`, no implicit any
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, mapped types, utility types
- All message types defined in both `content.ts` and `App.tsx` (DRY via shared `lib/messages.ts` **TODO**)

### 6.2 React

- Functional components only, hooks for state
- `useCallback` for message handlers (stable references)
- No inline styles — Tailwind classes only
- shadcn/ui components for all primitives (Button, Label, etc.)

### 6.3 Content Script (`entrypoints/content.ts`)

- **Single IIFE** via `defineContentScript({ main() { ... } })`
- No external imports (self-contained for WXT)
- Speed logic: `SPEED_PRESETS` array, `requestAnimationFrame` + high-speed `setInterval`
- Auto-pause events: `['wheel', 'touchstart', 'keydown', 'mousedown']` with `{ passive: true }`
- Message bus: `chrome.runtime.onMessage` with `return true` for async response
- Cleanup: `beforeunload` → `stopScrolling()`

### 6.4 Popup (`entrypoints/popup/App.tsx`)

- State: `speed`, `isScrolling`, `scrollDirection`, `currentSpeedName`, `unsupportedPage`
- `sendMessageToContentScript()` handles restricted URLs + auto-reinject via `chrome.scripting.executeScript`
- `EXTENSION_VERSION` read from `chrome.runtime.getManifest().version` (never hardcode)
- UI: 3-button grid (Up/Pause/Down) with gradient active states, status chip, speed dropdown

### 6.5 Styling

- Tailwind v4 + CSS variables (see `entrypoints/popup/index.css`)
- Dark mode via `.dark` class (handled by Chrome extension theme)
- shadcn/ui `cn()` utility for class merging
- Minimum touch target: `48x48px` (buttons use `h-16` = 64px)

### 6.6 Linting & Formatting

```bash
npm run lint   # biome lint . — must pass with 0 errors, 0 warnings
npm run format # biome format --write . — run before commit
```

**Pre-commit:** Not configured (Husky removed). Agent must run manually.

---

## 7. Testing Strategy

### 7.1 Test Matrix (Agent Must Cover)

| Dimension | Values |
|-----------|--------|
| **Pages** | Static article, infinite feed (Twitter/X, Reddit), YouTube, GitHub, PDF, SPA |
| **Speeds** | All 8 presets (verify visual difference) |
| **Directions** | Up, Down, Toggle |
| **Interactions** | Wheel, click, keydown, touch (mobile Chrome) |
| **States** | Fresh install, update (pre-existing tab), restricted URL, popup reopen |
| **Themes** | Light, Dark, System |
| **Browsers** | Chrome Stable (primary), Chrome Beta, Firefox (via `npm run build:firefox`) |

### 7.2 Automated Testing (Future)

Currently **no unit/integration tests**. Backlog item: add Vitest + Playwright for:
- Message protocol round-trip
- Speed calculation math
- Auto-pause event handling
- Popup state sync

Agent should **not** write tests for non-existent test infra unless human approves adding it.

---

## 8. Boundaries — When to Pause for Human

The agent **MUST STOP and request human input** for any of the following:

| Category | Examples |
|----------|----------|
| **Technology Shift** | Switch from WXT → Plasmo/Vite raw, React → Solid/Svelte, Tailwind → CSS Modules, Manifest V3 → V2 (impossible) |
| **Permission Changes** | Adding/removing `host_permissions`, `activeTab`, `scripting`, `storage`, new permissions |
| **Architecture Rewrite** | Moving logic to background service worker, adding Web Workers, Offscreen Documents, Side Panel API |
| **Monetization/Data** | Any analytics, telemetry, user accounts, cloud sync, payments, affiliate links |
| **Brand/Identity** | Name change, logo redesign, homepage URL change, store listing overhaul |
| **Legal/Compliance** | Privacy policy updates, GDPR/CCPA, new jurisdictions, trademark issues |
| **Breaking Changes** | Storage schema migration, message protocol v2, removing speed presets |
| **Security Incidents** | Vulnerability reports, malicious dependency, supply chain compromise |
| **Strategic Pivots** | Firefox-only, Safari/WebExtension, desktop app, mobile companion |

**Protocol:**
1. Agent detects boundary condition → creates a new GitHub Issue with `needs-human` label and full context
2. Agent **stops all autonomous work** on that thread
3. Human reviews, decides, updates the Issue with decision
4. Agent resumes only after human marks the Issue `approved` or `rejected`

---

## 9. Backlog Management (GitHub Issues — Single Source of Truth)

**No local markdown backlog.** All tickets live as GitHub Issues in `killerwolf/chrome-extension-infinite-scroll`. The agent reads, creates, and updates Issues via the `gh` CLI.

**Issue labels (agent-managed):**
| Label | Meaning |
|-------|---------|
| `agent-ready` | Ticket is ready for the agent to pick up |
| `agent-in-progress` | Agent is currently working on this ticket |
| `needs-human` | Agent hit a boundary (Section 8) and needs a decision |
| `bug` | Bug report |
| `feature` | Feature request |
| `tech-debt` | Refactoring, cleanup, CI |
| `p0` | Critical — crashes, data loss |
| `p1` | High priority |
| `p2` | Medium priority |
| `p3` | Nice to have |

**Agent responsibilities:**
- Scan GitHub Issues + Store Reviews → create new Issues with `agent-ready` label
- Prioritize: P0 bugs > P1 features > P2 tech debt > P3 nice-to-have
- Move **one** ticket from `agent-ready` → `agent-in-progress` at a time (WIP limit = 1)
- Update Issue labels in real-time as work progresses
- On completion: mark `agent-done`, add changelog entry, close linked Issue

**Ticket template (Issue body):**
```markdown
### [TICKET-042] Fix auto-pause on iOS touchstart
- **Type:** bug
- **Priority:** P0
- **Source:** Store review #234 ("doesn't pause on iPhone")
- **Status:** Ready
- **Plan:**
  1. Add `touchstart` to `PAUSE_EVENTS` with `{ passive: true }`
  2. Test on iOS Chrome / Safari WebView
  3. Bump patch version
- **Files:** `entrypoints/content.ts`
- **Version:** patch
```

---

## 10. Common Operations Reference

### 10.1 Commands Cheatsheet

```bash
# Development
npm run dev              # WXT dev server (Chrome)
npm run dev:firefox      # WXT dev server (Firefox)

# Build & Package
npm run build            # Production build → .output/chrome-mv3/
npm run build:firefox    # Firefox build → .output/firefox-mv3/
npm run zip              # Chrome .zip → .output/
npm run zip:firefox      # Firefox .zip → .output/

# Quality
npm run lint             # Biome lint (must pass)
npm run format           # Biome format --write
npm run compile          # tsc --noEmit (type check)

# Versioning
npm version patch|minor|major --no-git-tag-version  # Updates package.json only
# THEN manually sync wxt.config.ts manifest.version
```

### 10.2 Key Files to Modify for Common Tasks

| Task | Files |
|------|-------|
| Add speed preset | `entrypoints/content.ts` (SPEED_PRESETS), `entrypoints/popup/App.tsx` (SPEED_PRESETS) |
| Change keyboard shortcut | `entrypoints/content.ts` (keydown handler), `README.md`, `docs/STORE_LISTING.md` |
| Modify auto-pause events | `entrypoints/content.ts` (PAUSE_EVENTS array) |
| Update UI colors/theme | `entrypoints/popup/index.css` (CSS variables), `tailwind.config.js` |
| Add new permission | `wxt.config.ts` (manifest.permissions/host_permissions), `docs/STORE_LISTING.md` |
| Fix content script injection | `entrypoints/popup/App.tsx` (sendMessageToContentScript) |
| Update version | `package.json`, `wxt.config.ts`, `CHANGELOG.md` |

### 10.3 Debugging Tips

- **Content script console:** Open DevTools on the **page** (not popup) → Console
- **Popup console:** Right-click extension icon → "Inspect popup"
- **Background worker:** `chrome://extensions/` → Service worker "Inspect views"
- **Message logging:** Both sides log with `console.log` (prefix: `SuperScroll`)
- **Manifest inspection:** `.output/chrome-mv3/manifest.json` after build

---

## 11. Security & Privacy Invariants (Never Violate)

1. **No network requests** — extension makes zero `fetch`/`XMLHttpRequest` calls
2. **No analytics/telemetry** — no GA, no custom events, no error reporting services
3. **No external scripts** — all code bundled, no remote code execution
4. **Minimal permissions** — only `activeTab`, `scripting`, `host_permissions: <all_urls>`
5. **No persistent storage** — only in-memory state; `chrome.storage` unused
6. **Content Security Policy** — `script-src 'self'; object-src 'self'` (enforced by MV3)
7. **No user identification** — no fingerprinting, no unique IDs, no accounts

Any change that weakens these requires **human approval** (see Section 8).

---

## 12. Escalation & Communication

**Agent → Human notifications** (via GitHub Issues):
- Release ready for store upload (zip path + version)
- Boundary condition hit (Section 8) — work paused
- CI failure requiring infrastructure change (Node version, GitHub Actions secrets)
- Security vulnerability in dependency (`npm audit` high/critical)
- Chrome Web Store policy violation warning

**Human → Agent directives** (via new GitHub Issue with label `agent-directive`):
- "Pause all work"
- "Prioritize ticket X"
- "Revert version Y"
- "Update store listing with text Z"

---

## 14. Quick Start for New Agent Instance

```bash
# 1. Clone & setup
git clone https://github.com/killerwolf/chrome-extension-infinite-scroll.git
cd chrome-extension-infinite-scroll
npm ci

# 2. Verify baseline
npm run lint && npm run compile && npm run build

# 3. Load unpacked extension
#    Chrome → chrome://extensions/ → Developer mode → Load unpacked → .output/chrome-mv3/

# 4. Read context
cat AGENTS.md                    # This file
cat docs/ARCHITECTURE.md         # Technical deep-dive
cat docs/Issues.md               # Current work queue (GitHub Issues)
cat docs/STORE_LISTING.md        # Store copy
cat CHANGELOG.md                 # Release history
```

# 5. Start loop
#    Pick top "Ready" ticket from BACKLOG.md → Plan → Execute → Verify → Release
```

---

## 14. Appendix: Current State (Snapshot)

| Item | Value |
|------|-------|
| **Branch** | `copilot-probable-succotash` (worktree) |
| **Base** | `main` (744795c) |
| **Version** | `1.0.1` |
| **Open Issues** | Check `gh issue list --repo killerwolf/chrome-extension-infinite-scroll` |
| **Last Release** | `v1.0.1` (2026-09-14) — fix for pre-existing tabs |
| **Next Planned** | Per top GitHub Issue with `agent-ready` label |

---

**End of AGENTS.md** — This document is the agent's constitution. Modify only when the human explicitly directs a consequential change (Section 8). For routine improvements, follow the loop in Section 4.