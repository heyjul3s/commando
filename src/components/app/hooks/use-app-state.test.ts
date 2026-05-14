import { act, renderHook } from '@testing-library/react';
import { COMMANDS } from '../../../constants/commands';
import { useAppState } from './use-app-state';

describe('use-app-state', () => {
  it('returns the initial app state', () => {
    const { result } = renderHook(useAppState);

    expect(result.current.values.open).toBe(false);
    expect(result.current.values.selectedCommand).toBe(COMMANDS[0]);
  });

  it('opens and closes the command palette', () => {
    const { result } = renderHook(useAppState);

    act(() => {
      result.current.actions.openCommandPalette();
    });

    expect(result.current.values.open).toBe(true);

    act(() => {
      result.current.actions.closeCommandPalette();
    });

    expect(result.current.values.open).toBe(false);
  });

  it('toggles the command palette', () => {
    const { result } = renderHook(useAppState);

    act(() => {
      result.current.actions.toggleCommandPalette();
    });

    expect(result.current.values.open).toBe(true);

    act(() => {
      result.current.actions.toggleCommandPalette();
    });

    expect(result.current.values.open).toBe(false);
  });

  it('selects a command', () => {
    const { result } = renderHook(useAppState);

    act(() => {
      result.current.actions.selectCommand(COMMANDS[1]);
    });

    expect(result.current.values.selectedCommand).toBe(COMMANDS[1]);
  });
});
