import { X } from 'lucide-react';
import { useId } from 'react';
import { AvailableCommands } from '../available-commands/available-commands';
import { SearchBar } from '../search-bar/search-bar';
import { useCommandPalette } from './hooks/use-command-palette';

import styles from './command-palette.module.css';

export function CommandPalette() {
  const commandPalette = useCommandPalette();
  const titleId = useId();

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
        aria-labelledby={titleId}
        onMouseDown={commandPalette.actions.onDialogMouseDown}
      >
        <div className={styles['command-palette__header']}>
          <h2 className={styles['command-palette__title']} id={titleId}>
            Search Commands
          </h2>

          <button
            className={styles['command-palette__close-button']}
            type="button"
            onClick={commandPalette.actions.onCloseCommandPalette}
            aria-label="Close command palette"
            title="Close command palette"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <SearchBar />
        <AvailableCommands />
      </section>
    </div>
  );
}
