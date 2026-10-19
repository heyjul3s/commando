import { useEffect } from 'react';
import { useCommandPaletteStore } from '../features/command-palette/store';
import { DOM_EVENT, KEYBOARD_KEY } from '../shared/constants';

export function useCommandPaletteShortcut() {
  const palette = useCommandPaletteStore();

  useEffect(() => {
    const handleCommandPaletteShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === KEYBOARD_KEY.K) {
        event.preventDefault();
        const { actions, isOpen } = palette.getState();
        actions.setIsOpen(!isOpen);
      }
    };

    const removeCommandPaletteShortcut = () => {
      window.removeEventListener(DOM_EVENT.KeyDown, handleCommandPaletteShortcut);
    };

    window.addEventListener(DOM_EVENT.KeyDown, handleCommandPaletteShortcut);

    return removeCommandPaletteShortcut;
  }, [palette]);
}
