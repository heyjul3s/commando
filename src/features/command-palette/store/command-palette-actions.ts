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
    closeCommandPalette: () =>
      set((state) => {
        if (!state.isOpen) {
          return state;
        }

        return { isOpen: false };
      }),

    setActiveIndex: (activeIndex) =>
      set((state) => {
        if (state.activeIndex === activeIndex) {
          return state;
        }

        return { activeIndex };
      }),

    setIsOpen: (isOpen) =>
      set((state) => {
        if (state.isOpen === isOpen) {
          return state;
        }

        return { isOpen };
      }),

    setQuery: (query) =>
      set((state) => {
        if (state.query === query) {
          return state;
        }

        return { activeIndex: 0, query };
      }),
  };
}
