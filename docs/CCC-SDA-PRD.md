# Cape Coast Central SDA — Product Requirements

Version 0.5 · 23 November 2026 · Planning baseline

## Purpose
Build a distinctive, accessible church website and lightweight church administration platform that serves visitors, members, online worshippers and church officers. The project is also a portfolio-quality demonstration of product design and engineering. A successful launch must create operational value, not merely attractive pages.

## Decisions and boundaries
- Public website includes guest registration; no separate guest app or required account.
- Private administration portal manages guest data, content and operations. Public users cannot access administrative records.
- SDA Denim #2F557F (sea blue) is the approved sole primary brand colour, replacing Pine Green. Supporting neutrals: white #FFFFFF, off-white #F5F5F5 and near-black #171717. No competing brand accents, gradients, glassmorphism or generic template styling. Use accessible contrast for all text and interactive states.
- Figtree was approved by Benjamin on 23 November 2026. Self-host the website font; validate its weights and responsive type scale in the design system.
- Custom components and centrally enforced visual consistency are mandatory.
- Next.js, TypeScript and TanStack Query are selected frontend direction. NestJS modular monolith with the default Express adapter is the selected backend direction. Redis/BullMQ are optional and deferred until justified by actual background processing requirements.
- No public member accounts, payment processing or advanced automation required for the first release unless explicitly reprioritized by the church.

## Audience and outcomes
| Audience | Desired outcome |
|---|---|
| First-time visitor | Find worship time, location and what to expect; register quickly |
| Existing member | Discover ministries, events, bulletins and church updates |
| Online worshipper | Find live worship and recorded sermons |
| Information desk | Register guests and distinguish planned visits from attendance |
| Church officer | Manage assigned follow-ups and publish accurate content |
| Treasurer | Govern giving and reconciliation in a later release |

## Sitemap baseline
Source: [Designer FigJam sitemap](https://www.figma.com/board/dRmWUmV8SzzgHLV6BJotlt/CCC-SDA-Web-Site-map?node-id=0-1). The board was reviewed in the preceding planning session; route names below are proposals, not mandated by the board.

| Area | Proposed routes / content |
|---|---|
| Home | `/` — welcome page message, Join Us Next Sabbath, upcoming Sabbath schedule, latest sermon, upcoming event, ministries, guest registration |
| Visit | `/visit` — in-person attendance, schedule, directions, contact, plan a visit; `/guest` — physical visitor check-in |
| Worship | `/watch` — livestream or next service; `/sermons`, `/sermons/[slug]` — video, summary, copy/download |
| About | `/about` (Who We Are / Our Church), `/about/history`, `/about/leadership`, `/about/beliefs`, `/gallery` |
| Ministries | `/ministries`, `/ministries/[slug]` — Sabbath School/Bible Study, Music (church choir, singing band, youth choir), Adventist Youth, Children, Women, Men, Personal and Family Ministries |
| Events | `/events`, `/events/[slug]` — upcoming/all, detail, registration |
| Resources | `/news`, `/blog`, `/faq`, `/bulletins` — local news, international SDA links, articles, FAQs, programmes |
| Give | `/give` — tithe, offering, programme/ministry support, harvest, donations, approved payment channels |
| Contact | `/contact` — information desk, phone, email, directions, social channels |
| Account | `/account` — later; Google/manual signup, login, recovery only after tangible use case is approved |

Navigation proposal: About, Ministries, Sermons, Events, Resources, Give; primary action Plan a Visit. Guest check-in is a visible contextual link and QR destination. Include home via logo. Confirm exact menu labels with designer.

## Church-provided content requirements
Source: church web-page content list supplied by Benjamin. This supplements the FigJam sitemap; all listed content is in the product scope, even where the roadmap schedules it after MVP.

### Homepage content
- Welcome page message (heading, description, approved photographs).
- Join Us Next Sabbath, with distinct in-person visit and online worship actions.
- Upcoming Sabbath schedule, latest published sermon and upcoming event; each links to its detail or listing page.
- Guest registration link remains available independently of planned visits.

### Ministry inventory
| Ministry | Proposed slug / children |
|---|---|
| Sabbath School | `sabbath-school` |
| Music | `music` — Church Choir, Singing Band, Youth Choir |
| Adventist Youth Ministries (AYM) | `adventist-youth-ministries` |
| Children's Ministry | `childrens-ministry` |
| Adventist Women Ministry (AWM) | `adventist-women-ministry` |
| Adventist Men Ministry (AMM) | `adventist-men-ministry` |
| Personal Ministry | `personal-ministry` |
| Adventist Family Ministry | `adventist-family-ministry` |

Music groups may have individual detail pages using the same ministry template. Each published ministry/group should support overview, leadership, activities/programmes, meeting schedule, photographs and approved contact information. Omit optional sections until content is available.

### Content ownership and administration
| Content | Editable fields / responsibilities |
|---|---|
| Church Info Desk | Email, phone, Instagram, Facebook, TikTok, YouTube; all values pending verification |
| Welcome / Who We Are / Our Church | Heading, rich text, approved media, mission and vision if supplied |
| Sabbath schedule | Service date/time, programme, speaker and exceptions |
| Sermons | Title, speaker, date, video URL, summary, attachment |
| Events | Title, description, start/end, venue, media, registration settings |
| Ministries / groups | Name, slug, parent, overview, leaders, programme, schedule, media, public contact |
| Our leadership | Name, role, ministry, biography, portrait, display order |
| Our history / beliefs | Approved narrative, timeline if supplied, official SDA belief references |
| Gallery | Albums, images, captions, alt text and publication status |
| Give/donate | Treasurer-approved instructions and verified payment details |
| Blog / News | Title, slug, body, author, date, media, publication status; external news links distinguished |
| FAQs | Question, answer, display order, publication status |

### Content collection checklist (pending unless confirmed)
- [ ] Official logo and church name; approved welcome message and authentic photographs.
- [ ] Who we are, mission/vision, history and beliefs references.
- [ ] Worship times, upcoming programme, sermon and event content.
- [ ] Leadership profiles and content for every listed ministry/music group.
- [ ] Verified church location, information desk email/phone and all four listed social channels (Instagram, Facebook, TikTok, YouTube).
- [ ] Gallery assets and permission to publish identifiable people; approved FAQs, news and blog content.
- [ ] Treasurer-approved giving instructions; do not display unverified financial details.

## Feature requirements / backlog
P0 = launch critical; P1 = next release or after MVP stability; P2 = future/conditional. IDs are stable for tickets.

| ID | Priority | Requirement | Acceptance outcome |
|---|---|---|---|
| FND-001 | P0 | Shared design system and layout | Pages consume approved tokens/components; responsive visual review passes |
| PUB-001 | P0 | Homepage and navigation | Visitor quickly finds worship, directions and guest registration |
| PUB-002 | P0 | About, history, leaders, beliefs | Approved content and official SDA belief link available |
| PUB-003 | P0 | Contact, FAQ and location | Verified contact details and working map/directions links |
| WSH-001 | P0 | Sabbath schedule | Admin updates next service and exceptions without deployment |
| WSH-002 | P0 | Watch online | Live link shown only when verified/announced; offline state shows next service/latest recording |
| WSH-003 | P0 | Sermons | Published video, date, speaker and summary; playback fallback |
| WSH-004 | P1 | Summary copy/download and reminders | Accessible download/copy; opt-in reminder preferences |
| GST-001–012 | P0 | Guest lifecycle | See dedicated guest specification |
| MIN-001 | P0 | Ministry directory/details | Approved ministry descriptions, contacts and leaders editable |
| EVT-001 | P0 | Event listing/details | Upcoming and past events correctly distinguished |
| EVT-002 | P1 | Event registration | Guest can register without account; officer can export attendees |
| CMS-001 | P0 | Admin auth and permissions | Only authorized officers access scoped resources |
| CMS-002 | P0 | Content management | Draft/publish/archive; preview and audit recorded |
| CMS-003 | P0 | Media management | Validated upload, alt text, optimized delivery, private files protected |
| CMS-004 | P1 | News/blog/scheduled publishing | Editor can publish approved articles and local news; link to official international news |
| CMS-005 | P1 | Bulletin and gallery | Documents downloadable; approved photos filterable; Drive integration optional |
| GIV-001 | P1 | Approved bank/MoMo giving information | Verify ownership and display payment instructions; copy actions |
| GIV-002 | P1 | Online giving and receipts | Treasurer-approved provider; verified webhooks, reconciliation and privacy |
| ENG-001 | P1 | Bible study requests | Consent-aware routing to officer |
| ENG-002 | P2 | Private prayer requests | Restricted access and pastoral safeguarding approved |
| ACC-001 | P2 | Personal account | Justify benefit, then design Google/manual login and recovery |
| ANA-001 | P1 | Analytics and operational reporting | Aggregate attendance/content metrics without exposing guest PII |

## Administration
Modules: dashboard, guests, visits, follow-ups, worship, sermons, events, ministries, content, media, users/permissions, audit trail; giving added when approved. Proposed roles: super admin, church administrator, information desk, personal ministries officer, communications editor, ministry leader, treasurer. Use backend-enforced permissions and scoped assignments, not role names alone. Treasurer must not automatically access guest records; ministry leaders only their assigned areas.

## Guest requirements (flagship MVP)
| ID | Requirement |
|---|---|
| GST-001 | Public `/guest` form, mobile first, no authentication |
| GST-002 | Printed QR opens canonical HTTPS guest route; maintain printable fallback URL |
| GST-003 | `/visit` planned Sabbath attendance; distinct from actual check-in |
| GST-004 | Information desk assisted registration with officer attribution |
| GST-005 | Authorized guest directory and search/filter |
| GST-006 | Guest profile, attendance history and planned visits |
| GST-007 | Duplicate detection with normalized contact values and manual merge review |
| GST-008 | Assign follow-up to authorized officer |
| GST-009 | Follow-up status/history and contact attempts |
| GST-010 | Aggregate guest and returning visitor counts, scoped by service/date |
| GST-011 | Permission-gated reporting/export with audit and minimized columns |
| GST-012 | Contact consent, notice, preference changes and retention policy |

### Guest journey
Scan QR → open form → submit details → confirmation → admin queue → assignment → follow-up → record outcome. Assisted registration is an alternative entry point. Planned visit can later link to check-in but must never count as attendance until confirmed.

Proposed fields: full name, phone (required unless church approves alternative contact), optional email and area of residence, first-time/returning preference, optional Bible study interest, separate explicit permission to follow up. Avoid sensitive free-text or collecting unnecessary personal data. No account or marketing consent requirement. Confirm form wording, retention and access policy with church leadership before launch.

Acceptance: usable at 320px width; accessible labels/errors; retry does not create duplicate attendance; authorized admin finds submission promptly; opt-out prevents further outreach; returning attendance creates a visit, not a new person; expired or unavailable service context fails gracefully; no personal data in analytics or public URLs.

## Success measures
Measure task completion, mobile speed, registration success, duplicate rate, follow-up completion, content freshness and administrator ability to publish without developers. Establish targets with stakeholders after baseline measurement; proposed performance targets in architecture document.

## Open decisions
Church leadership: name/domain/logo, verified contact details, worship times, official media channel, content ownership, guest consent/retention, ministry names, officer roster, approval workflow, giving policy, payment account and receipts. Designer: sitemap/menu, typeface and responsive layouts. Engineering: hosting budget, storage, auth strategy, email/SMS cost, backup retention. Do not invent data or publish placeholder contact/financial details as real.
