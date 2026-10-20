import type { RoleSelector } from './utils';

export const THEME_SELECTORS = {
  dialog: {
    options: { name: 'Search Commands' },
    role: 'dialog',
  },
  openPaletteButton: {
    options: { name: /Open command menu/ },
    role: 'button',
  },
  searchInput: {
    options: { name: 'Search commands' },
    role: 'combobox',
  },
  themeSelect: {
    options: { name: 'Theme' },
    role: 'combobox',
  },
  toggleDarkModeCommand: {
    options: { name: 'Toggle Dark Mode' },
    role: 'option',
  },
} as const satisfies Record<string, RoleSelector>;
