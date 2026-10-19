import { configDefaults, defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    maxWorkers: process.env.CI ? 4 : 16,
    outputFile: './test-reports/junit.xml',
    passWithNoTests: true,
    reporters: ['default', 'junit'],
    ...(process.env.CI && {
      cache: {
        dir: 'node_modules/.vitest',
      },
    }),
    coverage: {
      exclude: [...configDefaults.exclude, '__mocks__', '__handlers__'],
      provider: 'v8',
      reporter: ['cobertura', 'json-summary', 'json'],
      reportsDirectory: './test-reports',
    },
    projects: [
      {
        extends: true,
        test: {
          environment: 'jsdom',
          exclude: [...configDefaults.exclude],
          globals: true,
          include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
          isolate: true,
          maxConcurrency: process.env.CI ? 4 : 16,
          pool: 'threads',
          setupFiles: ['./vitest.setup.ts'],
          ...(process.env.CI && {
            logHeapUsage: false,
          }),
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [
              {
                browser: 'chromium',
              },
            ],
            provider: playwright(),
          },
          name: 'storybook',
        },
      },
    ],
  },
});
