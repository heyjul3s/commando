import { CommandPalette } from '../command-palette';
import { commandPaletteFixtures, withCommandPaletteFixture } from './command-stories.fixtures';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: CommandPalette,
  decorators: [withCommandPaletteFixture],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  title: 'Features/Command Palette/Command-Palette/States',
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = {
  parameters: {
    commandPaletteFixture: commandPaletteFixtures.filtered,
  },
};

export const Empty: Story = {
  parameters: {
    commandPaletteFixture: commandPaletteFixtures.empty,
  },
};

export const Closed: Story = {
  parameters: {
    commandPaletteFixture: commandPaletteFixtures.closed,
  },
};
