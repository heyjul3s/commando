import { useCallback } from 'react';
import type { Command } from '../../../constants/commands';
import { useCommandPaletteKeyboard } from './use-command-palette-keyboard';
import { useCommandPaletteLifecycle } from './use-command-palette-lifecycle';
import { useCommandPaletteSearch } from './use-command-palette-search';
import { useCommandPaletteSelection } from './use-command-palette-selection';

type UseCommandPaletteProps = {
  commands: Command[];
  onOpenChange: (open: boolean) => void;
  onSelect: (command: Command) => void;
  open: boolean;
};

export function useCommandPalette({
  commands,
  onOpenChange,
  onSelect,
  open,
}: UseCommandPaletteProps) {
  const closeCommandPalette = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const selectCommand = useCallback(
    (command: Command) => {
      onSelect(command);
      closeCommandPalette();
    },
    [closeCommandPalette, onSelect],
  );

  const search = useCommandPaletteSearch({ commands });
  const selection = useCommandPaletteSelection({
    commands: search.derived.filteredCommands,
    onSelect: selectCommand,
  });

  useCommandPaletteLifecycle({
    actions: {
      resetSearch: search.actions.resetSearch,
      resetSelection: selection.actions.resetSelection,
    },
    state: {
      open,
      query: search.state.query,
    },
  });

  useCommandPaletteKeyboard({
    onActivateNextCommand: selection.actions.activateNextCommand,
    onActivatePreviousCommand: selection.actions.activatePreviousCommand,
    onClose: closeCommandPalette,
    onSelectActiveCommand: selection.actions.selectActiveCommand,
    open,
  });

  return {
    actions: {
      closeCommandPalette,
      selectCommand,
      setActiveIndex: selection.actions.setActiveIndex,
      setQuery: search.actions.setQuery,
    },
    derived: {
      filteredCommands: search.derived.filteredCommands,
      groupedCommands: search.derived.groupedCommands,
    },
    state: {
      activeIndex: selection.state.activeIndex,
      query: search.state.query,
    },
  };
}
