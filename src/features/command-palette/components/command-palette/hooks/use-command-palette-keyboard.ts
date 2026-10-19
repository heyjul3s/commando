import { useEffect } from 'react';
import { DOM_EVENT, KEYBOARD_KEY } from '../../../../../shared/constants';
import { useCommandPaletteStore } from '../../../store';

export function useCommandPaletteKeyboard() {
  const palette = useCommandPaletteStore();
  const open = palette.use.isOpen();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) {
        return;
      }

      const { actions, isOpen } = palette.getState();

      if (!isOpen) {
        return;
      }

      if (event.key === KEYBOARD_KEY.Escape) {
        actions.closeCommandPalette();
      }
    };

    window.addEventListener(DOM_EVENT.KeyDown, handleKeyDown);
    return () => window.removeEventListener(DOM_EVENT.KeyDown, handleKeyDown);
  }, [open, palette]);
}
