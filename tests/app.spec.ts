import { test, expect } from '@playwright/test';
import { getAppLocators } from './app.locators';

const { beforeEach, describe, step } = test;

describe('Command Palette', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('searches and selects a command', async ({ page }) => {
    const app = getAppLocators(page);

    await step('Open the palette', async () => {
      await app.openPaletteButton.click();
      await expect(app.dialog).toBeVisible();
    });

    await step('Search and select a command', async () => {
      await app.searchInput.fill('Browse Projects');
      await expect(app.commandOptions).toHaveCount(1);
      await app.command('browseProjects').click();
      await expect(app.dialog).not.toBeVisible();
    });

    await step('Workspace is updated with selected command', async () => {
      await expect(app.selectedCommand('browseProjects')).toBeVisible();
    });

    await step('Reopen after selection with a cleared query and dismiss using Escape', async () => {
      await page.keyboard.press('ControlOrMeta+k');
      await expect(app.searchInput).toHaveValue('');
      await app.searchInput.press('Escape');
      await expect(app.dialog).not.toBeVisible();
    });
  });

  test('shares hover highlighting with keyboard navigation and selection', async ({ page }) => {
    const app = getAppLocators(page);

    await step('Hover a command while focus remains in the search input', async () => {
      await app.openPaletteButton.click();
      await expect(app.searchInput).toBeFocused();
      await app.command('browseProjects').hover();
      await expect(app.command('browseProjects')).toHaveAttribute('aria-selected', 'true');
    });

    await step('ArrowDown highlights the next command and Enter selects it', async () => {
      await app.searchInput.press('ArrowDown');
      await expect(app.command('searchDocumentation')).toHaveAttribute('aria-selected', 'true');
      await expect(app.command('browseProjects')).toHaveAttribute('aria-selected', 'false');
      await app.searchInput.press('Enter');
      await expect(app.dialog).not.toBeVisible();
      await expect(app.selectedCommand('searchDocumentation')).toBeVisible();
      await expect(app.recentCommand('searchDocumentation')).toBeVisible();
    });
  });

  test('keeps the palette open when navigating and selecting empty results', async ({ page }) => {
    const app = getAppLocators(page);

    await step('Search for a query with no matching commands', async () => {
      await app.openPaletteButton.click();
      await app.searchInput.fill('no matching commands');
      await expect(app.commandOptions).toHaveCount(0);
      await expect(app.emptyResults).toHaveText('No commands found');
    });

    await step('ArrowDown and Enter keep the empty palette open', async () => {
      await app.searchInput.press('ArrowDown');
      await app.searchInput.press('Enter');
      await expect(app.dialog).toBeVisible();
      await expect(app.emptyResults).toHaveText('No commands found');
      await expect(app.searchInput).toBeFocused();
    });

    await step('Dismiss without changing the selected command', async () => {
      await app.searchInput.press('Escape');
      await expect(app.dialog).not.toBeVisible();
      await expect(app.selectedCommand('openDashboard')).toBeVisible();
    });
  });

  test('clears search without closing', async ({ page }) => {
    const app = getAppLocators(page);

    await step('Open and filter commands', async () => {
      await app.openPaletteButton.click();
      await app.searchInput.fill('projects');
      await expect(app.commandOptions).toHaveCount(1);
      await expect(app.searchInput).toHaveValue('projects');
    });

    await step('Clear search while keeping palette open', async () => {
      await app.clearSearchButton.click();
      await expect(app.searchInput).toHaveValue('');
      await expect(app.searchInput).toBeFocused();
      await expect(app.dialog).toBeVisible();

      await expect(app.command('openDashboard')).toBeVisible();

      await expect(app.clearSearchButton).toHaveCount(0);
    });
  });

  test('resets search after closing and reopening', async ({ page }) => {
    const app = getAppLocators(page);
    const query = 'projects';

    await step('Open and fill in search query', async () => {
      await app.openPaletteButton.click();
      await app.searchInput.fill(query);
      await expect(app.searchInput).toHaveValue(query);
    });

    await step('Close the search dialog', async () => {
      await app.closePaletteButton.click();
      await expect(app.dialog).not.toBeVisible();
    });

    await step('Reopen the search dialog', async () => {
      await app.openPaletteButton.click();
      await expect(app.dialog).toBeVisible();
      await expect(app.searchInput).toHaveValue('');
      await expect(app.searchInput).toBeFocused();
    });
  });

  test('opens and dismisses using keyboard shortcuts', async ({ page }) => {
    const app = getAppLocators(page);

    await step('Open the palette using the keyboard shortcut', async () => {
      await expect(app.dialog).not.toBeVisible();
      await page.keyboard.press('ControlOrMeta+k');
      await expect(app.dialog).toBeVisible();
      await expect(app.searchInput).toBeFocused();
    });

    await step('Dismiss the palette using keyboard shortcuts', async () => {
      await page.keyboard.press('Escape');
      await expect(app.dialog).not.toBeVisible();
    });
  });

  test('preserves recent commands after reloading', async ({ page }) => {
    const app = getAppLocators(page);

    await step('Select a command to add it to recent history', async () => {
      await app.openPaletteButton.click();
      await app.command('browseProjects').click();

      await expect(app.dialog).not.toBeVisible();
      await expect(app.recentCommand('browseProjects')).toBeVisible();
    });

    await step('Reload and verify recent history persists', async () => {
      await page.reload();

      await expect(app.recentCommand('browseProjects')).toBeVisible();
    });
  });

  test('makes the workspace inert only while the palette is open', async ({ page }) => {
    const app = getAppLocators(page);
    const workspace = app.background;

    await step('The workspace starts interactive', async () => {
      await expect(workspace).not.toHaveAttribute('inert');
      await app.openPaletteButton.click();
    });

    await step('Opening disables the workspace while leaving the dialog interactive', async () => {
      await expect(workspace).toHaveAttribute('inert', '');
      await expect(app.dialog).toBeVisible();
      await expect(app.dialog).not.toHaveAttribute('inert');
      await app.searchInput.fill('projects');
      await expect(app.searchInput).toHaveValue('projects');
    });

    await step('Closing restores workspace interaction', async () => {
      await app.closePaletteButton.click();
      await expect(workspace).not.toHaveAttribute('inert');
      await app.openPaletteButton.click();
      await expect(app.dialog).toBeVisible();
    });
  });
});
