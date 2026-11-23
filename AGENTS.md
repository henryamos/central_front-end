# CCC SDA — Engineering and design rules

Scope: entire repository. Follow the PRD, architecture and approved design system. Do not introduce features outside an approved ticket or change approved UI direction without review.

## Design non-negotiables
- One approved brand accent: SDA Denim (sea blue) #2F557F, replacing the previous Pine Green; neutral white #FFFFFF, off-white #F5F5F5, near-black #171717. No additional decorative accents. Semantic error/success colors only when accessible and necessary. Use the shared primary colour token, never legacy Pine Green or hardcoded competing brand colours.
- Typeface: Figtree, approved by Benjamin on 23 November 2026. Self-host the website font; official SDA logo typography remains separate.
- No gradients, glassmorphism, floating decorative shapes, excessive shadows, excessive rounded cards, arbitrary badges, generic AI layouts or unnecessary motion.
- Prefer editorial composition, authentic photography, strong hierarchy, generous whitespace, sharp/simple surfaces and carefully aligned typography.
- Use design tokens for all spacing, color, typography, radius and motion; no ad hoc hardcoded styles in features. Provisional spacing scale 4/8/12/16/24/32/48/64/96px; radii 0/4/8px; content max 1280px; section spacing 48px mobile / 96px desktop. Validate with designer before freezing.
- Build custom React components with accessible semantic markup or headless primitives. No adopting default component library appearance. Shared Button, Link, Input, Select, Textarea, FormField, Dialog, Section, Container, Typography, Navigation, Footer; feature-specific patterns remain inside features until justified.
- Consistency does not mean every section is a card. Choose appropriate composition while preserving shared system. Admin uses same tokens but denser operational layout.
- Follow docs/DESIGN-SYSTEM.md for responsive and browser acceptance. Test from 320px upward, breakpoint edges, 200% text enlargement, long content, Chromium/Firefox/WebKit, keyboard/focus, screen reader labels, contrast, touch targets and reduced motion. Each reusable component documents variants/states; use visual regression snapshots and review diffs.

## Design system and responsive contract
- Treat `src/styles/tokens.css` as the single source of design values and `docs/DESIGN-SYSTEM.md` as the usage and acceptance contract. CSS and Tailwind must consume the same tokens. Do not create parallel theme objects, breakpoint maps, palettes or component-specific spacing scales.
- Use self-hosted Figtree through `next/font/local`, with the shared 400/500/600/700 weights and typography tokens. Body and form-control text starts at 16px; headings use the fluid type scale. Do not shrink text to conceal layout problems or add another website font.
- Use semantic colour tokens for text, surfaces, borders, hover, active and focus states. Derive necessary states from the approved palette; do not restore unrelated Tailwind colours. Verify text contrast of at least 4.5:1 and meaningful control boundaries of at least 3:1 against their actual backgrounds. Never communicate state through colour alone.
- Build mobile-first with the shared sm/md/lg/xl breakpoints. The current minimum page gutters are 16/24/32px for phone/tablet/desktop, with a centered 1280px maximum content width. Keep both edges equal; larger equal margins above the content cap are intentional. Review actual compositions before changing these values.
- Give horizontal page spacing one owner: `.site-container`. Never nest page containers or add another layer of horizontal padding to the same container. Sections own vertical spacing; full-width backgrounds sit outside the content frame. Align header, main and footer through sibling containers using the same tokens.
- Verify container geometry against available layout width, including pages with vertical scrollbars. Avoid `100vw` for ordinary content frames, fixed content heights, user-agent layout detection and page-wide horizontal scrolling. Test long content, breakpoint edges and 200% text enlargement; preserve source order and usable navigation.
- Keep interactive targets at least 48px in both dimensions, provide visible focus and consume shared motion durations so reduced-motion preferences are respected. Future primitives and features must pass their own responsive and accessibility checks; foundation tests alone do not establish their quality.
- Check browser support before adding CSS features or browser APIs. Use a fallback or progressive enhancement for optional capabilities. Verify emitted CSS rather than expecting browsers to interpret Tailwind authoring directives. Test Chromium, Firefox and WebKit against the documented browser baseline; do not claim historical-version or physical-device coverage without evidence.
- Put global defaults in the CSS base layer and reusable layout styles in the components layer so intentional utility overrides work. Avoid collisions with framework utility names and avoid hiding overflow to conceal broken spacing.

## Engineering
- Feature-driven frontend; routes compose features; Server Components default on public pages. TanStack Query for genuine client server-state needs; feature-owned keys/mutations; no duplicate global server-state store.
- NestJS modular monolith with the default Express adapter; clear feature modules, explicit interfaces and transactions. Do not introduce Fastify, speculative microservices or heavy architecture. Redis/BullMQ are deferred until a concrete background processing requirement is approved.
- Validate inputs at API boundaries, enforce backend permissions, redact PII, protect uploads, use idempotent writes and audited administrative mutations. Never trust client payment state or store secrets in frontend bundles.
- TypeScript strict mode; avoid `any`, duplication and circular imports; use clear names. Keep changes scoped and preserve existing code. Write tests for changed behavior.
- Use the church-provided content inventory in the PRD as the scope baseline. Keep all editorial content, information desk contacts and social links editable through authorized admin features; never invent missing values. All ministries and music groups use the shared ministry detail template, with content-driven optional sections. Derive homepage schedule, latest sermon and upcoming event from published domain records rather than duplicating data.
- Every feature requires objective, user story, UI states, API/data impact, permissions, failure paths, accessibility and acceptance criteria. Document decisions and migrations. Do not fake integrations, production content, metrics or test outcomes.

## Definition of done
Feature acceptance criteria pass; tests, lint/typecheck/build pass; UI uses approved tokens/variants; responsive, accessible and visual reviews pass; permission/privacy edge cases verified; documentation updated. If any requirement is incomplete, report it rather than claiming completion.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
