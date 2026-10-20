import { expect, test } from '@playwright/test';
import { THEME } from '../src/app/theme/theme';
import { getThemeLocators } from './theme.locators';

const { beforeEach, step } = test;

beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('switches theme and preserves the preference on reload', async ({ page }) => {
  const theme = getThemeLocators(page);

  await step('Choose dark appearance', async () => {
    await theme.themeSelect.selectOption(THEME.Dark);
    await expect(page.locator('html')).toHaveAttribute('data-theme', THEME.Dark);
  });

  await step('Reload and verify the saved preference', async () => {
    await page.reload();
    await expect(theme.themeSelect).toHaveValue(THEME.Dark);
    await expect(page.locator('html')).toHaveAttribute('data-theme', THEME.Dark);
  });
});

test('System follows changes to the operating system appearance', async ({ page }) => {
  const theme = getThemeLocators(page);

  await step('Use System with a light operating system appearance', async () => {
    await page.emulateMedia({ colorScheme: THEME.Light });
    await theme.themeSelect.selectOption(THEME.System);
    await expect(page.locator('html')).toHaveAttribute('data-theme', THEME.Light);
  });

  await step('Follow a change to dark operating system appearance', async () => {
    await page.emulateMedia({ colorScheme: THEME.Dark });
    await expect(page.locator('html')).toHaveAttribute('data-theme', THEME.Dark);
  });
});

for (const activation of ['pointer', 'keyboard']) {
  test(`demo theme command preserves appearance when selected using ${activation}`, async ({
    page,
  }) => {
    const theme = getThemeLocators(page);

    await step('Start in light appearance and find the theme command', async () => {
      await theme.themeSelect.selectOption(THEME.Light);
      await theme.openPaletteButton.click();
      await theme.searchInput.fill('Toggle Dark Mode');
    });

    await step(`Activate the command using ${activation}`, async () => {
      if (activation === 'keyboard') {
        await theme.searchInput.press('Enter');
      } else {
        await theme.toggleDarkModeCommand.click();
      }
      await expect(theme.dialog).not.toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', THEME.Light);
    });

    await step('Reload and verify the original appearance persists', async () => {
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', THEME.Light);
    });
  });
}
