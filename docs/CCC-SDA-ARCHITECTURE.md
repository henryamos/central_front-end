# CCC SDA — Technical Architecture (proposed)

Version 0.3 · 22 November 2026

## Architecture decision
Use a modular monolith, not microservices. Two Next.js applications (public site and administrative portal) and one NestJS API share a PostgreSQL database. Keep boundaries around business domains so modules are independently understandable, not independently deployed. Start with one API process; introduce a worker process when background workloads justify it.

### Proposed stack
Next.js App Router, React, TypeScript, TanStack Query, Tailwind CSS/design tokens; NestJS with its default Express adapter, Prisma, PostgreSQL; object storage for media. Redis/BullMQ are optional and excluded from the initial infrastructure until a genuine durable background processing requirement is identified. Use an email provider after church approval; SMS and payment provider integrations behind interfaces. Select supported versions and pin lockfile at implementation kickoff.

Decision: do not introduce Fastify or microservices. The default NestJS HTTP adapter is sufficient for this project's expected scope. Revisit infrastructure only if measured requirements justify the change.

### Repository layout
```text
apps/
  web/src/app/                # Route segments, server page composition
  web/src/features/           # Public features
  admin/src/app/              # Protected admin routes
  admin/src/features/         # Administrative features
  api/src/modules/            # Nest business modules
packages/
  ui/                         # Custom accessible foundational components
  design-tokens/              # CSS variables, type, spacing, breakpoints
  contracts/                  # Generated API types/client or portable DTO schemas
  config/                     # Shared lint, TypeScript, test settings
docs/                         # Requirements, decisions, feature specs
```
Monorepo tool (Nx or pnpm workspaces/Turborepo) remains a decision; use simplest approach that supports shared packages and CI. Do not share Prisma or server secrets with frontends.

### Feature-driven UI
Each feature owns its UI, data access and feature-specific validation. Routes compose features and do not contain business implementation. Promote a component to shared UI only when it is a genuine reusable primitive. Avoid speculative abstractions.
```text
features/guests/
  api/                         # Typed requests and query keys
  components/                  # GuestForm, GuestList, GuestDetails
  hooks/                       # Query/mutation orchestration
  schemas/                     # Client validation
  types/                       # Feature-specific types
  index.ts                     # Public feature API
```
Server Components by default for public SEO pages; use server fetch for initial public content and revalidation. TanStack Query for interactive administration, filtered collections, check-in mutations and client-side cache invalidation; do not fetch everything twice or put server state into global client stores. Query keys grouped by feature, stable filter inputs, targeted invalidation after mutations; never persist sensitive guest data in browser storage. Use client components for genuine interactivity only. Separate UI state from server state. Define loading, empty, error, retry, disabled and success states.

### Backend module pattern
```text
modules/guests/
  guests.module.ts
  presentation/               # Controllers, request/response DTOs
  application/                # Use cases, ports, authorization checks
  domain/                     # Invariants, entities/value objects where useful
  infrastructure/             # Prisma repositories, adapters
```
Apply pragmatic layered/vertical-slice architecture, not boilerplate-heavy DDD. CRUD modules can be simple controller/service/repository; complex workflows (guest merge, attendance, giving) use explicit use cases and transactions. Nest DI, dependency inversion for external providers, and domain events only when justified. Avoid CQRS infrastructure until demonstrated need. Never access other modules' internals directly; export explicit application-facing interfaces; centralize transactions for cross-module workflows.

Domains: auth, users, permissions, guests, visits, follow-ups, worship, sermons, events, ministries, content, media, giving, payments, notifications, analytics, audit. Auth, guests and content are P0; later modules can remain absent until needed.

### Content domain implementation
Use structured, typed content rather than a generic page builder or hardcoded editable information. A singleton ChurchSettings record owns verified information desk contacts (email, phone, Instagram, Facebook, TikTok, YouTube), location and approved public settings. A welcome/home content record owns editorial heading, body and media. Home queries derive latest published sermon and next published service/event from their respective domains; editors need not update duplicate copies manually. Define explicit ordering, publication filters, timezone and empty states.

Ministry records support nullable parent ID for Music and its Church Choir, Singing Band and Youth Choir children; seed the approved ministry inventory from the PRD without fabricated descriptions. Prevent parent cycles; use a shared detail template. Leadership records can link to ministries and have explicit display order. About/history/beliefs use typed editorial content; gallery uses albums and media references. Blog/news, FAQs and giving instructions have distinct typed records and authorization. Reuse publication lifecycle, slug validation and media management without building a separate microservice for every content type. Admin forms expose only fields appropriate to the content type; audit changes and invalidate public cache after successful publication.

### API standards
Versioned REST `/api/v1`; documented OpenAPI, generated typed client where practical. Standard pagination/filtering, machine-readable errors, request IDs, DTO validation and response serialization. Use correct HTTP methods/statuses. Public endpoints return only published fields. Enforce authorization in API, not just route guards in UI. Prefer same-origin proxy for browser API access to simplify cookie/CORS design; if cross-origin, explicitly allow trusted origins and credentials. Use secure HTTP-only session cookies, CSRF protection where applicable and token/session rotation; choose an auth solution before implementation. Require MFA for privileged staff if supported. No hardcoded secrets.

### Data design (conceptual)
- Guest: ID, contact details, normalized contact identifiers, creation/updated timestamps; consent stored separately.
- Service: occurrence timestamp, timezone Africa/Accra, status, schedule content.
- Visit: guest ID, service ID, check-in method/time, source officer, attendance status; unique constraint for one attendance per guest/service; planned visit separate entity/status and explicit conversion.
- FollowUp: guest ID, assignee, due date, status; attempts/outcomes separate and restricted; no unsolicited outreach.
- Consent: purpose, grant/revoke time, notice version, source; check current consent before contacting.
- Content: slug, lifecycle status, author, published/revision timestamps; media reference and visibility; structured sermon/event/ministry metadata.
- StaffUser, Role, Permission, RolePermission, UserRole, scoped assignment; audit events with actor, action, target and redacted metadata.
- Giving later: payment intent, designated fund, amount in minor currency units, status, provider reference, verified webhook event, receipt, reconciliation record. Never trust a client callback as settlement.

Use migration review; indexes for guest lookup, service/date history, follow-up queue and published slugs. Contact matching should flag potential duplicates without automatically merging different people sharing phones. Use transaction-safe idempotency for submission retry; audit manual merge and retain visit history. Store private records encrypted at rest and in transit; avoid PII in logs/caches. Set retention, deletion and export procedures with the church; do not assume consent is the only lawful basis or invent legal conclusions.

### Deployment / operations
Staging then production; Docker and Coolify are candidates based on existing skill set. CI: lint, types, tests, build, migration checks and visual regression approval. Separate environments, credentials and databases. Secrets manager/environment injection. Database backups plus tested restores, scheduled retention, minimal monitoring and alerts, health/readiness endpoints. Use optimized images, responsive srcsets, lazy media/YouTube embeds and cache public content; never cache private responses publicly. Rate limit public forms, spam mitigation, server validation, safe file uploads, access logs, structured redaction and security headers.

### Test strategy
Unit tests for business rules; integration tests with PostgreSQL for duplicate/check-in concurrency, consent, permission and transaction semantics; API contract tests; Playwright flows for guest/admin and content publication; visual regression at mobile/tablet/desktop. Accessibility keyboard, focus, contrast and screen reader checks. Target WCAG AA; proposed performance goals LCP ≤2.5s, CLS ≤0.1, INP ≤200ms at p75 when field data exists. Test throttled mobile on representative devices. Establish baseline and adjust targets with evidence.

### Release gates
No production secrets in code; authorization and privacy checks pass; backup restore rehearsed; forms verified end-to-end; approved content/assets; no placeholder details; visual review approved; incident and administrator training runbook prepared.
