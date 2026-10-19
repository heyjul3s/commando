import { act, renderHook } from '@testing-library/react';
import { AppProviders } from '../../../../../app/providers/app-providers';
import { useCommandPaletteStore } from '../../../store';
import { useCommandPaletteKeyboard } from './use-command-palette-keyboard';

function setup(open = true) {
  const hook = renderHook(
    () => {
      useCommandPaletteKeyboard();
      return useCommandPaletteStore();
    },
    { wrapper: AppProviders },
  );
  act(() => hook.result.current.getState().actions.setIsOpen(open));
  return hook;
}

function keydown(key: string, options: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { cancelable: true, key, ...options });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

describe('use-command-palette-keyboard', () => {
  it('closes on Escape', () => {
    const { result } = setup();
    keydown('Escape');
    expect(result.current.getState().isOpen).toBe(false);
  });

  it('ignores navigation and selection events dispatched outside the input', () => {
    const { result } = setup();
    for (const key of ['ArrowDown', 'ArrowUp', 'Enter']) {
      expect(keydown(key).defaultPrevented).toBe(false);
    }
    expect(result.current.getState().activeIndex).toBe(0);
    expect(result.current.getState().isOpen).toBe(true);
  });

  it('ignores Escape during composition and when already handled', () => {
    const { result } = setup();
    keydown('Escape', { isComposing: true });
    expect(result.current.getState().isOpen).toBe(true);
    const event = new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' });
    event.preventDefault();
    act(() => {
      window.dispatchEvent(event);
    });
    expect(result.current.getState().isOpen).toBe(true);
  });

  it('ignores Escape while closed and responds after reopening', () => {
    const { result } = setup(false);
    keydown('Escape');
    expect(result.current.getState().isOpen).toBe(false);
    act(() => result.current.getState().actions.setIsOpen(true));
    keydown('Escape');
    expect(result.current.getState().isOpen).toBe(false);
  });

  it('removes the listener when unmounted', () => {
    const { result, unmount } = setup();
    const palette = result.current;
    unmount();
    keydown('Escape');
    expect(palette.getState().isOpen).toBe(true);
  });
});
