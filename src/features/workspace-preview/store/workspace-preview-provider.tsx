import { createContext, useState } from 'react';
import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { workspacePreviewDefaultValues } from './workspace-preview-default-values';
import { workspacePreviewActions } from './workspace-preview-actions';
import { createStoreSelectors } from '../../../shared/store/create-selectors';
import { COMMANDS, STORAGE_KEYS } from '../../../shared/constants';
import { RECENT_COMMAND_LIMIT } from './workspace-preview-constants';

import type { PropsWithChildren } from 'react';
import type { WorkspacePreviewStoreActions } from './workspace-preview-actions';
import type { WorkspacePreviewStoreInitialValues } from './workspace-preview-default-values';

export interface WorkspacePreviewStore extends WorkspacePreviewStoreInitialValues {
  actions: WorkspacePreviewStoreActions;
}

type WorkspacePreviewStoreProvider = PropsWithChildren<{
  initialValues?: Partial<WorkspacePreviewStoreInitialValues>;
}>;

export const WorkspacePreviewContext = createContext<null | ReturnType<
  typeof createWorkspacePreviewStore
>>(null);

export function WorkspacePreviewProvider({
  children,
  initialValues,
}: WorkspacePreviewStoreProvider) {
  const [store] = useState(() =>
    createWorkspacePreviewStore({
      ...workspacePreviewDefaultValues,
      ...initialValues,
    }),
  );

  return (
    <WorkspacePreviewContext.Provider value={store}>{children}</WorkspacePreviewContext.Provider>
  );
}

function createWorkspacePreviewStore(initialValues: WorkspacePreviewStoreInitialValues) {
  return createStoreSelectors(
    createStore<WorkspacePreviewStore>()(
      persist(
        (set, get) => ({
          ...initialValues,
          actions: workspacePreviewActions(set, get),
        }),
        {
          name: STORAGE_KEYS.WorkspacePreview,
          partialize: (state) => ({ recentCommandIds: state.recentCommandIds }),

          // Merge function to handle merging persisted state with current state
          // and guard against invalid or outdated data in localStorage
          merge: (persistedState, currentState) => {
            const saved = persistedState as { recentCommandIds?: unknown } | null | undefined;
            const ids = saved?.recentCommandIds;

            if (!Array.isArray(ids)) {
              return currentState;
            }

            const validIds = ids.filter((id): id is string => {
              return typeof id === 'string' && COMMANDS.some((command) => command.id === id);
            });

            return {
              ...currentState,
              recentCommandIds: [...new Set(validIds)].slice(0, RECENT_COMMAND_LIMIT),
            };
          },
        },
      ),
    ),
  );
}
