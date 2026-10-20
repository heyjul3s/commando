import { WorkspaceHeader } from '../workspace-header';
import { withWorkspaceHeaderFixture, workspaceHeaderFixtures } from './workspace-header.fixtures';
import {
  pointerOpen,
  enterOpen,
  spaceOpen,
  alreadyOpen,
  changeTheme,
} from './workspace-header.interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: WorkspaceHeader,
  decorators: [withWorkspaceHeaderFixture],
  parameters: { controls: { disable: true }, layout: 'fullscreen', showPaletteStatus: true },
  title: 'Features/Workspace Preview/Workspace Header/Interactions',
} satisfies Meta<typeof WorkspaceHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// -----------------------------------------------------------------------------
// Opening the palette
// -----------------------------------------------------------------------------

export const Pointer: Story = { play: pointerOpen };
export const Enter: Story = { play: enterOpen };
export const Space: Story = { play: spaceOpen };

// -----------------------------------------------------------------------------
// Already-open state
// -----------------------------------------------------------------------------

export const AlreadyOpen: Story = {
  parameters: { workspaceHeaderFixture: workspaceHeaderFixtures.open },
  play: alreadyOpen,
};

// -----------------------------------------------------------------------------
// Appearance
// -----------------------------------------------------------------------------

export const ChangeTheme: Story = {
  play: changeTheme,
};
