import { AvailableCommands } from '../available-commands';

import {
  availableCommandsFixtures,
  withAvailableCommandsFixture,
} from './available-commands.fixtures';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: AvailableCommands,
  decorators: [withAvailableCommandsFixture],
  parameters: { controls: { disable: true }, layout: 'centered' },
  title: 'Features/Command Palette/Available Commands/States',
} satisfies Meta<typeof AvailableCommands>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = {
  parameters: {
    availableCommandsFixture: availableCommandsFixtures.filtered,
  },
};

export const Empty: Story = {
  parameters: {
    availableCommandsFixture: availableCommandsFixtures.empty,
  },
};

export const Highlighted: Story = {
  parameters: {
    availableCommandsFixture: availableCommandsFixtures.highlighted,
  },
};
