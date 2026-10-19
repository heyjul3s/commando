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
});
