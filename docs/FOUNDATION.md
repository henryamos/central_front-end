# Frontend foundation (FND-001)

## Objective and acceptance

As a contributor, I can add a public feature inside a predictable folder structure and run the same checks locally and in CI. Acceptance: public routes compile directly under src/app; all requested routes exist; unknown detail records return 404; app boundaries have loading/error/not-found states; lint, strict types, unit tests, production build and production smoke tests pass.

## Decisions

- User-requested single frontend structure takes precedence over the proposed future monorepo layout. Keep the existing front-end Git root, use package name ccc-sda-web, and defer backend/admin work.
- src/app owns public routes directly. The root layout owns HTML, global metadata, providers, skip link and main landmark. A route group is unnecessary for this single public-site app; introduce groups only if actual routes require different layouts. All route pages are Server Components by default.
- src/features owns domain UI, API adapters, validation, hooks and types. Until a feature has real behavior, route files render the shared empty state directly rather than adding pass-through feature components. Import public feature APIs when they exist; do not import another feature's internals. Shared hooks, types and constants must have genuinely shared consumers.
- src/components implements Container, Section, Heading/Text, Button, Input and FormField. See [COMPONENTS.md](COMPONENTS.md) for APIs, states and usage. The other requested folders remain reserved with .gitkeep until implementation is justified.
- Guest and sermon implementation folders are reserved with .gitkeep, rather than empty TypeScript modules. Add the proposed files only when implementing their behavior. No request contract, consent wording or backend endpoint is invented. Guest registration and planned visits remain separate. Guest mutations must not retry automatically or persist personal data in browser storage.
- Forms use React Hook Form with Zod and @hookform/resolvers when approved guest fields and API contracts are available. clsx and tailwind-merge are exposed through src/lib/utils.ts; lucide-react is available for approved icon usage.
- src/lib/api/client.ts supports same-origin versioned JSON reads, caller cancellation and a 10-second timeout. Every read requires a feature-owned Zod response schema. api-error.ts exposes sanitized HTTP, network, invalid-response and timeout errors without response bodies. Introduce write requests only alongside the agreed session/CSRF, validation and idempotency contracts.
- Root layout mounts QueryProvider directly. Add an app-wide composition provider only when multiple real contexts need composing. Each provider instance owns its QueryClient; no server singleton or persistent cache. Queries are fresh for 60 seconds and inactive data is collected after 5 minutes. Only known network/timeout/5xx failures retry once; 4xx, schema failures and unknown errors do not retry. Mutations never retry automatically. Server-rendered public content should use server fetch; Query is reserved for genuine interactive server state, with feature-owned keys.
- Vitest defaults to Node for plain logic tests. Component tests opt into jsdom with a file directive and import tests/setup.ts for Testing Library cleanup and jest-dom matchers. The React transform plugin handles TSX. The @ alias matches TypeScript. Vite is a development dependency of the test toolchain; next dev and next build remain the app commands. Async Server Components stay under Playwright coverage.
- MSW runs only when development explicitly enables NEXT_PUBLIC_API_MOCKING. MockProvider gates child rendering until the worker is ready; it loads the browser worker dynamically and fails closed if startup fails. The worker uses shared synthetic handlers; unrecognized API requests return 501 instead of reaching a real service. Network tests opt into the Node test server and its lifecycle. No real guest records or fabricated church content are mocked.
- Prettier loads prettier-plugin-tailwindcss against src/app/globals.css and sorts class lists, including clsx/cn calls.
- Tailwind and its PostCSS plugin are pinned to the same version to avoid duplicate Tailwind installations. Tailwind uses the standard PostCSS plugin. Speculative cache/prefetch switches and the initial Turbopack CSS loader are removed to keep the baseline simple.
- Figtree was approved on 23 November 2026. next/font/local self-hosts the normal variable font (300-900) with display: swap; its SIL license is retained under public/fonts. tokens.css owns the approved palette, type scale/weights/leading, spacing, radii, content width, motion durations and Tailwind breakpoints (40/48/64/80rem). See [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) for the single design and responsive contract. Gutters and section spacing follow the md/lg breakpoints; reduced-motion preferences zero the shared durations. Layout/component scales remain subject to design review before freezing.
- Scaffold pages show an honest unavailable-content state, with no forms or payment channels. Dynamic detail routes return 404 until they can resolve published data. They must check publication status before rendering future templates.
- robots disallows crawling, metadata is noindex/nofollow and sitemap is empty. This is not access control. Before launch, verify the canonical domain, publish approved content, enable intended indexing and populate sitemap from published records only.

## Ownership

| Folder             | Responsibility                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| app                | Routes, metadata and framework boundaries                                                            |
| features           | home, about, ministries, worship, sermons, events, guests, giving, gallery, blog, news, faq, contact |
| providers          | App-wide client contexts                                                                             |
| lib                | Transport and query infrastructure                                                                   |
| config / constants | Validated configuration / shared immutable values                                                    |
| styles             | Shared provisional design tokens                                                                     |
| mocks              | Synthetic MSW development handlers, browser worker and Node test server                              |
| public             | Approved brand, fonts, images and icons                                                              |
| tests/unit         | Pure logic, infrastructure and contract behavior                                                     |
| tests/e2e          | Production routing, landmarks, keyboard and responsive smoke coverage                                |

## Checks without duplicate configuration

CI calls pnpm check for the same formatting, lint, type and unit checks used locally, then builds and runs Playwright. HTTP routing/crawling checks run once; page/keyboard checks run at all three viewport sizes. ESLint handles code correctness; Prettier handles formatting, with eslint-config-prettier disabling conflicting lint rules. clsx handles conditional classes and tailwind-merge resolves utility conflicts; they have separate roles. Keep the user-requested form/icon packages ready for feature implementation rather than adding alternative libraries.

## Structure review and placement rules

The review covers src, public, tests and documentation. The remaining empty folders represent the requested project blueprint, not implemented functionality. Keep one implementation for each responsibility; populate folders as features require them.

| Area                               | Owns                                                                            | Avoid duplicating here                                                |
| ---------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| app/layout.tsx                     | HTML, body, global metadata, provider mounting, public shell and main landmark  | Feature business logic or duplicate providers                         |
| app page files                     | URL, route metadata and composition                                             | Copies of feature forms, API requests or validation                   |
| app loading/error/not-found        | Framework loading, recovery and missing-route boundaries                        | An abstract route factory that hides Next.js exports                  |
| components/ui                      | Domain-independent controls, typography and empty states                        | Guest forms, sermon cards or event-specific widgets                   |
| components/layout                  | Shared header, footer, navigation, container and section                        | Generic UI states or separate geometry definitions per page           |
| features/<domain>                  | Domain components, API adapters, hooks, schemas, types, constants and utilities | Parallel copies under root components/hooks/types                     |
| providers                          | React contexts and their lifecycle                                              | Fetching each feature's data or a second server-state store           |
| lib/api and lib/query              | One transport/error implementation and one query-client factory                 | Feature endpoint definitions and feature query keys                   |
| lib/utils.ts                       | Shared class composition helper                                                 | A general dumping ground for domain utilities                         |
| hooks and types                    | Hooks/types genuinely shared across unrelated features                          | Promotion of a feature-owned item just because it may be useful later |
| config                             | Environment-derived configuration and its validation                            | Domain enums or editable church content                               |
| constants                          | Truly shared immutable code values                                              | Environment settings or ministry/contact content                      |
| styles                             | Design tokens; globals.css imports them and applies global rules                | Repeated colors, spacing scales or layout widths inside features      |
| mocks                              | Shared test server and synthetic handlers                                       | Real guest data or enabled production interception                    |
| public/brand, fonts, images, icons | Official identity, fonts, photography, static icon assets                       | Copies of the same asset or exports already provided by lucide-react  |
| tests/unit and tests/e2e           | Logic/component behavior and browser journeys respectively                      | Testing the same HTTP behavior once per screen size                   |

Feature ownership follows the PRD: home composes published domain data; about owns history/beliefs/leadership; ministries owns ministry and music-group details; worship owns watch/service schedules; sermons owns recorded sermons; events owns events; guests owns planned visits and actual guest registration as distinct workflows; giving owns approved giving instructions; gallery owns albums; blog owns articles; news owns updates; faq owns questions; contact owns contact presentation. Home and contact must consume canonical church settings rather than introduce separate contact records. Blog/news and worship/sermons remain separate because their publication and data responsibilities differ.

The proposed guest files (guests.api.ts, guest-form.tsx, guest-success.tsx, use-register-guest.ts, guest.schema.ts, guest.types.ts, guest.constants.ts, guest.utils.ts) belong in their matching feature folders when behavior is implemented. Derive form types from Zod schemas rather than manually maintaining equivalent field definitions. Feature index.ts files should export a real public API only when consumers need it; internal modules import each other directly to avoid barrel cycles. Sermon API, hooks, queries and types follow the same rule. Query option builders own fetch functions and query keys; hooks consume those options rather than define them again.

Keep the short detail-route stubs in events, ministries and sermons separate. Each is a framework entry point that will resolve a different domain; extracting their temporary identical 404 behavior into a generic feature would add coupling. The same applies to the distinct error and missing-page states. Shared visual primitives should be extracted only when real component needs establish their API. The .site-container and .section rules remain the single geometry implementation consumed by Container and Section.

The design-system guide owns token usage and responsive/browser acceptance. The PRD owns product requirements, the architecture document owns the broader proposed system, the roadmap owns sequencing, this guide owns implemented frontend conventions, and README owns startup commands. Update the owning document and link to it instead of maintaining parallel specifications.

## Sprint 1 infrastructure

The package manager is pinned to pnpm@12.21.0. The requested install, type, lint, format and build baseline passed before infrastructure changes.

| Deliverable       | Implementation / verification                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Configuration     | Strict TypeScript, ESLint, Tailwind-aware Prettier and Husky; CI uses pnpm check                                                                                 |
| Query provider    | Mounted in root layout; integration tests exercise the real provider, fresh cache and manual refresh                                                             |
| HTTP client       | One apiGet helper and one ApiError class; response validation, HTTP/network errors, cancellation, timeout and empty responses tested                             |
| Environment       | src/config/env.ts validates explicit public variables with Zod; defaults mocks off, rejects invalid values and production mock activation without echoing values |
| MSW               | Node tests and development browser share handlers; /api/v1/_foundation/status is an explicitly synthetic infrastructure endpoint                                 |
| Typeface / tokens | Approved local Figtree, retained license, centralized palette/type/spacing/breakpoints/motion                                                                    |
| Tests             | Logic/component tests plus provider -> HTTP -> MSW integration tests; production routing and development worker tests are separate                               |
| Git hooks         | Pre-commit runs staged lint/format; commit-msg validates Conventional Commits; pre-push stops on failed types before running tests                               |
| CI                | Pull requests run frozen install, quality checks, build, production browser checks and opt-in development mock checks                                            |

For browser development, copy .env.example to .env.local and set NEXT_PUBLIC_API_MOCKING=enabled, then restart pnpm dev and open /dev/foundation. Mocking is off by default. The demo has loading, error/retry and success/refresh states. Its endpoint is intercepted by MSW, never implemented as a real backend route. The demo returns 404 in production and normal development with mocking disabled. Keep NEXT_PUBLIC_* values non-secret. Same-origin /api/v1 is intentional: no API hostname or speculative server environment settings are required yet.

Run pnpm test:e2e:dev to start a development server on port 3000 and verify browser interception, refresh, Figtree and shared component behaviour in all three engines. The normal pnpm test:e2e continues to use the production build and confirms the demo/endpoint are unavailable there. CI runs both sequentially. Service-worker files are generated vendor code; regenerate with pnpm exec msw init public --save after upgrading MSW.

Hook verification uses disposable local Git repositories rather than committing project work: invalid staged code must fail pre-commit, invalid messages must fail commit-msg, a formatted valid commit must succeed, and the actual pre-push hook must block a failing fixture check and allow a passing local-only push. Project quality checks are run separately against the real application.

## Scope and remaining gates

No backend/data migration or permissions change. No guest PII is collected. Approved content, accessible custom component states, visual regression references, guest consent/retention, API contracts, admin auth, deployment and staging remain future tickets. The static scaffold is not a launch-ready church website. The initial smoke tests are not a complete accessibility or visual audit.

When implementing a feature, use the ticket template in CCC-SDA-ROADMAP.md: objective/user story, scope, UI states, API/data impact, permissions, failure paths, accessibility, acceptance, tests and rollout/rollback. Preserve the approved docs rather than silently rewriting their broader architecture.

## Tooling references

The setup follows the official [Next.js testing guidance](https://nextjs.org/docs/app/guides/testing/vitest) and [Husky setup](https://typicode.github.io/husky/get-started.html). CI assumes this directory is the repository root, as it is today.
