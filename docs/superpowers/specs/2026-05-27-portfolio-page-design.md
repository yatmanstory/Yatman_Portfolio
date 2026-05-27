# Portfolio Page Design

Date: 2026-05-27
Status: Approved for implementation planning

## Goal

Build a simple GitHub Pages-ready portfolio page for Jaehyuk Song that presents him as an AI PoC Builder who structures real operational problems and uses AI Coding Agents to implement and validate working LLM prototypes.

The page should be simple, professional, and easy to deploy. It should extend the existing `index.html` mockup rather than replace it from scratch.

## Source Materials

- `ai_coding_agent_portfolio_strategy.md`: positioning, project order, project copy, and implementation-note language.
- `DESIGN.md`: Architectural Precision design system.
- `index.html`: existing Tailwind-based mockup to extend.
- `DashBoard_Project/`: screenshots for the call-center KPI dashboard project.
- `Card_Chat/`: screenshots for the hybrid RAG card recommendation project.
- `CrewAI_Project/`: screenshots for the Multi-Agent SaaS prototype project.
- `Obsidian_Orchestration/`: screenshots for the in-progress Obsidian orchestration project.

## Brand And Positioning

Use this brand text in the navigation and footer:

```text
Jaehyuk Song // AI PoC Builder
```

Primary portfolio message:

```text
현장의 문제를 구조화하고, AI Coding Agent를 활용해 검증 가능한 LLM 프로토타입으로 구현합니다.
```

The page should be transparent about AI Coding Agent usage. It should not imply that all code was handwritten manually. It should frame the user's role as problem definition, product flow design, data flow design, implementation prompting, testing, debugging direction, validation, and documentation.

## Visual Direction

Follow the `DESIGN.md` "Architectural Precision" system:

- Light-only interface.
- No dark theme support.
- White and light gray surfaces.
- Deep slate typography.
- Accent blue only for active links, section labels, and interactive highlights.
- Inter for primary text.
- JetBrains Mono for labels, metadata, and technical chips.
- Strict 1200px centered grid.
- Generous spacing.
- Thin borders and tonal layering instead of heavy shadows.
- Small radii around 4px.
- Hard-left alignment for body and headings.

The page must not include dark-mode toggles, `dark:` Tailwind variants, or runtime theme switching. Some screenshots may contain dark UI, especially Obsidian screenshots, but the site shell itself must remain bright.

## Page Architecture

Implement as a single `index.html` file suitable for GitHub Pages.

Use the existing `index.html` as the base and extend it. Do not introduce a separate build system, framework, router, or package setup.

Main sections:

1. Sticky navigation
   - Brand: `Jaehyuk Song // AI PoC Builder`
   - Text links to page sections.
   - Primary action such as contact or GitHub.

2. Hero
   - Use the primary message.
   - Keep the existing left-aligned architectural layout.
   - Mention AI Coding Agent-assisted development clearly.
   - Keep the page light-only.

3. Selected Projects
   - Four project cards in the strategy-defined order.
   - Cards use real local screenshots as thumbnails.
   - Cards use grayscale-to-color hover if it remains legible.
   - Each card opens the project detail modal.

4. Working Method / Process
   - Short explanation of how projects were built:
     problem definition, flow design, data design, implementation prompting, testing, debugging direction, documentation.

5. Stack / Implementation Note
   - Show practical technologies as label chips.
   - Include a concise AI Coding Agent implementation note.

6. Footer
   - Repeat the brand.
   - Include external links only when real URLs are available. Omit placeholder-only links.

## Project Order And Content

Use this order:

1. 고객센터 KPI 모니터링·업무 자동화 웹 앱
   - Category: `OPERATIONS / DASHBOARD`
   - Position as the strongest real-world operational project.
   - Use screenshots from `DashBoard_Project/`.

2. 하이브리드 RAG 카드 추천 시스템
   - Category: `RAG / RECOMMENDATION`
   - Use screenshots from `Card_Chat/`.
   - Emphasize hybrid retrieval, card-benefit chunking, metadata search, reranking, and evaluation.

3. CrewAI 기반 Multi-Agent SaaS Wrapper
   - Category: `MULTI-AGENT / BUILDER`
   - Use screenshots from `CrewAI_Project/`.
   - Describe it as a SaaS-type prototype, not a finished commercial SaaS.

4. Obsidian AI Wiki / Orchestration
   - Category: `AGENTIC DOCS / IN PROGRESS`
   - Use screenshots from `Obsidian_Orchestration/`.
   - Present as an in-progress experiment, but not as a placeholder.
   - Emphasize context management, execution contracts, document governance, and AI Coding Agent workflow stability.

## Project Card Behavior

Cards should be clickable and keyboard-accessible.

Each card should show:

- Screenshot thumbnail.
- Category label.
- Project title.
- One concise summary sentence.
- A visual affordance that it opens a case study.

Hover should be restrained and consistent with `DESIGN.md`: border change, grayscale-to-color image transition, or accent-blue label treatment. Avoid playful animation.

## Modal Detail Behavior

Use one reusable modal component in the single HTML file. Clicking a project card populates the modal with that project's data.

Modal sections:

1. Project title and category.
2. One-line summary.
3. Problem.
4. My role.
5. Core implementation.
6. Results or learning.
7. Limits and improvements.
8. Screenshot gallery.

Modal controls:

- Close button.
- Escape key closes the modal.
- Clicking the overlay outside the modal closes it.
- Focus moves into the modal when opened and returns to the triggering card when closed.
- Modal content must be scrollable on small screens.

Gallery behavior:

- Show local project images.
- Use a large preview image with selectable thumbnails below it.
- Image alt text should describe the project and screen purpose.
- If an image fails to load, the layout should remain intact and alt text should still be meaningful.

## Responsive Behavior

Desktop:

- Preserve the 1200px max-width grid.
- Use four project cards in one row on wide desktop viewports.
- Keep generous vertical spacing.

Tablet:

- Collapse cards to two columns.
- Modal should use most of the viewport width.

Mobile:

- Single-column layout.
- Hero heading must not overflow.
- Buttons and nav links must not overlap.
- Modal should be full-width or nearly full-width with safe margins.
- Project screenshots should preserve aspect ratio and avoid horizontal scrolling.

## Testing And Verification

Follow the local AGENTS.md TDD guidance during implementation.

Test plan:

1. Happy Path:
   - Clicking each project card opens the correct modal content and screenshot gallery.

2. Edge Cases:
   - Modal closes correctly through close button, Escape key, and overlay click.
   - Mobile viewport keeps text, buttons, cards, modal, and images from overlapping.
   - All four projects, including Obsidian, display local images without broken paths in normal local preview.

3. Failure Path:
   - If an image fails to load, the modal and card layout remain usable and the image alt/fallback area does not collapse the page.

Verification should include:

- Static local preview in a browser.
- Desktop and mobile viewport inspection.
- Manual click-through of all four project modals.
- Confirm the page does not render with a black background.
- Confirm there are no unintended dark-theme classes or runtime theme toggles.

## Non-Goals

- No React, Vite, or other build system.
- No separate detail pages.
- No dark theme.
- No CMS or remote data loading.
- No exaggerated claims about commercial SaaS readiness.
- No unrelated refactor of the visual design system.

## Open Decisions Resolved

- Deployment structure: single-file-centered static GitHub Pages page.
- Detail behavior: modal case study.
- Brand: `Jaehyuk Song // AI PoC Builder`.
- Visual system: preserve `DESIGN.md` and current `index.html` direction.
- Dark theme: unsupported and intentionally excluded.
- Obsidian: use the newly added real images and mark it as in-progress.
