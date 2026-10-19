import { SearchBar } from '../search-bar';

import {
  searchBarFixtures,
  withCommandPaletteProvider,
  withSearchBarSurface,
  withStoreStatus,
  withExternalQueryControl,
} from './search-bar.fixtures';

import {
  preventKeyboardDefaults,
  ignorePreventedEvents,
  ignoreCompositionEvents,
  ignoreClosedPaletteKeys,
  ignoreUnrelatedKeys,
  createNewQuery,
  clearQuery,
  editExistingQuery,
  initialFocus,
  externalStoreUpdate,
  keyboardNavigation,
  keyboardSelection,
  emptyResultsKeyboard,
  clearWithKeyboard,
} from './search-bar.interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: SearchBar,
  decorators: [
    withSearchBarSurface,
    withExternalQueryControl,
    withStoreStatus,
    withCommandPaletteProvider,
  ],
  parameters: { layout: 'centered' },
  title: 'Features/Command Palette/Search Bar/Interactions',
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export const CreateNewQuery: Story = {
  play: createNewQuery,
};

export const EditExistingQuery: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.existingQuery,
  },
  play: editExistingQuery,
};

export const ClearQuery: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.highlighted,
  },
  play: clearQuery,
};

export const ExternalStoreUpdate: Story = {
  parameters: {
    showExternalQueryControl: true,
  },
  play: externalStoreUpdate,
};

// -----------------------------------------------------------------------------
// Keyboard and focus
// -----------------------------------------------------------------------------

export const InitialFocus: Story = {
  play: initialFocus,
};

export const KeyboardNavigation: Story = {
  play: keyboardNavigation,
};

export const KeyboardSelection: Story = {
  play: keyboardSelection,
};

export const EmptyResultsKeyboard: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.empty,
  },
  play: emptyResultsKeyboard,
};

export const ClearWithKeyboard: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.existingQuery,
  },
  play: clearWithKeyboard,
};

// -----------------------------------------------------------------------------
// Event guards
// -----------------------------------------------------------------------------

export const PreventKeyboardDefaults: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.empty,
  },
  play: preventKeyboardDefaults,
};

export const IgnorePreventedEvents: Story = {
  play: ignorePreventedEvents,
};

export const IgnoreCompositionEvents: Story = {
  play: ignoreCompositionEvents,
};

export const IgnoreClosedPaletteKeys: Story = {
  parameters: {
    searchBarFixture: searchBarFixtures.closed,
  },
  play: ignoreClosedPaletteKeys,
};

export const IgnoreUnrelatedKeys: Story = {
  play: ignoreUnrelatedKeys,
};
