---
name: Architectural Precision
colors:
  surface: '#f7fafc'
  surface-dim: '#d7dadc'
  surface-bright: '#f7fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f6'
  surface-container: '#ebeef0'
  surface-container-high: '#e5e9eb'
  surface-container-highest: '#e0e3e5'
  on-surface: '#181c1e'
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eef1f3'
  outline: '#76777c'
  outline-variant: '#c6c6cc'
  surface-tint: '#585e6c'
  primary: '#030813'
  on-primary: '#ffffff'
  primary-container: '#1a202c'
  on-primary-container: '#828796'
  inverse-primary: '#c1c6d7'
  secondary: '#1960a3'
  on-secondary: '#ffffff'
  secondary-container: '#7db6ff'
  on-secondary-container: '#00477f'
  tertiary: '#060808'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e2020'
  on-tertiary-container: '#868788'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde2f3'
  primary-fixed-dim: '#c1c6d7'
  on-primary-fixed: '#161c27'
  on-primary-fixed-variant: '#414754'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a2c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004881'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f7fafc'
  on-background: '#181c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  caption:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 128px
  container-max: 1200px
  gutter: 32px
  margin-mobile: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is engineered for an IT Architect portfolio, prioritizing structural integrity, technical authority, and executive-level clarity. The aesthetic is a refined **Minimalism** that draws inspiration from premium editorial design and high-end architectural documentation. 

The emotional response should be one of "effortless complexity"—the interface feels simple and intuitive despite the depth of technical expertise it showcases. Layouts are characterized by generous white space, a strictly enforced grid, and a lack of decorative flourish. Every element serves a functional purpose, reflecting the precision of a systems architect.

## Colors
The palette is rooted in a high-contrast foundation of Deep Slate and White to ensure maximum legibility and a sense of "ink-on-paper" authority.

- **Primary (Deep Slate):** Used for typography, iconography, and structural borders. It conveys stability and technical depth.
- **Secondary (Accent Blue):** Reserved strictly for interactive elements, highlights, and status indicators. It provides a professional "technical blueprint" feel.
- **Backgrounds:** Primary surfaces use White (#FFFFFF). Section transitions and container backgrounds use the Light Gray (#F7FAFC) to create a subtle rhythm of depth without the need for heavy shadows.

## Typography
This design system utilizes **Inter** for all primary communication to maintain a contemporary, systematic appearance. A secondary font, **JetBrains Mono**, is introduced for metadata, labels, and technical specifications to underscore the architectural nature of the work.

Large display headings use tight letter-spacing and heavy weights to command attention in hero sections. Body text maintains a generous line height (1.5x - 1.6x) to ensure long-form architectural case studies remain readable and approachable. All "Label Caps" should be rendered in uppercase with increased tracking for a technical, blueprint-like aesthetic.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy. On desktop, content is contained within a 1200px centered wrapper using a 12-column system. 

- **Vertical Rhythm:** A strict 8px base unit drives all spacing. 
- **Sectioning:** Large vertical gaps (128px) are used to distinguish different project phases or portfolio sections, allowing the content to breathe.
- **Responsive Behavior:** On tablet, the grid transitions to 8 columns with 24px gutters. On mobile, it shifts to a single-column stack with 24px side margins. 
- **Alignment:** Use hard-left alignment for all typography to reinforce the sense of a structured document.

## Elevation & Depth
In line with the minimalist aesthetic, this design system avoids traditional drop shadows. Depth is created through **Tonal Layering** and **Low-contrast Outlines**.

- **Surfaces:** Use the Light Gray (#F7FAFC) to lift secondary containers (like code blocks or technical specs) from the White background.
- **Borders:** Subtle 1px solid borders in the Neutral tone are preferred over shadows for defining card boundaries or input fields.
- **Glassmorphism:** Navigation bars may use a light background blur (20px) with 90% opacity white to maintain context while scrolling through dense content.

## Shapes
The shape language is **Soft (0.25rem)**. This provides a subtle "finished" feel to the interface without leaning into the playfulness of fully rounded corners. 

- **Interactive Elements:** Buttons and input fields use a 4px corner radius.
- **Media:** Project thumbnails and images should also follow the 4px radius to maintain a consistent silhouette across the grid.
- **Dividers:** Use horizontal rules (1px) in a light neutral shade to separate content blocks, echoing the look of architectural drawings.

## Components

- **Project Cards:** A 3-column grid on desktop. Images use a grayscale-to-color transition on hover. Headlines appear below the image in `headline-sm`, followed by a `label-caps` category.
- **Primary Buttons:** Deep Slate (#1A202C) background with White text. No shadows. On hover, the background transitions to Accent Blue (#2B6CB0).
- **Secondary Buttons:** Ghost style. 1px Deep Slate border with Slate text.
- **Hero Sections:** Left-aligned `display` typography with a maximum width of 800px. Accent Blue is used for key phrase highlights or "Available for Hire" indicators.
- **Dividers:** Minimalist 1px lines. For major sections, dividers may include a small `label-caps` tag on the left side (e.g., "SECTION 01 // OVERVIEW").
- **Technical Lists:** Lists of technologies or stacks should use the `label-caps` style inside small, square-edged chips with a #F7FAFC background.
- **Navigation:** A clean, top-aligned bar with text-only links. Use Accent Blue for the active state underline (2px height).