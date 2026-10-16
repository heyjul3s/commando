import { AvailableCommands } from '../available-commands/available-commands';
import { SearchBar } from '../search-bar/search-bar';
import { useCommandPalette } from './hooks/use-command-palette';

import styles from './command-palette.module.css';

export function CommandPalette() {
  const commandPalette = useCommandPalette();

  if (!commandPalette.state.isOpen) {
    return null;
  }

  return (
    <div
      className={styles['command-palette__overlay']}
      role="presentation"
      onMouseDown={commandPalette.actions.onCloseCommandPalette}
    >
      <section
        className={styles['command-palette']}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={commandPalette.actions.onDialogMouseDown}
      >
        <SearchBar />
        <AvailableCommands />
      </section>
    </div>
  );
}
