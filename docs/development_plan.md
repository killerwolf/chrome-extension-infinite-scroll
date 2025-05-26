# Development Plan: SuperScroll Chrome Extension

## 1. Introduction

This document outlines the technical plan for developing the SuperScroll Chrome Extension. It builds upon the existing `prd.md`, `report.md`, `tasks.md`, and `technical_plan.md` to provide a comprehensive guide for the development team.

## 2. Project Setup & Core Technologies

- **Framework**: WXT (Web Extension TypeScript Framework)
- **UI**: React with TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn/ui
- **Testing**: Node.js `node:test` module for unit/integration tests, Playwright for E2E tests.
- **Code Quality**: Biome (linting, formatting) and Prettier (formatting, if Biome doesn't cover all needs or for specific file types).
- **Version Control**: Git
- **CI/CD**: GitLab CI

## 3. Development Phases & Milestones

This plan aligns with the PRD's phased rollout (MVP, Intermediate, Advanced).

### Phase 1: MVP (Target: 2-3 months)

**Goal**: Deliver a reliable and intuitive auto-scroll extension, addressing core issues of existing solutions.

**Key Tasks**:

1.  **Project Initialization & Basic Structure (WXT) - Done in `extension-source`**
    *   [x] Initialize WXT project with TypeScript. (Status: Done, project created in `extension-source` directory)
    *   [x] Set up basic manifest file (`manifest.json`) for a Chrome extension. (Status: Done, WXT default generated, viewable in `extension-source/.output/chrome-mv3/manifest.json` after build, configured via `wxt.config.ts`)
    *   [x] Configure entry points: popup, content script, background service worker. (Status: Done, WXT default entrypoints created in `extension-source/entrypoints`)
    *   [x] **Configure Manifest Details (Next Step):** (Status: Done)
        *   In `extension-source/wxt.config.ts`, updated the `manifest` property to include:
            *   Essential fields: `name` (SuperScroll), `version` (0.1.0), `description`, and defined paths to existing `icons` (`public/icon/16.png`, `32.png`, `48.png`, `128.png`).
            *   `permissions`: Added `"storage"`, `"activeTab"`, `"scripting"`.
            *   `host_permissions`: Set to `["<all_urls>"]`.
        *   Adjusted content script match patterns in `extension-source/entrypoints/content.ts` to `matches: ['<all_urls>']`.
2.  **UI Implementation (React, Tailwind, Shadcn/ui)**
    *   [ ] Design and implement the main popup UI (controls for speed, direction, start/stop).
        *   Leverage Shadcn/ui components (Slider, Button, Switch).
    *   [ ] Implement a simple onboarding flow/tutorial for first-time users (refer to `prd.md` 2.3.1).
    *   [ ] Ensure basic responsiveness of the popup.
3.  **Core Scrolling Logic (Content Script)**
    *   [ ] Implement basic scrolling functionality (up/down at a user-defined speed).
    *   [ ] Ensure smooth scrolling, avoiding jitter.
    *   [ ] Implement pause/resume functionality.
    *   [ ] Basic error handling for content script injection and execution.
4.  **State Management**
    *   [ ] Manage extension state (e.g., current speed, direction, active status) using WXT's storage or a simple state management solution (e.g., Zustand or React Context if complexity grows).
    *   [ ] Persist user settings (e.g., default speed).
5.  **Essential UX Features**
    *   [ ] Implement basic keyboard shortcuts (e.g., toggle scroll, increase/decrease speed) (refer to `prd.md` 2.1.3).
    *   [ ] Implement intelligent pause on user interaction (e.g., mouse wheel scroll, click) (refer to `prd.md` 2.3.2).
6.  **Testing & Quality**
    *   [x] Set up Biome for code formatting and linting. (Status: Done)
    *   [x] Resolved initial linting errors in existing boilerplate code. (Status: Done)
    *   [x] Configure Git hooks (using Husky) to run Biome (formatter & linter) pre-commit. (Status: Done)
    *   [ ] Write initial unit tests for core scrolling logic and utility functions using `node:test` (including mocks for Chrome APIs as needed).
    *   [ ] Set up basic E2E tests with Playwright for main popup interactions and scrolling on a simple test page.
7.  **Documentation**
    *   [ ] Start `CONTRIBUTING.md` with setup instructions.
    *   [ ] Document initial component architecture using Mermaid diagrams in a new `architecture.md` or update `technical_plan.md`.
    *   [ ] Create a basic `README.md` with project overview and installation steps.
8.  **Build & CI/CD (GitLab CI - Initial Setup)**
    *   [ ] Create a basic `.gitlab-ci.yml` file.
    *   [ ] Implement a build stage that packages the extension (WXT build).
    *   [ ] Implement a linting/formatting check stage.
    *   [ ] Implement a test stage to run unit tests.

### Phase 2: Intermediate Version (Target: 3-4 months after MVP)

**Goal**: Introduce advanced features to differentiate SuperScroll.

**Key Tasks**:

1.  **Advanced Content Handling**
    *   [ ] Implement robust detection and handling of dynamically loaded content (e.g., infinite scroll on social media, YouTube comments) (refer to `prd.md` 2.2.1, `report.md` - Kieran Brown's feedback).
        *   This will likely involve advanced DOM mutation observation and heuristics.
    *   [ ] Research and implement strategies for handling iframes (where possible and permitted by security policies).
2.  **Enhanced UI & UX**
    *   [ ] Implement pre-set scrolling modes (e.g., "Article Reading", "Manga/Comics", "Teleprompter") (refer to `prd.md` 2.2.2).
    *   [ ] Design and implement the advanced settings panel (refer to `prd.md` 3.1.2).
    *   [ ] Implement customizable keyboard shortcuts.
    *   [ ] Implement optional page overlay controls (refer to `prd.md` 3.1.3).
    *   [ ] Implement dark/light theme support using Shadcn/ui theming capabilities.
3.  **Multi-Tab Functionality**
    *   [ ] Allow scrolling to continue in an inactive tab (optional, with clear user consent and visual indicator) (refer to `prd.md` 2.2.3, `user_reviews.md` - Sunshine Guimary's feedback).
4.  **Feedback Mechanism**
    *   [ ] Integrate a simple in-extension feedback form (refer to `prd.md` 2.3.3, `report.md` 5.1.4).
5.  **Performance Optimization**
    *   [ ] Conduct performance audit and optimize resource usage (CPU, memory) (refer to `prd.md` 3.2.2, `technical_plan.md` - Audit task).
    *   [ ] Implement throttling mechanisms if needed.
6.  **Testing & CI/CD**
    *   [ ] Expand E2E test suite to cover new features and dynamic content scenarios.
    *   [ ] Add more unit and integration tests.
    *   [ ] Enhance GitLab CI pipeline: add E2E test stage, consider security scanning (e.g., SAST).
7.  **Documentation**
    *   [ ] Update architecture diagrams and technical documentation.
    *   [ ] Create a user guide/FAQ based on MVP feedback and new features.

### Phase 3: Advanced Version (Target: 4-6 months after Intermediate)

**Goal**: Establish SuperScroll as the ultimate scrolling tool with innovative features.

**Key Tasks**:

1.  **Advanced Customization**
    *   [ ] Implement customizable exclusion zones (allow users to define areas on a page where scrolling is disabled) (refer to `prd.md` 2.2.4).
2.  **User Engagement & Data**
    *   [ ] Implement personal usage statistics (time saved, most scrolled sites, etc., with user consent and local storage) (refer to `prd.md` 2.3.4).
    *   [ ] Consider options for settings synchronization (e.g., using Chrome's sync storage, if feasible and secure).
3.  **Developer Extensibility**
    *   [ ] Design and document a simple API for other extensions to interact with SuperScroll (e.g., programmatically start/stop scrolling) (refer to `prd.md` 6.3).
4.  **AI-Powered Features (Experimental)**
    *   [ ] Research and prototype AI-driven speed adaptation based on content type or user reading pace (long-term goal, may require external services or advanced local models if feasible).
5.  **Testing & CI/CD**
    *   [ ] Comprehensive E2E testing for all features.
    *   [ ] Mature CI/CD pipeline with automated deployment steps (e.g., to Chrome Web Store beta channel).
6.  **Documentation**
    *   [ ] Full API documentation for developers.
    *   [ ] Complete user manual and advanced troubleshooting guide.

## 4. Technical Considerations & Best Practices

*   **SOLID Principles**: Apply SOLID principles in TypeScript/React code for maintainability and scalability.
*   **Modularity**: Design components and services to be modular and reusable.
*   **Error Handling**: Implement comprehensive error handling and logging (consider a lightweight remote logging solution for opted-in users in later phases).
*   **Security**: Follow Chrome extension security best practices. Minimize permissions requested. Sanitize any user inputs if applicable.
*   **Performance**: Continuously monitor and optimize performance. Use `requestAnimationFrame` for scrolling. Be mindful of DOM manipulations.
*   **Accessibility (a11y)**: Ensure UI components are accessible (ARIA attributes, keyboard navigation). Adhere to WCAG guidelines (refer to `prd.md` 3.2.3).
*   **Code Reviews**: Enforce mandatory code reviews for all changes.
*   **Git Workflow**: Use a consistent Git branching model (e.g., GitFlow or GitHub Flow).

## 5. Documentation Strategy

*   **User-Facing Documentation**:
    *   In-app onboarding and tooltips.
    *   FAQ and User Guide (potentially hosted on a simple static site or GitHub Pages).
*   **Developer/Contributor Documentation (in `/docs`)**:
    *   `README.md`: Project overview, setup, quick start.
    *   `CONTRIBUTING.md`: Contribution guidelines, code style, testing procedures.
    *   `architecture.md` (or updated `technical_plan.md`): Detailed technical architecture, component diagrams (Mermaid), data flow.
    *   `decisions.md`: Architectural Decision Records (ADRs) for significant technical choices.
    *   API documentation (if applicable in Phase 3).

## 6. Initial `technical_plan.md` Recovery and Integration

The existing `/Volumes/Work/git/chrome-extension-infinite-scroll/docs/technical_plan.md` provides a good starting skeleton. This `development_plan.md` expands on it. We should:

1.  **Merge relevant checklist items**: Transfer incomplete items from `technical_plan.md` into this document's phased tasks.
2.  **Integrate Mermaid diagrams**: The component and CI/CD diagrams from `technical_plan.md` should be reviewed and potentially moved/updated within `architecture.md` or a dedicated section here.
3.  **Context7 Consultation**: The note about Context7 for advanced architecture schemas is acknowledged. This can be leveraged during Phase 2 or 3 when designing more complex interactions or AI features.

## 7. Next Steps for the Developer

1.  **Familiarize**: Thoroughly read this plan, `prd.md`, `report.md`, and `user_reviews.md`.
2.  **Setup**: Begin with Phase 1, Task 1: Project Initialization with WXT.
3.  **Clarify**: Ask any questions before diving deep into implementation.
4.  **Iterate**: Follow the tasks sequentially within each phase, providing regular updates and seeking feedback.

This plan is a living document and will be updated as the project progresses and new insights are gained.