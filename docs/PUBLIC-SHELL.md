# Public site shell (PUB-001, stage 1)

## Objective and user story

As a visitor, I can move between church information, worship, events and visitor journeys from any public route. This stage implements the header, navigation, footer and shared action links. It follows the navigation proposal in CCC-SDA-PRD.md. The initial homepage is described in HOMEPAGE.md; verified CMS delivery remains a separate stage.

## Scope and ownership

- Root app/layout.tsx composes Header, one main landmark and Footer, retaining the skip link, providers and local font. Body layout keeps the footer after the content; no route group or second main is introduced.
- components/layout/header and footer own the public shell. navigation/navigation.ts owns route labels used by both surfaces; it contains no contact, social, service or payment values.
- SiteIdentity uses the supplied complete CCC SDA SVG wordmark and links home. Its church name is already drawn into the logo, so no adjacent church-name text or separator is rendered. Blue appears on solid headers and white on the homepage photo; the accessible local home-link name remains. The footer uses the same blue SVG without a second caption. The portable artwork contains vector paths, replacing the supplied file's missing local PNG reference and unbundled font with outlines from the official Advent Sans SPD font. Asset attribution is retained in public/icons/CCC-SDA-LOGO-NOTICE.txt.
- SiteNavigation owns mobile disclosure state and the desktop Resources disclosure. NavigationLink uses exact aria-current=page and visually identifies parent route sections. Route segment matching avoids false matches such as /aboutness.
- ButtonLink is a real next/link anchor. It shares button.styles.ts with Button, including pointer/focus states; it does not accept disabled or loading props. No nested button/anchor, extra styling library or global menu provider.

## Responsive and interaction behaviour

Phone refinement (updated 27 November 2026): below sm the sticky header uses a solid white surface and a 224px wide complete SVG wordmark; the normal row remains 72px high and grows naturally for enlarged text. From sm the mark is 320px wide. Footer branding is at most 320px wide and clamps to available space. The trigger opens the shared Dialog in its fullscreen variant, with a brief slide-in animation, a persistent close button and an independently scrolling navigation area. The page behind it is inert and scroll-locked, so opening the menu never pushes or scrolls the hero, weekly guide or church section. Donate remains available inside the overlay beside Plan a Visit. Reduced motion shows the overlay without animation. From sm upward the closed header is transparent only at the homepage top and becomes solid immediately on scroll.

The header uses the shared xl breakpoint for its full desktop navigation. Below that the menu covers the viewport through a native modal dialog. Focus stays inside it, including the Ministries and Resources summaries; Escape, its close button and following a route dismiss it and restore focus appropriately. Resizing to desktop closes the overlay and restores scrolling. ResizeObserver watches CSS visibility of the trigger rather than maintaining another breakpoint map in JavaScript.

Desktop Resources uses native details/summary and ordinary navigation links, without application-menu roles or unnecessary arrow-key behaviour. Enter/Space toggles it; ArrowDown opens and focuses its first link consistently with Safari keyboard preferences; Tab follows the browser's normal link-focus behaviour; Escape closes and returns focus; outside actions dismiss. Resources links also appear in the footer. The mobile menu needs hydration; all destinations remain available through server-rendered footer links if scripts fail.

Header, main and footer use sibling Containers with equal gutters. No nested page containers. The header wraps when text is enlarged; footers use two columns on small screens and three from sm. All visible interactive targets remain at least 48px. Navigation text starts at 16px; the identity's supporting line is supplementary 14px text. Controls retain the shared inset focus treatment and motion preferences. A sticky header with white navigation is transparent over the homepage hero and becomes solid white with dark navigation over later sections; other routes use the solid surface. No glass or backdrop blur is applied. Solid white dropdown/mobile panels preserve contrast. The rebuilt footer uses a white surface with Denim typography, an enlarged church identity, one shared Plan a Visit action and grouped navigation. A compact Denim closing strip holds the utility links. No glass or decorative effects are needed.

## States, data and permissions

States: current route/section, expanded/collapsed mobile navigation, open/closed Resources, keyboard focus and pointer feedback. Static navigation has no request/loading/error state; existing route loading/error/not-found boundaries remain authoritative. Public routes still show honest unavailable-content states where editorial content is pending.

No new API, data migration, authentication, personal data collection, form submission, payment handling, external service or dependency. Existing Give, Contact and other routes retain their unavailable-content states. The supplied official logo is integrated; approved welcome copy, authentic images, worship times, location, social channels and giving details still require church verification. Links do not imply those features are launch-ready. No invented contacts or service times are published. Crawling remains disabled.

## Acceptance and verification

- Given a phone/tablet viewport, opening Menu exposes primary, visitor and resource links; Escape and navigation close it correctly.
- Given desktop navigation, Resources works with keyboard, pointer and outside dismissal; Plan a Visit and Guest check-in reach distinct routes.
- Given route navigation, current page is announced accurately and parent sections remain visually identifiable.
- At 320px through 1920px, shared gutters remain symmetric, no nested containers or horizontal page scrolling, including 200% text enlargement and breakpoint edges.
- Exactly one banner, main and contentinfo landmark. The skip link reaches main before header links. Existing route and primitive checks remain passing.
- Production Playwright runs navigation journeys in Chromium, Firefox and WebKit; logic tests cover route matching. Rendered desktop and mobile reviews check spacing, hierarchy, menu states and console errors. These checks do not claim a physical-device or screen-reader audit.

Rollout: local implementation only; no deployment or indexing change. Rollback: remove the shell composition from root layout or revert this stage, retaining the committed primitive foundation. The navigation proposal and final editorial design remain subject to church/design review before publication.

## Footer composition revision

Logo-led refinement (25 November 2026): remove the redundant footer Plan a Visit button. The official Denim logo and a smaller, single-line 20px church name share one accessible home link. Remove the duplicated Seventh-day Adventist Church caption, which is already part of the logo. Navigation and the closing utility strip retain their existing layout and destinations.

The screenshot review identified an oversized action rail, an underfilled middle column and excessive visual weight in the all-blue surface. The revision removes the rail and uses a white main surface with the church identity and shared Plan a Visit button on the left. Navigation keeps Watch and Donate in the relevant groups, balancing the columns. The information desk, guest check-in and copyright sit in a compact Denim strip. No slogans, invented contacts or social links are added.

The main layout stacks below lg; navigation uses two columns on phones and three from sm. Shared containers own gutters; all link targets remain at least 48px. Natural height and wrapping support enlarged text. Keyboard focus uses the shared focus colors on each surface.

Validation: scoped formatting, ESLint and TypeScript checks. The earlier all-blue version passed a production build. The browser host remains unavailable, so the latest revision has not received a rendered browser review.
