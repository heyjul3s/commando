import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
  },
  env: {
    builtin: true,
  },
  ignorePatterns: ['src/route-tree.gen.ts', 'plopfile.js', 'plop-templates/**'],
  rules: {
    'eslint/no-extra-boolean-cast': 'off',
    'eslint/no-unused-vars': 'error',
  },
  plugins: ['typescript', 'unicorn', 'oxc'],
});
