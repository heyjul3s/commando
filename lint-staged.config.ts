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

    return `pnpm exec tsc --project ./tsconfig.json --noEmit`;
  },

  '**/*.{ts,tsx,js,jsx}': (filenames) => {
    const matchedFiles = filterIgnoredFiles(filenames);

    if (matchedFiles.length === 0) {
      return [];
    }

    const files = matchedFiles.join(' ');

    return [
      `pnpm exec oxlint --fix ${files}`,
      `pnpm exec prettier --write ${files}`,
      `pnpm exec markuplint ${files}`,
      `pnpm exec vitest related --passWithNoTests --run ${files}`,
    ];
  },

  'src/**/*.{module.css,css}': (filenames) => {
    if (filenames.length === 0) {
      return [];
    }

    const files = filenames.join(' ');
    return [`pnpm exec stylelint ${files} --fix`];
  },

  '**/*.{md,json}': (filenames) => {
    if (filenames.length === 0) {
      return [];
    }

    return `pnpm exec prettier --write ${filenames.join(' ')}`;
  },
};

export default config;
