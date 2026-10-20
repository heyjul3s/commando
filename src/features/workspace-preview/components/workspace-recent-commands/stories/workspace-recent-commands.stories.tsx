import { WorkspaceRecentCommands } from '../workspace-recent-commands';

import {
  recentCommandsFixtures,
  withRecentCommandsFixture,
} from './workspace-recent-commands.fixtures';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: WorkspaceRecentCommands,
  decorators: [withRecentCommandsFixture],
  parameters: {
    controls: {
      disable: true,
    },
    layout: 'centered',
  },
  title: 'Features/Workspace Preview/Workspace Recent Commands/States',
} satisfies Meta<typeof WorkspaceRecentCommands>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleCommand: Story = {
  parameters: { recentCommandsFixture: recentCommandsFixtures.single },
};

export const FullHistory: Story = {
  parameters: { recentCommandsFixture: recentCommandsFixtures.full },
};

export const MixedUnknownIds: Story = {
  parameters: { recentCommandsFixture: recentCommandsFixtures.mixedUnknown },
};

export const UnknownIdsOnly: Story = {
  parameters: { recentCommandsFixture: recentCommandsFixtures.unknownOnly },
};
