import { createStore } from 'zustand';
import { commandPaletteActions } from './command-palette-actions';
import { commandPaletteDefaultValues } from './command-palette-default-values';
import type { CommandPaletteStore } from './command-palette-provider';

function createTestStore() {
  return createStore<CommandPaletteStore>()((set) => ({
    ...commandPaletteDefaultValues,
    actions: commandPaletteActions(set),
  }));
}

describe('command-palette-actions', () => {
  describe('closeCommandPalette', () => {
    it('closes an open palette', () => {
      const store = createTestStore();
      store.getState().actions.setIsOpen(true);

      store.getState().actions.closeCommandPalette();

      expect(store.getState().isOpen).toBe(false);
    });

    it('skips updates when already closed', () => {
      const store = createTestStore();
      const previous = store.getState();

      store.getState().actions.closeCommandPalette();

      expect(store.getState()).toBe(previous);
    });
  });
});
