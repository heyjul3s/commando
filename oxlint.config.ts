import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
  },
  env: {
    builtin: true,
  },
  ignorePatterns: ['src/route-tree.gen.ts', 'plopfile.js', 'plop-templates/**'],
  jsPlugins: ['eslint-plugin-perfectionist'],
  plugins: ['typescript', 'unicorn', 'oxc'],
  rules: {
    'eslint/no-extra-boolean-cast': 'off',
    'eslint/no-unused-vars': 'error',
    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],
  },
});
