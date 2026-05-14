import { useCallback, useState } from 'react';

import type { Command } from '../../../constants/commands';

type UseCommandPaletteSelectionProps = {
  commands: Command[];
  onSelect: (command: Command) => void;
};

export function useCommandPaletteSelection({
  commands,
  onSelect,
}: UseCommandPaletteSelectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCommand = commands[activeIndex];

  const resetSelection = useCallback(() => {
    setActiveIndex(0);
  }, []);

  const activateNextCommand = useCallback(() => {
    setActiveIndex((index) => (index + 1) % Math.max(commands.length, 1));
  }, [commands.length]);

  const activatePreviousCommand = useCallback(() => {
    setActiveIndex((index) => (index === 0 ? Math.max(commands.length - 1, 0) : index - 1));
  }, [commands.length]);

  const selectCommand = useCallback(
    (command: Command) => {
      onSelect(command);
    },
    [onSelect],
  );

  const selectActiveCommand = useCallback(() => {
    if (activeCommand) {
      selectCommand(activeCommand);
    }
  }, [activeCommand, selectCommand]);

  return {
    actions: {
      activateNextCommand,
      activatePreviousCommand,
      resetSelection,
      selectActiveCommand,
      selectCommand,
      setActiveIndex,
    },
    derived: {
      activeCommand,
    },
    state: {
      activeIndex,
    },
  };
}
