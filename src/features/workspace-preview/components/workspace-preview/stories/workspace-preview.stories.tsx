import { WorkspacePreview } from '../workspace-preview';

import {
  withWorkspacePreviewFixture,
  workspacePreviewFixtures,
} from './workspace-preview.fixtures';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: WorkspacePreview,
  decorators: [withWorkspacePreviewFixture],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  title: 'Features/Workspace Preview/Workspace Preview/States',
} satisfies Meta<typeof WorkspacePreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHistory: Story = {
  parameters: { workspacePreviewFixture: workspacePreviewFixtures.withHistory },
};

export const FullHistory: Story = {
  parameters: { workspacePreviewFixture: workspacePreviewFixtures.fullHistory },
};

export const LongSelectedLabel: Story = {
  parameters: { workspacePreviewFixture: workspacePreviewFixtures.longLabel },
};
