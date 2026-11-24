# CCC SDA design tokens and responsive contract

Status: engineering baseline for the approved light theme. Palette is approved; DM Sans is the current typography preview. Component compositions and responsive screens still require design review. Source of truth: src/styles/tokens.css; globals.css applies base rules and shared layout classes.

## Colours

| Role                   | Token                                          | Value                 | Contrast                                                                     |
| ---------------------- | ---------------------------------------------- | --------------------- | ---------------------------------------------------------------------------- |
| SDA Denim              | --color-primary                                | #2F557F               | 7.70:1 on white; 7.06:1 on off-white                                         |
| Main surface           | --color-background                             | #FFFFFF               | White text is reserved for Denim surfaces                                    |
| Secondary surface      | --color-surface-muted                          | #F5F5F5               | Use for surface grouping, with an explicit control border where needed       |
| Main text              | --color-foreground                             | SDA Denim alias       | Blue-on-white direction; same contrast as primary                            |
| Text on Denim          | --color-primary-foreground                     | White alias           | Use for filled primary controls                                              |
| Primary hover / active | --color-primary-hover / --color-primary-active | #2C4E73 / #294666     | Darker Denim states, derived once from the approved primary and text colours |
| Supporting text        | --color-muted-foreground                       | #49617B               | Muted Denim that retains at least 4.5:1 on both light surfaces               |
| Decorative divider     | --color-border                                 | #DADADA               | For decorative separators, not the sole boundary of an input                 |
| Control boundary       | --color-border-control                         | #7F7F7F               | At least 3:1 on both surfaces                                                |
| Validation error       | --color-danger                                 | #B42318               | Semantic text/border feedback; at least 4.5:1 on both surfaces               |
| Focus                  | --color-focus / --color-focus-inverse          | Denim / white aliases | Choose the ring that contrasts with the surrounding surface                  |

Derived states are fixed sRGB values rather than runtime colour-mixing expressions. No competing decorative accent is introduced. Use semantic colour classes such as bg-primary, text-foreground, text-muted-foreground and border-border-control. The unrelated default Tailwind palette is removed. Add error/success colours only alongside a component requirement and contrast checks. Colour must be accompanied by text or another meaningful indicator.

Text pairs target at least 4.5:1; meaningful control boundaries target at least 3:1. These checks cover the token pairs, not a claim that a complete page passes every WCAG requirement. References: [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Public-site direction, 24 November 2026: keep headings and main text Denim blue on light surfaces, with muted Denim supporting text. Use white text on blue and photographic surfaces. Avoid black/blue split headings; the shared foreground tokens apply this consistently across components, navigation and footer. Near-black is retained for photo overlays, not marketing text.

## DM Sans and typography

DM Sans replaces the Hanken Grotesk trial for visual review. The normal variable DM Sans file is self-hosted through next/font/local at weights 100-1000 with display: swap. Use normal 400, medium 500, semibold 600 and bold 700; extrabold 800 and black 900 are available for prominent display headings. Keep body text and controls at their existing weights. All content and controls use the same font; official SDA logo typography remains separate. Font files, origin and the SIL license are under public/fonts.

| Token / utility | Size at a 16px root | Intended use                   |
| --------------- | ------------------- | ------------------------------ |
| text-xs         | 12px                | Short captions only            |
| text-sm         | 14px                | Supporting labels and metadata |
| text-base       | 16px                | Body text and form controls    |
| text-lg         | 18px                | Introductory text              |
| text-xl         | 20px                | Small headings                 |
| text-2xl        | 24px                | Subsection headings            |
| text-3xl        | 32px                | Section headings               |
| text-4xl        | 40px                | Large headings                 |
| text-5xl        | 48px                | Largest baseline size          |
| text-title      | Fluid 32-48px       | Page title                     |

Body leading is 1.6, UI leading 1.4 and heading leading 1.15. Size utilities have explicit matching line heights so Tailwind defaults cannot silently change the scale. Reading width is 65ch. font-sans resolves the locally loaded DM Sans variable. Do not shrink body or control text to make a layout fit. Long content wraps, and heading size remains usable when text is enlarged.

## Spacing, shape and motion

Spacing utilities and CSS share exactly 0 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px through --spacing-0/1/2/3/4/6/8/12/16/24. Example: p-4 and var(--spacing-4) both mean 16px. Use existing tokens instead of arbitrary one-off sizes. Radii are none (0), sm (4px), md (8px). Default framework shadow tokens are removed. Layout width is capped at 1280px.

Controls have a 48px minimum target in both dimensions. The shared focus width is 2px. Button and Input use a single inset focus treatment without an offset outer outline; error inputs keep the danger colour. Transparent outlines preserve forced-colours visibility. Unstyled controls and links retain the global 2px outline with a 4px offset as a fallback. Motion durations are --duration-fast (150ms) and --duration-normal (250ms), with ease-standard. Control transitions cover background, border and text colours; focus indicators change immediately without animating an old outline colour. Both durations become 0ms for reduced-motion preferences. Components must consume the duration variables rather than embed numeric transition durations.

## Responsive contract

CSS is mobile-first. The one breakpoint source is the Tailwind theme in tokens.css; do not maintain a second JavaScript breakpoint map or a parallel desktop/mobile content tree. CSS controls presentation. Use JavaScript media matching only when actual behaviour requires it, deriving the query from the existing token.

| Range at the default 16px initial font | Breakpoint  | Page gutter per side | Section padding per end |
| -------------------------------------- | ----------- | -------------------- | ----------------------- |
| Base, below 640px                      | Base styles | 16px                 | 48px                    |
| 640-767px                              | sm: 40rem   | 16px                 | 48px                    |
| 768-1023px                             | md: 48rem   | 24px                 | 64px                    |
| 1024-1279px                            | lg: 64rem   | 32px                 | 96px                    |
| 1280px and wider                       | xl: 80rem   | 32px                 | 96px                    |

The shared .site-container class is centered and uses available width minus the two gutters, up to 1280px. The .section class consumes the responsive section token. The class name deliberately avoids colliding with Tailwind's built-in container utility. All default rules are in the base layer, reusable layout classes in components, and utility overrides retain their intended precedence.

### Container edge discipline

The page gutter is owned once by .site-container. Do not nest .site-container inside another .site-container or add px-* padding to that same element. Internal card/form padding and column gaps belong to those components, not a second page gutter. Keep full-width section backgrounds outside the container; the section owns vertical spacing and its child container owns horizontal alignment. Header, main content and footer should use sibling containers with the same tokens.

At widths where the 1280px content cap is not reached, both content edges are exactly the gutter value. Above the cap, equal additional outer margins keep the content centered. At a 1440px available width this means 80px each side; at 1920px it means 320px each side. Those larger outer margins are the intended max-width behaviour, not stacked padding. Full-width media/backgrounds can remain outside this reading/layout frame.

Geometry checks use the browser's available layout width (documentElement.clientWidth), excluding the vertical scrollbar, rather than 100vw. Tests force a tall document, verify equal left/right gaps and inner content edges at every breakpoint edge, and reject nested containers across all public routes. Measured values are attached to each cross-browser layout test as container-measurements JSON.

Each new component or feature must meet these acceptance rules:

- Work from 320 CSS pixels upward, with no page-wide horizontal scrolling.
- Use only the shared breakpoint, spacing and typography tokens. Add a layout change where real content needs it; do not force every component to change at every breakpoint.
- Test phone, tablet, desktop, wide display, and both sides of a breakpoint used by that component.
- Test long headings, navigation labels, field errors and missing media. Flex/grid children must be able to shrink; images/media preserve aspect ratio and fit their container.
- Preserve meaningful source order and keyboard navigation. Responsive visibility must not remove the only way to perform an action.
- Provide accessible navigation collapse, dialog focus and table overflow behaviours when those components are implemented. Dense tables may scroll in a labelled region; the whole document must not scroll sideways.
- Keep targets at least 48px, controls at least 16px text, visible focus, and contrast appropriate to the actual background.
- Support 200% text enlargement, reduced motion and content wrapping. Use normal document flow; avoid fixed content heights and device/user-agent detection.
- Review each new flow in all three browser engines. This foundation test suite does not replace testing the real future header, forms and content pages or checking representative physical phones.

## Browser support and compilation

The current Next.js/Tailwind 4 setup targets the framework baseline of Chrome/Edge 111+, Safari/iOS Safari 16.4+ and Firefox 128+. See [Tailwind browser compatibility](https://tailwindcss.com/docs/compatibility). Support for older browsers is a separate architecture decision; do not claim it based on checks of current browser engines.

@theme, @layer and theme() authoring are processed by the existing build; Tailwind-only directives/functions must not leak into the served stylesheet. Our token values use fixed sRGB colours, CSS custom properties, rem/px/ch, clamp and media queries within the stated browser baseline. Check support before introducing new CSS features or browser APIs. Use progressive enhancement or an explicit fallback for optional features; essential content and controls must not depend on unsupported styling.

pnpm test:e2e runs token, contrast, motion and responsive checks in Chromium, Firefox and WebKit. The layout checks include 320, 375, 639, 640, 767, 768, 1023, 1024, 1279, 1280, 1440 and 1920px, plus 200% text enlargement and an unbroken long heading. These are current Playwright engine checks, not tests of every historical version or a substitute for real iOS/Android checks before launch.

## Using the tokens

Use Tailwind's semantic utilities for feature styling. In CSS, reference the exact same custom properties. Example utility names: bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active p-4 rounded-sm font-semibold text-base leading-ui. Semantic status tokens and component variants should be added through this file when a real use case establishes them.

The design values live in tokens.css, not a duplicate TypeScript theme object. globals.css owns resets and global/layout rules. Shared UI primitives compose those values and document their states without introducing separate palettes or spacing scales. See [COMPONENTS.md](COMPONENTS.md) for the implemented APIs, states and composition patterns.
