import type { StoreApi } from 'zustand';
import type { CommandPaletteStore } from './command-palette-context';

export type CommandPaletteStoreActions = {
  setIsOpen: (isOpen: boolean) => void;
};

export function commandPaletteActions(set: StoreApi<CommandPaletteStore>['setState']) {
  return {
    setIsOpen: (isOpen: boolean) => set((state) => (state.isOpen === isOpen ? state : { isOpen })),
  };
}
