import { RECENT_COMMAND_LIMIT } from './workspace-preview-constants';

import type { StoreApi } from 'zustand';
import type { Command } from '../../../shared/constants';
import type { WorkspacePreviewStore } from './workspace-preview-provider';

export type WorkspacePreviewStoreActions = {
  setSelectedCommand: (selectedCommand: Command) => void;
  clearRecentCommands: () => void;
};

export function workspacePreviewActions(
  set: StoreApi<WorkspacePreviewStore>['setState'],
  get: StoreApi<WorkspacePreviewStore>['getState'],
): WorkspacePreviewStoreActions {
  return {
    setSelectedCommand: (selectedCommand: Command) => {
      const state = get();

      // Guard clause to prevent unnecessary state updates
      // if the selected command is already the same as the current one
      // and it's already the most recent command.
      if (
        state.selectedCommand === selectedCommand &&
        state.recentCommandIds[0] === selectedCommand.id
      ) {
        return;
      }

      set((state) => {
        // Remove the selected command from the recent commands list
        // if it already exists
        const dedupedRecentCommands = state.recentCommandIds.filter(
          (id) => id !== selectedCommand.id,
        );

        return {
          selectedCommand,

          // Add the selected command to the front of the recent commands list
          // and limit the list to the most recent 6 commands
          recentCommandIds: [selectedCommand.id, ...dedupedRecentCommands].slice(
            0,
            RECENT_COMMAND_LIMIT,
          ),
        };
      });
    },

    clearRecentCommands: () => {
      // Guard clause to prevent unnecessary state updates
      // No need to set again if length is already 0
      if (get().recentCommandIds.length === 0) {
        return;
      }

      set({ recentCommandIds: [] });
    },
  };
}
