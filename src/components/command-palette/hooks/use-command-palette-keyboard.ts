import { useEffect } from 'react';
import { COMMANDS, DOM_EVENT, KEYBOARD_KEY } from '../../../constants';
import { useCommandPaletteStore } from '../../../store/command-palette';
import { useWorkspacePreviewStore } from '../../../store/workspace-preview';
import { getAvailableCommands } from '../get-available-commands';

export function useCommandPaletteKeyboard() {
  const palette = useCommandPaletteStore();
  const workspace = useWorkspacePreviewStore();
  const open = palette.use.isOpen();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const { isOpen, query, activeIndex, actions } = palette.getState();
      if (!isOpen) {
        return;
      }

      switch (event.key) {
        case KEYBOARD_KEY.Escape:
          actions.closeCommandPalette();
          break;
        case KEYBOARD_KEY.ArrowDown: {
          event.preventDefault();
          const count = getAvailableCommands(COMMANDS, query).filteredCommands.length;
          actions.setActiveIndex((activeIndex + 1) % Math.max(count, 1));
          break;
        }
        case KEYBOARD_KEY.ArrowUp: {
          event.preventDefault();
          const count = getAvailableCommands(COMMANDS, query).filteredCommands.length;
          actions.setActiveIndex(activeIndex === 0 ? Math.max(count - 1, 0) : activeIndex - 1);
          break;
        }
        case KEYBOARD_KEY.Enter: {
          event.preventDefault();
          const command = getAvailableCommands(COMMANDS, query).filteredCommands[activeIndex];
          if (command) {
            workspace.getState().actions.setSelectedCommand(command);
            actions.closeCommandPalette();
          }
          break;
        }
      }
    };

    window.addEventListener(DOM_EVENT.KeyDown, handleKeyDown);
    return () => window.removeEventListener(DOM_EVENT.KeyDown, handleKeyDown);
  }, [open, palette, workspace]);
}
