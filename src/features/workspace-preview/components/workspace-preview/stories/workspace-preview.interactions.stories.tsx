import { WorkspacePreview } from '../workspace-preview';

import {
  withWorkspacePreviewFixture,
  workspacePreviewFixtures,
} from './workspace-preview.fixtures';

import { selectCommand, clearHistory, updateHistory } from './workspace-preview.interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: WorkspacePreview,
  decorators: [withWorkspacePreviewFixture],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  title: 'Features/Workspace Preview/Workspace Preview/Interactions',
} satisfies Meta<typeof WorkspacePreview>;

export default meta;

type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------
// Selection
// -----------------------------------------------------------------------------

export const SelectCommand: Story = { play: selectCommand };

// -----------------------------------------------------------------------------
// Recent history
// -----------------------------------------------------------------------------

export const ClearHistory: Story = {
  parameters: { workspacePreviewFixture: workspacePreviewFixtures.withHistory },
  play: clearHistory,
};

export const UpdateHistory: Story = {
  parameters: { workspacePreviewFixture: workspacePreviewFixtures.fullHistory },
  play: updateHistory,
};
