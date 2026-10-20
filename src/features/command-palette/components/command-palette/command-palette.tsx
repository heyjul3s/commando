import { X } from 'lucide-react';
import { useId } from 'react';
import { FocusTrap } from 'focus-trap-react';
import { AvailableCommands } from '../available-commands/available-commands';
import { SearchBar } from '../search-bar/search-bar';
import { useCommandPalette } from './hooks/use-command-palette';

import styles from './command-palette.module.css';

export function CommandPalette() {
  const commandPalette = useCommandPalette();
  const listboxId = useId();
  const titleId = useId();

  if (!commandPalette.state.isOpen) {
    return null;
  }

  return (
    <div
      className={styles['command-palette__overlay']}
      onMouseDown={commandPalette.actions.onCloseCommandPalette}
      role="presentation"
    >
      {' '}
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,
          initialFocus: '[aria-label="Search commands"]',
          returnFocusOnDeactivate: true,
        }}
      >
        <section
          aria-labelledby={titleId}
          aria-modal="true"
          className={styles['command-palette']}
          onMouseDown={commandPalette.actions.onDialogMouseDown}
          role="dialog"
        >
          <div className={styles['command-palette__header']}>
            <h2 className={styles['command-palette__title']} id={titleId}>
              Search Commands
            </h2>

            <button
              aria-label="Close command palette"
              className={styles['command-palette__close-button']}
              onClick={commandPalette.actions.onCloseCommandPalette}
              title="Close command palette"
              type="button"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <SearchBar listboxId={listboxId} />
          <AvailableCommands listboxId={listboxId} />
        </section>
      </FocusTrap>
    </div>
  );
}
