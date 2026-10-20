# Commando

A command palette showcase built with React, TypeScript, Vite, and Zustand. Search a command catalogue, navigate with the keyboard, and see your selection and recent history in a responsive workspace preview.

## Features

- Open with `Cmd+K` / `Ctrl+K`, navigate with arrow keys, and select with Enter.
- Search by command label or group, with clear-search and empty-result states.
- Keyboard focus management and an inert background while the palette is open.
- Recent command history saved between visits.
- Light, Dark, and System themes with a saved preference.
- Storybook component previews, interaction tests, and documentation.

Commands are demo selections; they update the workspace rather than execute the named action. The Theme select controls the actual appearance.

## Getting started

Requires Node.js `24.15.0` and pnpm `11.0.9`.

```sh
nvm use
corepack enable
pnpm install
pnpm dev
```

Vite serves the app at `http://localhost:5173` by default.

To explore the components and their documentation:

```sh
pnpm storybook
```

Storybook runs at `http://localhost:6006`.

## Checks

Install browser dependencies before running tests:

```sh
pnpm exec playwright install
```

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `pnpm lint`            | Lint, formatting, and application type checks |
| `pnpm test --run`      | Unit and Storybook browser tests              |
| `pnpm test:playwright` | App tests in Chromium, Firefox, and WebKit    |
| `pnpm build`           | Production app build                          |
| `pnpm build-storybook` | Static Storybook build                        |

Component behaviour and implementation details are documented in Storybook.
