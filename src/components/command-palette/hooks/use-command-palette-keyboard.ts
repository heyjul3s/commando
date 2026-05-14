import { useEffect } from 'react';
import { DOM_EVENT } from '../../../constants/events';
import { KEYBOARD_KEY } from '../../../constants/keyboard';

type UseCommandPaletteKeyboardProps = {
  onActivateNextCommand: () => void;
  onActivatePreviousCommand: () => void;
  onClose: () => void;
  onSelectActiveCommand: () => void;
  open: boolean;
};

export function useCommandPaletteKeyboard({
  onActivateNextCommand,
  onActivatePreviousCommand,
  onClose,
  onSelectActiveCommand,
  open,
}: UseCommandPaletteKeyboardProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleCommandPaletteKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_KEY.Escape) {
        onClose();
      }

      if (event.key === KEYBOARD_KEY.ArrowDown) {
        event.preventDefault();
        onActivateNextCommand();
      }

      if (event.key === KEYBOARD_KEY.ArrowUp) {
        event.preventDefault();
        onActivatePreviousCommand();
      }

      if (event.key === KEYBOARD_KEY.Enter) {
        event.preventDefault();
        onSelectActiveCommand();
      }
    };

    const removeCommandPaletteKeyDown = () => {
      window.removeEventListener(DOM_EVENT.KeyDown, handleCommandPaletteKeyDown);
    };

    window.addEventListener(DOM_EVENT.KeyDown, handleCommandPaletteKeyDown);

    return removeCommandPaletteKeyDown;
  }, [onActivateNextCommand, onActivatePreviousCommand, onClose, onSelectActiveCommand, open]);
}
