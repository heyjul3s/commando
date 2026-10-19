import type { RoleSelector } from './utils';

export const APP_SELECTORS = {
  clearSearchButton: {
    options: {
      name: 'Clear search',
    },
    role: 'button',
  },

  closePaletteButton: {
    options: {
      name: 'Close command palette',
    },
    role: 'button',
  },

  commandOptions: {
    browseProjects: {
      options: {
        name: 'Browse Projects',
      },
      role: 'option',
    },
    openDashboard: {
      options: {
        name: 'Open Dashboard',
      },
      role: 'option',
    },
  },

  commands: {
    role: 'option',
  },

  dialog: {
    options: {
      name: 'Search Commands',
    },
    role: 'dialog',
  },

  openPalette: {
    options: {
      name: /Open command menu/,
    },
    role: 'button',
  },

  recentCommands: {
    options: {
      name: 'Recent commands',
    },
    role: 'region',
  },

  recentItems: {
    role: 'listitem',
  },

  searchInput: {
    options: {
      name: 'Search commands',
    },
    role: 'textbox',
  },

  selectedCommand: {
    options: {
      name: 'Selected command',
    },
    role: 'region',
  },
} as const satisfies Record<string, RoleSelector | Record<string, RoleSelector>>;
