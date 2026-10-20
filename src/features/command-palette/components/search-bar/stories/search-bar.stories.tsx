import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  searchBarFixtures,
  withCommandPaletteProvider,
  withSearchBarSurface,
} from './search-bar.fixtures';
import { SearchBar } from '../search-bar';

const meta = {
  args: {
    listboxId: 'search-bar-story-results',
  },
  component: SearchBar,
  decorators: [withSearchBarSurface, withCommandPaletteProvider],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Features/Command Palette/Search Bar/States',
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.default,
  },
};

export const ExistingQuery: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.existingQuery,
  },
};

export const LongQuery: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.longQuery,
  },
};
