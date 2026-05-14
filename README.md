# Commando

Commando is a React + TypeScript command palette showcase built with Vite. It focuses on a single polished UI component experience: searchable commands, keyboard navigation, recently triggered commands, local persistence, and a token-based CSS theme setup.

## Requirements

- Node.js `24.15.0`
- pnpm via Corepack

```sh
corepack enable
corepack pnpm --version
```

## Run Locally

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Vite will print the local URL, usually:

```txt
http://localhost:5173/
```

## Useful Scripts

```sh
pnpm build
pnpm test
pnpm lint
pnpm preview
```

## Notes

This repo uses CSS modules, BEM-style class names, Vitest for hook tests, Playwright for browser tests, and local storage for recent command persistence.
