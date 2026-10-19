import { AvailableCommands } from '../available-commands';
import { withAvailableCommandsFixture } from './available-commands.fixtures';
import { hoverHighlight, selectCommand } from './available-commands.interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: AvailableCommands,
  decorators: [withAvailableCommandsFixture],
  parameters: { controls: { disable: true }, layout: 'centered' },
  title: 'Features/Command Palette/Available Commands/Interactions',
} satisfies Meta<typeof AvailableCommands>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Hover: Story = {
  parameters: { showHighlightStatus: true },
  play: hoverHighlight,
};

export const Select: Story = {
  parameters: { showSelectionStatus: true },
  play: selectCommand,
};
