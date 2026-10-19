import { SearchBar } from '../search-bar';

import { searchBarFixtures, withCommandPaletteProvider } from './search-bar.fixtures';

import { createNewQuery, clearQuery, editExistingQuery } from './search-bar.interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: SearchBar,
  decorators: [withCommandPaletteProvider],
  parameters: { layout: 'centered' },
  title: 'Features/Command Palette/Search Bar/Interactions',
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CreateNewQuery: Story = {
  play: createNewQuery,
};

export const ClearNewQuery: Story = {
  play: clearQuery,
};

export const EditExistingQuery: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.existingQuery,
  },
  play: editExistingQuery,
};
