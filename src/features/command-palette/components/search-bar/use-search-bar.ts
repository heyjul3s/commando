import { useEffect, useRef } from 'react';

import { useCommandPaletteStore } from '../../store';
import { useWorkspacePreviewStore } from '../../../workspace-preview/store';
import { COMMANDS, KEYBOARD_KEY } from '../../../../shared/constants';
import { getAvailableCommands } from '../../utils';

import type { ChangeEvent, KeyboardEvent } from 'react';

export function useSearchBar() {
  const palette = useCommandPaletteStore();
  const workspace = useWorkspacePreviewStore();
  const query = palette.use.query();
  const { setQuery } = palette.use.actions();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleClearQuery() {
    setQuery('');
    inputRef.current?.focus();
  }

  function handleQueryKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.defaultPrevented || event.nativeEvent.isComposing) {
      return;
    }

    const { actions, activeIndex, isOpen, query } = palette.getState();

    if (!isOpen) {
      return;
    }

    const { filteredCommands } = getAvailableCommands(COMMANDS, query);
    const commandCount = Math.max(filteredCommands.length, 1);

    switch (event.key) {
      case KEYBOARD_KEY.ArrowDown: {
        event.preventDefault();
        const lastIndex = commandCount - 1;
        const nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
        actions.setActiveIndex(nextIndex);
        break;
      }
      case KEYBOARD_KEY.ArrowUp: {
        event.preventDefault();
        const previousIndex = activeIndex === 0 ? commandCount - 1 : activeIndex - 1;
        actions.setActiveIndex(previousIndex);
        break;
      }
      case KEYBOARD_KEY.Enter: {
        event.preventDefault();
        const command = filteredCommands[activeIndex];

        if (!command) {
          return;
        }

        workspace.getState().actions.setSelectedCommand(command);
        actions.closeCommandPalette();
        break;
      }
    }
  }

  return {
    actions: {
      onClearQuery: handleClearQuery,
      onQueryChange: handleQueryChange,
      onQueryKeyDown: handleQueryKeyDown,
    },
    refs: { inputRef },
    state: { query },
  };
}
