# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-11-19

### Changed

- Replaced 8-speed preset dropdown with custom speed slider (50-10,000 px/s, step 50) using shadcn/ui Slider
  - Speed value displayed directly (e.g., "1200 px/s")
  - Direct pixel values sent from popup to content script instead of preset indices
  - Default speed changed from 300 px/s preset to 300 px/s value

## [1.0.1] - 2026-09-14

### Fixed

- Scroll buttons no longer fail silently on tabs that were already open before
  installing or updating the extension. Chrome doesn't inject content scripts into
  pre-existing tabs, so clicking a control there previously did nothing; the popup
  now detects the failed connection and re-injects the content script automatically.
  This needed the new `scripting` permission.

## [1.0.0]

### Added

- Initial public release: auto-scroll with 8 speed presets (50 px/s to 10,000 px/s),
  keyboard shortcuts (Alt+S, Alt+↑, Alt+↓, Alt+P), and auto-pause on user interaction.
