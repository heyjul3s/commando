import { CommandPalette } from '../command-palette';
import { commandPaletteFixtures, withCommandPaletteFixture } from './command-stories.fixtures';

import {
  keyboardSelection,
  closePalette,
  searchAndSelect,
  clearSearch,
  closeAndReopen,
  escapeDismiss,
  backdropDismiss,
} from './command-palette.interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: CommandPalette,
  decorators: [withCommandPaletteFixture],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  title: 'Features/Command Palette/Command-Palette/Interactions',
} satisfies Meta<typeof CommandPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchAndSelect: Story = {
  parameters: {
    commandPaletteFixture: commandPaletteFixtures.closed,
    showWorkspaceStatus: true,
  },
  play: searchAndSelect,
};

export const ClearSearch: Story = {
  play: clearSearch,
};

export const Close: Story = {
  play: closePalette,
};

export const CloseAndReopen: Story = {
  play: closeAndReopen,
};

export const Escape: Story = {
  play: escapeDismiss,
};

export const Backdrop: Story = {
  play: backdropDismiss,
};

export const KeyboardSelection: Story = {
  parameters: { showWorkspaceStatus: true },
  play: keyboardSelection,
};
