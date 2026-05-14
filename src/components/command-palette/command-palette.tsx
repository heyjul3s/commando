import { AvailableCommands } from './available-commands';
import { useCommandPalette } from './hooks/use-command-palette';
import { SearchBar } from './search-bar';
import type { Command } from '../../constants/commands';
import styles from './command-palette.module.css';

type CommandPaletteProps = {
  commands: Command[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (command: Command) => void;
};

export function CommandPalette({ commands, open, onOpenChange, onSelect }: CommandPaletteProps) {
  const commandPalette = useCommandPalette({
    commands,
    onOpenChange,
    onSelect,
    open,
  });

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles['command-palette__overlay']}
      role="presentation"
      onMouseDown={() => onOpenChange(false)}
    >
      <section
        className={styles['command-palette']}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <SearchBar
          query={commandPalette.state.query}
          onQueryChange={commandPalette.actions.setQuery}
          onClose={commandPalette.actions.closeCommandPalette}
        />

        <AvailableCommands
          activeIndex={commandPalette.state.activeIndex}
          filteredCommands={commandPalette.derived.filteredCommands}
          groupedCommands={commandPalette.derived.groupedCommands}
          onActiveIndexChange={commandPalette.actions.setActiveIndex}
          onSelect={commandPalette.actions.selectCommand}
        />
      </section>
    </div>
  );
}
