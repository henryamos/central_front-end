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
- Test mobile/tablet/desktop, keyboard/focus, screen reader labels, contrast, touch targets, responsive text and reduced motion. Each reusable component documents variants/states; use visual regression snapshots and review diffs.

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
