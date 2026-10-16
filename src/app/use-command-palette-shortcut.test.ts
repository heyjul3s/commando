import { act, renderHook } from '@testing-library/react';
import { CommandPaletteProvider, useCommandPaletteStore } from '../features/command-palette/store';
import { useCommandPaletteShortcut } from './use-command-palette-shortcut';

function setup() {
  return renderHook(
    () => {
      useCommandPaletteShortcut();
      return useCommandPaletteStore();
    },
    { wrapper: CommandPaletteProvider },
  );
}

function dispatchKeyDown(key: string, options: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { cancelable: true, key, ...options });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

describe('use-command-palette-shortcut', () => {
  it.each([{ metaKey: true }, { ctrlKey: true }])(
    'toggles the current open state with %j + K',
    (modifier) => {
      const { result } = setup();
      expect(dispatchKeyDown('K', modifier).defaultPrevented).toBe(true);
      expect(result.current.getState().isOpen).toBe(true);
      dispatchKeyDown('k', modifier);
      expect(result.current.getState().isOpen).toBe(false);
    },
  );

  it('ignores K without a modifier and unrelated shortcuts', () => {
    const { result } = setup();
    expect(dispatchKeyDown('k').defaultPrevented).toBe(false);
    expect(dispatchKeyDown('ArrowDown', { metaKey: true }).defaultPrevented).toBe(false);
    expect(result.current.getState().isOpen).toBe(false);
  });

  it('reads current state after another component opens the palette', () => {
    const { result } = setup();
    act(() => result.current.getState().actions.setIsOpen(true));
    dispatchKeyDown('k', { metaKey: true });
    expect(result.current.getState().isOpen).toBe(false);
  });

  it('removes the shortcut listener when unmounted', () => {
    const { result, unmount } = setup();
    const store = result.current;
    unmount();
    expect(dispatchKeyDown('k', { metaKey: true }).defaultPrevented).toBe(false);
    expect(store.getState().isOpen).toBe(false);
  });
});
