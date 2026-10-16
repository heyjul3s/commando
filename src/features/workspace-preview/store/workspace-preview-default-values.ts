import { COMMANDS } from '../../../shared/constants';

import type { Command } from '../../../shared/constants';

export type WorkspacePreviewStoreInitialValues = {
  recentCommandIds: string[];
  selectedCommand: Command;
};

export const workspacePreviewDefaultValues: WorkspacePreviewStoreInitialValues = {
  recentCommandIds: [],
  selectedCommand: COMMANDS[0],
};
