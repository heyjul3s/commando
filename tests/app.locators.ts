import { APP_SELECTORS } from './app.selectors';
import { roleBy } from './utils';

import type { Page } from '@playwright/test';

type CommandName = keyof typeof APP_SELECTORS.commandOptions;

export function getAppLocators(page: Page) {
  const dialog = roleBy(page, APP_SELECTORS.dialog);
  const selectedRegion = roleBy(page, APP_SELECTORS.selectedCommand);
  const recentRegion = roleBy(page, APP_SELECTORS.recentCommands);

  function command(name: CommandName) {
    return roleBy(dialog, APP_SELECTORS.commandOptions[name]);
  }

  function selectedCommand(name: CommandName) {
    const selector = APP_SELECTORS.commandOptions[name];

    return roleBy(selectedRegion, {
      ...selector,
      role: 'heading',
    });
  }

  function recentCommand(name: CommandName) {
    const { name: label } = APP_SELECTORS.commandOptions[name].options;
    return roleBy(recentRegion, APP_SELECTORS.recentItems).filter({ hasText: label });
  }

  return {
    background: roleBy(page, APP_SELECTORS.background),
    clearSearchButton: roleBy(dialog, APP_SELECTORS.clearSearchButton),
    closePaletteButton: roleBy(dialog, APP_SELECTORS.closePaletteButton),
    command,
    commandOptions: roleBy(dialog, APP_SELECTORS.commands),
    dialog,
    emptyResults: roleBy(dialog, APP_SELECTORS.emptyResults),
    openPaletteButton: roleBy(page, APP_SELECTORS.openPalette),
    recentCommand,
    searchInput: roleBy(dialog, APP_SELECTORS.searchInput),
    selectedCommand,
  };
}
