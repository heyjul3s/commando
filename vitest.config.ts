import { configDefaults, defineConfig } from 'vitest/config';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    coverage: {
      reporter: ['cobertura', 'json-summary', 'json'],
      reportsDirectory: './test-reports',
      exclude: [...configDefaults.exclude, '__mocks__', '__handlers__'],
    },
    globals: true,
    reporters: ['default', 'junit'],
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [...configDefaults.exclude],
    outputFile: './test-reports/junit.xml',
    setupFiles: ['./vitest.setup.ts'],
    pool: 'threads',
    maxWorkers: process.env.CI ? 4 : 16,
    maxConcurrency: process.env.CI ? 4 : 16,
    isolate: true,
    passWithNoTests: true,
    ...(process.env.CI && {
      cache: {
        dir: 'node_modules/.vitest',
      },
      logHeapUsage: false,
    }),
  },
});
