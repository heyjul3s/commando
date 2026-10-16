import type { StoreApi } from 'zustand';
import type { CommandPaletteStore } from './command-palette-provider';

export type CommandPaletteStoreActions = {
  closeCommandPalette: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  setActiveIndex: (activeIndex: number) => void;
};

export function commandPaletteActions(
  set: StoreApi<CommandPaletteStore>['setState'],
): CommandPaletteStoreActions {
  return {
    closeCommandPalette: () => set((state) => (state.isOpen ? { isOpen: false } : state)),
    setActiveIndex: (activeIndex: number) =>
      set((state) => (state.activeIndex === activeIndex ? state : { activeIndex })),
    setQuery: (query: string) =>
      set((state) => (state.query === query ? state : { query, activeIndex: 0 })),
    setIsOpen: (isOpen: boolean) => set((state) => (state.isOpen === isOpen ? state : { isOpen })),
  };
}
