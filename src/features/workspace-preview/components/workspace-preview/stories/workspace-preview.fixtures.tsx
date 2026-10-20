import { useState } from 'react';
import { createStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { COMMANDS } from '../../../../../shared/constants';
import { createStoreSelectors } from '../../../../../shared/store/create-selectors';
import { CommandPaletteProvider } from '../../../../command-palette/store';
import { CommandPalette } from '../../../../command-palette/components/command-palette/command-palette';
import { WorkspacePreviewContext } from '../../../store/workspace-preview-provider';
import { workspacePreviewActions } from '../../../store/workspace-preview-actions';
import { workspacePreviewDefaultValues } from '../../../store/workspace-preview-default-values';
import { RECENT_COMMAND_LIMIT } from '../../../store/workspace-preview-constants';
import styles from './workspace-preview-stories.module.css';

import type { PropsWithChildren } from 'react';
import type { ReactRenderer, StoryContext } from '@storybook/react-vite';
import type { PartialStoryFn } from 'storybook/internal/types';
import type { WorkspacePreviewStore } from '../../../store/workspace-preview-provider';
import type { WorkspacePreviewStoreInitialValues } from '../../../store/workspace-preview-default-values';

export const projectCommand = COMMANDS.find((command) => command.id === 'projects')!;
export const notificationCommand = COMMANDS.find((command) => command.id === 'notifications')!;
export const fullHistory = COMMANDS.slice(0, RECENT_COMMAND_LIMIT);

export const workspacePreviewFixtures = {
  default: { ...workspacePreviewDefaultValues, recentCommandIds: [] },
  fullHistory: {
    recentCommandIds: fullHistory.map((command) => command.id),
    selectedCommand: fullHistory[0],
  },
  longLabel: {
    recentCommandIds: [],
    selectedCommand: {
      ...projectCommand,
      label: 'Browse all projects across the design and engineering workspace',
    },
  },
  withHistory: {
    recentCommandIds: [projectCommand.id, 'docs', 'dashboard'],
    selectedCommand: projectCommand,
  },
} satisfies Record<string, WorkspacePreviewStoreInitialValues>;

function FixtureProviders({
  children,
  ...fixture
}: PropsWithChildren<WorkspacePreviewStoreInitialValues>) {
  const [workspace] = useState(() => {
    const memory = new Map<string, string>();

    return createStoreSelectors(
      createStore<WorkspacePreviewStore>()(
        persist(
          (set, get) => ({
            ...fixture,
            actions: workspacePreviewActions(set, get),
          }),
          {
            name: 'workspace-preview-story',
            partialize: (state) => ({
              recentCommandIds: state.recentCommandIds,
            }),
            storage: createJSONStorage<{ recentCommandIds: string[] }>(() => ({
              getItem: (name) => memory.get(name) ?? null,
              removeItem: (name) => {
                memory.delete(name);
              },
              setItem: (name, value) => {
                memory.set(name, value);
              },
            })),
          },
        ),
      ),
    );
  });

  return (
    <CommandPaletteProvider initialValues={{ isOpen: false }}>
      <WorkspacePreviewContext.Provider value={workspace}>
        {children}
        <CommandPalette />
      </WorkspacePreviewContext.Provider>
    </CommandPaletteProvider>
  );
}

export function withWorkspacePreviewFixture(
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext,
) {
  const fixture: WorkspacePreviewStoreInitialValues =
    context.parameters.workspacePreviewFixture ?? workspacePreviewFixtures.default;

  return (
    <FixtureProviders key={context.id} {...fixture}>
      <div className={styles.fixture}>
        <Story />
      </div>
    </FixtureProviders>
  );
}
