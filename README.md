# CCC SDA Web

Public website foundation for Cape Coast Central SDA. The existing folder is named front-end; the package is ccc-sda-web.

## Start

Use Node.js 24 and pnpm 12.21.0 as pinned in package.json (Corepack or pnpm's package-manager version management).

1. Run pnpm install --frozen-lockfile.
2. Copy .env.example to .env.local only if configuration is needed. No secret or API connection is required for the foundation.
3. Run pnpm dev and open http://localhost:3000.

On Windows PowerShell with restricted script execution, use pnpm.cmd instead of pnpm. Installation configures Husky automatically; run pnpm prepare if hooks need reinstalling.

## Commands

| Command                         | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| pnpm dev                        | Development server                                       |
| pnpm build                      | Production build                                         |
| pnpm start                      | Serve the production build                               |
| pnpm lint                       | ESLint                                                   |
| pnpm typecheck                  | Generate route types and check strict TypeScript         |
| pnpm format / pnpm format:check | Write / check formatting                                 |
| pnpm test / pnpm test:watch     | Unit tests / watch                                       |
| pnpm check                      | Formatting, lint, types, unit tests                      |
| pnpm test:e2e                   | Production smoke tests; build and install Chromium first |

For E2E, run pnpm exec playwright install chromium firefox webkit, pnpm build, then pnpm test:e2e. The production test server uses port 3200; that port must be free. CI installs Chromium with system dependencies.

See [the design system](docs/DESIGN-SYSTEM.md) for approved colours, DM Sans, token usage, responsive rules and browser support.

## Component reference

Run pnpm dev and open http://localhost:3000/dev/components for the shared primitive reference. It demonstrates local interactions and validation only. See [COMPONENTS.md](docs/COMPONENTS.md) for APIs and usage. Run pnpm test:e2e:dev to check the component reference across Chromium, Firefox and WebKit plus the mock request example.

## Public site shell

The shared responsive header, navigation and footer now compose every route. See [PUBLIC-SHELL.md](docs/PUBLIC-SHELL.md) for ownership, keyboard behaviour and acceptance. Primary visitor links keep planned visits and guest check-in separate.

## Development mock check

The approved font is self-hosted DM Sans. No font provider connection is required.

To exercise Query -> shared HTTP client -> MSW in the browser:

1. Copy .env.example to .env.local and set NEXT_PUBLIC_API_MOCKING=enabled.
2. Start pnpm dev (restart after environment changes).
3. Open http://localhost:3000/dev/foundation and use Refresh request.

Mocking defaults off and production builds reject enabling it. The demo route returns 404 in production. Its synthetic endpoint is not a real church API. Use pnpm test:e2e:dev to verify browser interception automatically on a development server at port 3000. Production smoke checks still use pnpm test:e2e after building. Details and ownership are in docs/FOUNDATION.md.

## Structure and rules

Read AGENTS.md, docs/CCC-SDA-PRD.md, docs/CCC-SDA-ARCHITECTURE.md and docs/CCC-SDA-ROADMAP.md before feature work. See [the foundation guide](docs/FOUNDATION.md) for folder ownership, scope and remaining work.

The local branch is main. No remote was configured during foundation setup. Commit messages follow Conventional Commits, for example feat(guests): add approved registration form. Hooks run staged lint/format checks, commit-message validation, then types and unit tests before pushing. CI also builds and runs desktop, tablet and mobile smoke tests.

The public homepage, responsive navigation and shared UI are implemented. See [HOMEPAGE.md](docs/HOMEPAGE.md) for the photo carousel and content boundaries. Verified production content, guest forms, backend integrations, remaining primitives and final editorial approval remain future work. The infrastructure mock demonstrates the transport/provider stack. Indexing is disabled until publication is approved.
