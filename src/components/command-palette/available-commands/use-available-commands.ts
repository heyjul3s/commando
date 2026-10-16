import { useCallback, useMemo } from 'react';
import { COMMANDS } from '../../../constants';
import { useCommandPaletteStore } from '../../../store/command-palette';
import { useWorkspacePreviewStore } from '../../../store/workspace-preview';
import { getAvailableCommands } from '../get-available-commands';
import type { Command } from '../../../constants';

export function useAvailableCommands() {
  const palette = useCommandPaletteStore();
  const workspace = useWorkspacePreviewStore();

  const activeIndex = palette.use.activeIndex();
  const query = palette.use.query();

  const { setActiveIndex, closeCommandPalette } = palette.use.actions();
  const { setSelectedCommand } = workspace.use.actions();

  const derived = useMemo(() => getAvailableCommands(COMMANDS, query), [query]);

  const selectCommand = useCallback(
    (command: Command) => {
      setSelectedCommand(command);
      closeCommandPalette();
    },
    [setSelectedCommand, closeCommandPalette],
  );

  const getCommandHandlers = (command: Command, index: number) => {
    const handleMouseEnter = () => {
      setActiveIndex(index);
    };
    const handleClick = () => {
      selectCommand(command);
    };

    return { onMouseEnter: handleMouseEnter, onClick: handleClick };
  };

  return {
    state: { activeIndex },
    actions: { getCommandHandlers },
    derived,
  };
}
