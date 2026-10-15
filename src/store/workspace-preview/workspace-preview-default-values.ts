import { COMMANDS } from '../../constants';

import type { Command } from '../../constants';

export type WorkspacePreviewStoreInitialValues = {
  recentCommandIds: string[];
  selectedCommand: Command;
};

export const workspacePreviewDefaultValues: WorkspacePreviewStoreInitialValues = {
  recentCommandIds: [],
  selectedCommand: COMMANDS[0],
};
