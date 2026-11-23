# CCC SDA — Delivery Roadmap

Version 0.3 · sequence first, dates after estimates and stakeholder approval.

| Milestone | Work | Exit criteria |
|---|---|---|
| M0 Discovery and design | Confirm sitemap, brand, content owners, typography, visitor roles, consent, feature priorities; collect church-provided content using PRD checklist | Approved requirements, content ownership and responsive design direction |
| M1 Engineering foundation | Monorepo, Next.js apps, NestJS API (default Express adapter), PostgreSQL, design tokens, shared components, CI, staging; defer Redis/BullMQ until justified | Builds/tests pass; accessible component baseline; deployment reproducible |
| M2 Public site + CMS vertical slice | Navigation, welcome message, Join Us Next Sabbath, about/history/beliefs/leadership, information desk and verified social links, worship schedule; admin auth, permissions, content publishing | Admin publishing appears on public site; no developer needed for updates |
| M3 Guest management | QR, public guest form, plan visit, staff-assisted registration, directory, consent, assignment, follow-up, reporting | End-to-end guest flow tested with actual desk workflow; consent/security review completed |
| M4 Worship/community | Latest sermon and upcoming event on homepage, sermon library, livestream, events, all eight ministry areas and three music groups, FAQs, initial approved media | Core public journeys complete; ministry inventory and shared detail layout verified; content owners trained |
| M5 MVP launch | Content, accessibility, performance, security, restore test, mobile testing, UAT, rollout | Church approval; operational runbook and support owner |
| M6 Release 2 | Event registration, blog/news, bulletins, gallery, reminders, Bible studies, analytics, approved giving | Each feature gated by its owner and integration approvals |
| M7 Release 3 | Verified giving reconciliation, optional private prayer requests, personal accounts only if justified | Privacy/payment review; measurable benefit |

## First actionable backlog
1. Verify sitemap and route ownership; agree MVP vs later releases.
2. Validate the approved Figtree font with real content and the approved palette; review weights and responsive type scale.
3. Create component inventory, tokens, responsive grid, interaction states, Figma screens, visual test strategy.
4. Interview information desk and personal ministry officers; approve guest fields, check-in/follow-up workflow, consent and permissions.
5. Choose auth, database/storage hosting, workspace tooling and contracts approach; define ADRs.
6. Scaffold apps/packages, database migrations, CI and staging; implement primitive components.
7. Build one thin vertical slice: staff update next Sabbath schedule → public displays it. Validate architecture before expanding.
8. Implement guest registration and management end-to-end; test duplicate/retry/security cases.
9. Expand public content, worship, events and ministries against church content inventory; verify information desk links, leadership, each ministry/music group and homepage content; prepare migration and content collection.
10. Launch only after UAT, monitoring, backup restoration and training.

## Feature ticket template
ID / title; priority / milestone; objective / user story; scope and non-goals; user journey; UI states (loading, empty, error, success, permission denied); route/component ownership; API contract; data changes; permission and privacy; dependencies; acceptance criteria (given/when/then); unit/integration/E2E/visual tests; rollout/rollback; owner and status. Keep approved decisions recorded and revise backlog explicitly.

## Risks
Unapproved content or logo; insufficient authentic photography; inaccurate service information; guest data misuse; weak network conditions; limited admin training; scope creep into membership/financial ERP; premature integrations. Mitigate with content checklist, permissions/consent, mobile tests, staged delivery, clear ownership and change control.
