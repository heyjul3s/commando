import { act, renderHook } from '@testing-library/react';
import { COMMANDS, DOM_EVENT, KEYBOARD_KEY } from '../../../constants';
import { useApp } from './use-app';

function dispatchCommandPaletteShortcut() {
  const event = new KeyboardEvent(DOM_EVENT.KeyDown, {
    key: KEYBOARD_KEY.K,
    metaKey: true,
  });

  window.dispatchEvent(event);
}

describe('use-app', () => {
  it('returns the initial app view model', () => {
    const { result } = renderHook(useApp);

    expect(result.current.derived.commands).toBe(COMMANDS);
    expect(result.current.state.commandPaletteOpen).toBe(false);
    expect(result.current.state.selectedCommand).toBe(COMMANDS[0]);
    expect(result.current.actions.onOpenCommandPalette).toEqual(expect.any(Function));
    expect(result.current.actions.onSelectCommand).toEqual(expect.any(Function));
    expect(result.current.actions.setCommandPaletteOpen).toEqual(expect.any(Function));
  });

  it('opens the command palette', () => {
    const { result } = renderHook(useApp);

    act(() => {
      result.current.actions.onOpenCommandPalette();
    });

    expect(result.current.state.commandPaletteOpen).toBe(true);
  });

  it('sets the command palette open state', () => {
    const { result } = renderHook(useApp);

    act(() => {
      result.current.actions.setCommandPaletteOpen(true);
    });

    expect(result.current.state.commandPaletteOpen).toBe(true);

    act(() => {
      result.current.actions.setCommandPaletteOpen(false);
    });

    expect(result.current.state.commandPaletteOpen).toBe(false);
  });

  it('selects a command', () => {
    const { result } = renderHook(useApp);

    act(() => {
      result.current.actions.onSelectCommand(COMMANDS[1]);
    });

    expect(result.current.state.selectedCommand).toBe(COMMANDS[1]);
  });

  it('toggles the command palette from the keyboard shortcut', () => {
    const { result } = renderHook(useApp);

    act(() => {
      dispatchCommandPaletteShortcut();
    });

    expect(result.current.state.commandPaletteOpen).toBe(true);

    act(() => {
      dispatchCommandPaletteShortcut();
    });

    expect(result.current.state.commandPaletteOpen).toBe(false);
  });
});
