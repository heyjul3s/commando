import { act, renderHook } from '@testing-library/react';
import { COMMANDS } from '../../../constants';
import { ContextProviders } from '../../../context-providers/context-providers';
import { useCommandPaletteStore } from '../../../store/command-palette';
import { useWorkspacePreviewStore } from '../../../store/workspace-preview';
import { useCommandPaletteKeyboard } from './use-command-palette-keyboard';

function setup(open = true) {
  const hook = renderHook(
    () => {
      useCommandPaletteKeyboard();
      return { palette: useCommandPaletteStore(), workspace: useWorkspacePreviewStore() };
    },
    { wrapper: ContextProviders },
  );
  act(() => hook.result.current.palette.getState().actions.setIsOpen(open));
  return hook;
}

function keydown(key: string) {
  const event = new KeyboardEvent('keydown', { key, cancelable: true });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

describe('use-command-palette-keyboard', () => {
  beforeEach(() => localStorage.clear());

  it('navigates and wraps selection in both directions', () => {
    const { result } = setup();
    expect(keydown('ArrowUp').defaultPrevented).toBe(true);
    expect(result.current.palette.getState().activeIndex).toBe(COMMANDS.length - 1);
    keydown('ArrowDown');
    expect(result.current.palette.getState().activeIndex).toBe(0);
    keydown('ArrowDown');
    expect(result.current.palette.getState().activeIndex).toBe(1);
  });

  it('reads current query and selection without subscribing to them', () => {
    const { result } = setup();
    const previous = result.current;
    act(() => {
      result.current.palette.getState().actions.setQuery('settings');
      result.current.palette.getState().actions.setActiveIndex(1);
    });
    expect(result.current).toBe(previous);
    keydown('Enter');
    expect(result.current.workspace.getState().selectedCommand.id).toBe('theme');
    expect(result.current.workspace.getState().recentCommandIds).toEqual(['theme']);
    expect(result.current.palette.getState().isOpen).toBe(false);
  });

  it('closes on Escape', () => {
    const { result } = setup();
    keydown('Escape');
    expect(result.current.palette.getState().isOpen).toBe(false);
  });

  it('ignores keys while closed and responds after opening', () => {
    const { result } = setup(false);
    expect(keydown('ArrowDown').defaultPrevented).toBe(false);
    expect(result.current.palette.getState().activeIndex).toBe(0);
    act(() => result.current.palette.getState().actions.setIsOpen(true));
    keydown('ArrowDown');
    expect(result.current.palette.getState().activeIndex).toBe(1);
    keydown('Escape');
    expect(keydown('ArrowDown').defaultPrevented).toBe(false);
  });

  it('handles empty results without selecting or closing', () => {
    const { result } = setup();
    act(() => result.current.palette.getState().actions.setQuery('no matching command'));
    keydown('ArrowDown');
    keydown('ArrowUp');
    keydown('Enter');
    expect(result.current.palette.getState().activeIndex).toBe(0);
    expect(result.current.palette.getState().isOpen).toBe(true);
    expect(result.current.workspace.getState().recentCommandIds).toEqual([]);
  });

  it('removes the listener when unmounted', () => {
    const { result, unmount } = setup();
    const palette = result.current.palette;
    unmount();
    keydown('Escape');
    keydown('ArrowDown');
    expect(palette.getState().isOpen).toBe(true);
    expect(palette.getState().activeIndex).toBe(0);
  });
});
