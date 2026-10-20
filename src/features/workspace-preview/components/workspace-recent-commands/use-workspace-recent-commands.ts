import { useMemo } from 'react';
import { COMMANDS } from '../../../../shared/constants';
import { useWorkspacePreviewStore } from '../../store';

import type { Command } from '../../../../shared/constants';

const COMMAND_BY_ID = new Map(COMMANDS.map((command) => [command.id, command]));

export function useWorkspaceRecentCommands() {
  const store = useWorkspacePreviewStore();
  const recentCommandIds = store.use.recentCommandIds();
  const { clearRecentCommands } = store.use.actions();

  const recentCommands = useMemo(() => {
    return recentCommandIds.reduce<Command[]>((commands, id) => {
      const command = COMMAND_BY_ID.get(id);

      if (command) {
        commands.push(command);
      }

      return commands;
    }, []);
  }, [recentCommandIds]);

  return {
    actions: {
      onClearRecentCommands: clearRecentCommands,
    },
    derived: {
      isEmptyRecentCommands: recentCommands.length === 0,
      recentCommands,
    },
  };
}
