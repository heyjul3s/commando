import { THEME } from '../../../../../app/theme/theme';
import { WorkspaceHeader } from '../workspace-header';
import { withWorkspaceHeaderFixture } from './workspace-header.fixtures';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: WorkspaceHeader,
  decorators: [withWorkspaceHeaderFixture],
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
  title: 'Features/Workspace Preview/Workspace Header/States',
} satisfies Meta<typeof WorkspaceHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  globals: {
    theme: THEME.Dark,
  },
};
