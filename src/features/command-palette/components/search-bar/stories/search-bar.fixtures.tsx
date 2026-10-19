import { CommandPaletteProvider } from '../../../store/command-palette-provider';

import type { Decorator, StoryContext } from '@storybook/react-vite';

export const searchBarFixtures = {
  default: {
    query: '',
  },
  existingQuery: {
    query: 'existing query',
  },
  longQuery: {
    query: 'this is a very long query that exceeds the typical length of a search query',
  },
};

export function withCommandPaletteProvider(Story: Parameters<Decorator>[0], context: StoryContext) {
  const fixture = context.parameters.searchBarFixture || searchBarFixtures.default;

  return (
    <CommandPaletteProvider key={context.id} initialValues={{ isOpen: true, ...fixture }}>
      <div style={{ width: 360 }}>
        <Story />
      </div>
    </CommandPaletteProvider>
  );
}
