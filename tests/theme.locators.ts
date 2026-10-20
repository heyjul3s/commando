import { THEME_SELECTORS } from './theme.selectors';
import { roleBy } from './utils';

import type { Page } from '@playwright/test';

export function getThemeLocators(page: Page) {
  const dialog = roleBy(page, THEME_SELECTORS.dialog);

  return {
    dialog,
    openPaletteButton: roleBy(page, THEME_SELECTORS.openPaletteButton),
    searchInput: roleBy(dialog, THEME_SELECTORS.searchInput),
    themeSelect: roleBy(page, THEME_SELECTORS.themeSelect),
    toggleDarkModeCommand: roleBy(dialog, THEME_SELECTORS.toggleDarkModeCommand),
  };
}
