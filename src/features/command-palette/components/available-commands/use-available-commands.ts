import { useCallback, useMemo } from 'react';
import { COMMANDS } from '../../../../shared/constants';
import { useCommandPaletteStore } from '../../store';
import { useWorkspacePreviewStore } from '../../../workspace-preview/store';
import { getAvailableCommands } from '../../utils';
import type { Command } from '../../../../shared/constants';

export function useAvailableCommands() {
  const palette = useCommandPaletteStore();
  const workspace = useWorkspacePreviewStore();

  const activeIndex = palette.use.activeIndex();
  const query = palette.use.query();

  const { closeCommandPalette, setActiveIndex } = palette.use.actions();
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

    return { onClick: handleClick, onMouseEnter: handleMouseEnter };
  };

  return {
    actions: { getCommandHandlers },
    derived,
    state: { activeIndex },
  };
}
