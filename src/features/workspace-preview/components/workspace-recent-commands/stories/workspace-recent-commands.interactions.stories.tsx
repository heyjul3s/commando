import { WorkspaceRecentCommands } from '../workspace-recent-commands';
import {
  recentCommandsFixtures,
  withRecentCommandsFixture,
} from './workspace-recent-commands.fixtures';
import {
  clearHistory,
  clearWithEnter,
  clearWithSpace,
  mixedUnknownIds,
  unknownIdsOnly,
} from './workspace-recent-commands.interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: WorkspaceRecentCommands,
  decorators: [withRecentCommandsFixture],
  parameters: {
    controls: { disable: true },
    layout: 'centered',
    recentCommandsFixture: recentCommandsFixtures.full,
  },
  title: 'Features/Workspace Preview/Workspace Recent Commands/Interactions',
} satisfies Meta<typeof WorkspaceRecentCommands>;

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------
// Clearing history
// -----------------------------------------------------------------------------

export const ClearHistory: Story = { play: clearHistory };
export const ClearWithEnter: Story = { play: clearWithEnter };
export const ClearWithSpace: Story = { play: clearWithSpace };

// -----------------------------------------------------------------------------
// Unknown IDs
// -----------------------------------------------------------------------------

export const MixedUnknownIds: Story = {
  parameters: { recentCommandsFixture: recentCommandsFixtures.mixedUnknown },
  play: mixedUnknownIds,
};
export const UnknownIdsOnly: Story = {
  parameters: { recentCommandsFixture: recentCommandsFixtures.unknownOnly },
  play: unknownIdsOnly,
};
