import { WorkspacePreviewSidebar } from '../workspace-preview-sidebar';
import { withSidebarFixture } from './workspace-preview-sidebar.fixtures';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: WorkspacePreviewSidebar,
  decorators: [withSidebarFixture],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  title: 'Features/Workspace Preview/Workspace Preview Sidebar/States',
} satisfies Meta<typeof WorkspacePreviewSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  parameters: {
    sidebarTheme: 'dark',
  },
};
