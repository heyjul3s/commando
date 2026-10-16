import { useCommandPaletteStore } from '../../../store';
import { useCommandPaletteKeyboard } from './use-command-palette-keyboard';
import { useCommandPaletteLifecycle } from './use-command-palette-lifecycle';
import type { MouseEvent } from 'react';

export function useCommandPalette() {
  const paletteStore = useCommandPaletteStore();
  const isOpen = paletteStore.use.isOpen();
  const { closeCommandPalette } = paletteStore.use.actions();

  const handleDialogMouseDown = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  useCommandPaletteLifecycle();
  useCommandPaletteKeyboard();

  return {
    state: { isOpen },
    actions: {
      onCloseCommandPalette: closeCommandPalette,
      onDialogMouseDown: handleDialogMouseDown,
    },
  };
}
