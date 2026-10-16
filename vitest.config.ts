import { configDefaults, defineConfig } from 'vitest/config';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    reporters: ['default', 'junit'],
    outputFile: './test-reports/junit.xml',
    passWithNoTests: true,
    maxWorkers: process.env.CI ? 4 : 16,
    ...(process.env.CI && {
      cache: {
        dir: 'node_modules/.vitest',
      },
    }),
    coverage: {
      provider: 'v8',
      reporter: ['cobertura', 'json-summary', 'json'],
      reportsDirectory: './test-reports',
      exclude: [...configDefaults.exclude, '__mocks__', '__handlers__'],
    },
    projects: [
      {
        extends: true,
        test: {
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
          exclude: [...configDefaults.exclude],
          setupFiles: ['./vitest.setup.ts'],
          pool: 'threads',
          maxConcurrency: process.env.CI ? 4 : 16,
          isolate: true,
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
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
