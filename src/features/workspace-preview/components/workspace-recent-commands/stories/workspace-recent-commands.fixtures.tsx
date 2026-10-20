import { useState } from 'react';
import { createStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { COMMANDS } from '../../../../../shared/constants';
import { createStoreSelectors } from '../../../../../shared/store/create-selectors';
import { WorkspacePreviewContext } from '../../../store/workspace-preview-provider';
import { workspacePreviewActions } from '../../../store/workspace-preview-actions';
import { workspacePreviewDefaultValues } from '../../../store/workspace-preview-default-values';
import { RECENT_COMMAND_LIMIT } from '../../../store/workspace-preview-constants';
import styles from './workspace-recent-commands-stories.module.css';

import type { PropsWithChildren } from 'react';
import type { ReactRenderer, StoryContext } from '@storybook/react-vite';
import type { PartialStoryFn } from 'storybook/internal/types';
import type { WorkspacePreviewStore } from '../../../store/workspace-preview-provider';

export const projectCommand = COMMANDS.find((command) => command.id === 'projects')!;
export const documentationCommand = COMMANDS.find((command) => command.id === 'docs')!;
export const fullHistory = COMMANDS.slice(0, RECENT_COMMAND_LIMIT);

export const recentCommandsFixtures = {
  empty: {
    recentCommandIds: [],
  },
  full: {
    recentCommandIds: fullHistory.map((command) => command.id),
  },
  mixedUnknown: {
    recentCommandIds: ['unknown-command', documentationCommand.id, projectCommand.id],
  },
  single: {
    recentCommandIds: [projectCommand.id],
  },
  unknownOnly: {
    recentCommandIds: ['unknown-command'],
  },
} satisfies Record<string, { recentCommandIds: string[] }>;

type Fixture = { recentCommandIds: string[] };

function FixtureProvider({ children, recentCommandIds }: PropsWithChildren<Fixture>) {
  const [workspace] = useState(() => {
    const memory = new Map<string, string>();

    return createStoreSelectors(
      createStore<WorkspacePreviewStore>()(
        persist(
          (set, get) => ({
            ...workspacePreviewDefaultValues,
            actions: workspacePreviewActions(set, get),
            recentCommandIds,
          }),
          {
            name: 'recent-commands-story',
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
    <WorkspacePreviewContext.Provider value={workspace}>
      {children}
    </WorkspacePreviewContext.Provider>
  );
}

export function withRecentCommandsFixture(
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext,
) {
  const fixture: Fixture = context.parameters.recentCommandsFixture ?? recentCommandsFixtures.empty;

  return (
    <FixtureProvider key={context.id} {...fixture}>
      <div className={styles.fixture}>
        <Story />
      </div>
    </FixtureProvider>
  );
}
