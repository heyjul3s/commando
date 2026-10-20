# Commando

Commando is a command palette showcase built with React, TypeScript, Vite, and Zustand. Search a fixed command catalogue, select a result with the keyboard or mouse, and view the selection and recent history in a workspace preview.

## Using the palette

- Open it with the workspace button or `Cmd+K` / `Ctrl+K`.
- Search by command label or group. Matching ignores case and surrounding whitespace.
- Navigate results with ArrowUp and ArrowDown, then select with Enter.
- Clear the query with the search-field clear control; the palette stays open and focus returns to the input.
- Dismiss with Escape, the header close button, or the backdrop. Closing resets the query and highlight.
- View the last selected command and up to six recent selections. Selecting an existing entry moves it to the front without duplication.
- Clear recent history without changing the selected command.

Command labels are examples: selection updates the demo rather than executing the named action. This includes “Toggle Dark Mode”; change the actual appearance through the header's Theme select. Recent command IDs and the theme preference persist in local storage; the current command selection resets on a fresh app load.

While the palette is open, `focus-trap-react` keeps keyboard focus inside the dialog and is configured to return focus when it closes. The workspace container is marked `inert`, preventing background interaction and removing it from screen-reader navigation. The palette sits outside that container.

## Requirements and setup

- Node.js `24.15.0`, specified in `.nvmrc`
- pnpm `11.0.9`, pinned in `package.json`

```sh
nvm use
corepack enable
corepack pnpm --version
pnpm install
```

Install the browsers needed by Storybook tests and the app's Playwright suite:

```sh
pnpm exec playwright install
```

On CI or Linux systems that also need browser system dependencies:

```sh
pnpm exec playwright install --with-deps
```

## Development

```sh
pnpm dev
```

Vite prints the app URL, usually `http://localhost:5173/`.

```sh
pnpm storybook
```

Storybook runs at `http://localhost:6006/`. Components have colocated visual states, interaction stories, fixtures, and MDX documentation. Story fixtures isolate store state and use in-memory persistence when history is involved.

## Project structure

```text
src/
  app/                       Application composition, providers, and global shortcut
    theme/                   Theme provider, preference utilities, and tests
      hooks/                 System appearance, preference sync, and document theme
  features/
    command-palette/
      components/            Dialog, search bar, and available commands
      store/                 Palette state and actions
      utils/                 Filtering and grouping
    workspace-preview/
      components/            Workspace, header, sidebar, and recent commands
      store/                 Selection, recent history, and persistence
  shared/
    constants/               Command catalogue, keys, events, and storage names
    store/                   Shared Zustand selector helper
    utils/                   Shared utilities
  docs/                      Cross-cutting Storybook documentation
  styles.css                 Shared styles and theme tokens
.storybook/                  Storybook configuration and preview styles
tests/                      Playwright app scenarios, selectors, locators, and utilities
```

Components render UI; colocated hooks own subscriptions and handlers. Feature stores manage shared state. Stories live in each component's `stories/` directory. Styles use CSS modules and shared tokens.

The app and Storybook preview both import `src/styles.css`, which loads the installed `browserux.css` package before the project's styles. Vite bundles the stylesheet locally; no runtime CDN request is needed. The package version is recorded in `pnpm-lock.yaml`. Both production builds use esbuild for CSS minification because the default Lightning CSS minifier rejects BrowserUX 5's `::search-text:current` selector. Its reset sets the root font size to 10px, so `1.4rem` normally renders as 14px. Keep that scale in mind when adjusting typography. Light and dark tokens are defined in `styles.css`.

## Theming

The workspace header offers Light, Dark, and System. A missing or invalid saved preference defaults to System, which follows operating system appearance changes. Explicit Light or Dark preferences stay fixed until changed.

The startup script in `index.html` applies the saved or system appearance before React loads to avoid a theme flash. `ThemeProvider` in `src/app/theme` manages the preference, persists changes under `cmd-palette-theme`, and applies the resolved theme to `<html data-theme>`. Its hooks handle system appearance changes, externally supplied preferences, and document updates.

Light tokens are scoped to `:root` and `[data-theme='light']`; dark tokens use `[data-theme='dark']`. Explicit theme attributes support nested light and dark previews. Storybook's theme toolbar uses the same provider with persistence disabled, so it does not change the app's saved preference. The Design Tokens docs show both themes independently of the document's appearance.

## Testing

| Layer                   | Coverage                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| Unit tests              | Store actions, filtering utilities, hooks, and supporting logic in `src/**/*.test.*`                           |
| Storybook browser tests | Component states and interactions, plus composed palette and workspace flows                                   |
| Playwright app tests    | App flows, hover and keyboard selection, empty results, background inertness, history persistence, and theming |

Storybook tests run in Chromium through Vitest's browser provider. Accessibility violations fail story tests. Some interaction fixtures expose clearly separated test readouts when an isolated component's outcome is otherwise invisible. Passing these checks does not replace manual keyboard, screen-reader, or visual review.

Run both configured Vitest projects once:

```sh
pnpm test --run
```

Run only Storybook tests:

```sh
pnpm exec vitest run --project storybook
```

Run unit tests without the Storybook project:

```sh
pnpm exec vitest run --project '!storybook'
```

App scenarios live in `tests/app.spec.ts`; theme selection, persistence, system appearance changes, and demo commands preserving appearance are covered by `tests/theme.spec.ts`. Each spec has dedicated selectors and locators, using the shared `roleBy` utility. Full app interaction coverage lives in Playwright rather than a JSDOM `app.test.tsx`, so it exercises real browser behaviour without a focus-trap mock.

Playwright runs the scenarios in Chromium, Firefox, and WebKit:

```sh
pnpm test:playwright
pnpm test:playwright-ui
```

To run one browser:

```sh
pnpm exec playwright test tests/app.spec.ts tests/theme.spec.ts --project=chromium
```

Playwright starts Vite at `http://127.0.0.1:5173`. Local runs can reuse an existing server; CI starts a fresh one. The GitHub Actions workflow currently runs the Playwright suite and uploads its HTML report. It does not yet run the complete lint, build, and Vitest checks.

## Checks and builds

| Command                 | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `pnpm lint`             | CSS, source, markup, formatting, and application TypeScript checks |
| `pnpm lint:fix`         | Run the configured automatic lint and formatting fixes             |
| `pnpm build`            | Type-check application source and build to `dist/`                 |
| `pnpm preview`          | Serve the production build locally                                 |
| `pnpm build-storybook`  | Build static Storybook to `storybook-static/`                      |
| `pnpm generate:stories` | Generate story scaffolding with Plop                               |

The current application TypeScript configuration includes `src/`; it does not include the root tool configs or `tests/`.

Husky runs lint-staged before commits, using Corepack and the Node version in `.nvmrc`. Lint-staged hides unstaged changes in partially staged files, so stage fixes before retrying a failed commit.
