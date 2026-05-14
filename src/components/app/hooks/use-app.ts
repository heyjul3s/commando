import { useAppEvents } from './use-app-events';
import { useAppState } from './use-app-state';
import { COMMANDS } from '../../../constants/commands';

import type { Command } from '../../../constants/commands';

const COMMAND_BY_ID = new Map(COMMANDS.map((command) => [command.id, command]));

export function useApp() {
  const state = useAppState();

  useAppEvents({
    onToggleCommandPalette: state.actions.toggleCommandPalette,
  });

  return {
    actions: {
      clearRecentCommands: state.actions.clearRecentCommands,
      onOpenCommandPalette: state.actions.openCommandPalette,
      onSelectCommand: state.actions.selectCommand,
      setCommandPaletteOpen: state.actions.setOpen,
    },
    derived: {
      commands: COMMANDS,
      recentCommands: state.values.recentCommandIds.reduce<Command[]>((commands, id) => {
        const command = COMMAND_BY_ID.get(id);
        return command ? [...commands, command] : commands;
      }, []),
    },
    state: {
      commandPaletteOpen: state.values.open,
      recentCommandIds: state.values.recentCommandIds,
      selectedCommand: state.values.selectedCommand,
    },
  };
}
