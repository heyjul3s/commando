import { useContext } from 'react';
import { CommandPaletteContext } from './command-palette-provider';

export function useCommandPaletteStore() {
  const store = useContext(CommandPaletteContext);

  if (!store) {
    throw new Error('useCommandPaletteStore must be used within a CommandPaletteProvider');
  }

  return store;
}
