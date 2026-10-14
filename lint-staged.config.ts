import type { Configuration } from 'lint-staged';

const ignoredFiles = new Set(['src/route-tree.gen.ts']);

function filterIgnoredFiles(filenames: readonly string[]) {
  return filenames.filter((filename) => !ignoredFiles.has(filename));
}

const config: Configuration = {
  'src/**/*.{ts,tsx}': (filenames) => {
    const files = filterIgnoredFiles(filenames);

    if (files.length === 0) {
      return [];
    }

    return `corepack pnpm exec tsc --project ./tsconfig.json --noEmit`;
  },

  '**/*.{ts,tsx,js,jsx}': (filenames) => {
    const matchedFiles = filterIgnoredFiles(filenames);

    if (matchedFiles.length === 0) {
      return [];
    }

    const files = matchedFiles.join(' ');

    return [
      `corepack pnpm exec oxlint --fix ${files}`,
      `corepack pnpm exec prettier --write ${files}`,
      `corepack pnpm exec markuplint ${files}`,
      `corepack pnpm exec vitest related --passWithNoTests --run ${files}`,
    ];
  },

  'src/**/*.{module.css,css}': (filenames) => {
    if (filenames.length === 0) {
      return [];
    }

    const files = filenames.join(' ');
    return [`corepack pnpm exec stylelint ${files} --fix`];
  },

  '**/*.{md,json}': (filenames) => {
    if (filenames.length === 0) {
      return [];
    }

    return `corepack pnpm exec prettier --write ${filenames.join(' ')}`;
  },
};

export default config;
