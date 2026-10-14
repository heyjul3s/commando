import { useEffect } from 'react';
import { DOM_EVENT, KEYBOARD_KEY } from '../../../constants';

type UseAppEventsProps = {
  onToggleCommandPalette: () => void;
};

export function useAppEvents({ onToggleCommandPalette }: UseAppEventsProps) {
  useEffect(() => {
    const handleCommandPaletteShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === KEYBOARD_KEY.K) {
        event.preventDefault();
        onToggleCommandPalette();
      }
    };

    const removeCommandPaletteShortcut = () => {
      window.removeEventListener(DOM_EVENT.KeyDown, handleCommandPaletteShortcut);
    };

    window.addEventListener(DOM_EVENT.KeyDown, handleCommandPaletteShortcut);

    return removeCommandPaletteShortcut;
  }, [onToggleCommandPalette]);
}
