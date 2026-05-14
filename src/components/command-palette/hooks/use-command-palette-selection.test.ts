import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import { COMMANDS } from '../../../constants/commands';
import { useCommandPaletteSelection } from './use-command-palette-selection';

describe('use-command-palette-selection', () => {
  it('starts with the first command active', () => {
    const { result } = renderHook(() =>
      useCommandPaletteSelection({
        commands: COMMANDS,
        onSelect: vi.fn(),
      }),
    );

    expect(result.current.state.activeIndex).toBe(0);
    expect(result.current.derived.activeCommand).toBe(COMMANDS[0]);
  });

  it('activates the next command and wraps to the first command', () => {
    const { result } = renderHook(() =>
      useCommandPaletteSelection({
        commands: COMMANDS,
        onSelect: vi.fn(),
      }),
    );

    act(() => {
      result.current.actions.setActiveIndex(COMMANDS.length - 1);
    });

    act(() => {
      result.current.actions.activateNextCommand();
    });

    expect(result.current.state.activeIndex).toBe(0);
  });

  it('activates the previous command and wraps to the last command', () => {
    const { result } = renderHook(() =>
      useCommandPaletteSelection({
        commands: COMMANDS,
        onSelect: vi.fn(),
      }),
    );

    act(() => {
      result.current.actions.activatePreviousCommand();
    });

    expect(result.current.state.activeIndex).toBe(COMMANDS.length - 1);
  });

  it('selects the active command', () => {
    const onSelect = vi.fn();
    const { result } = renderHook(() =>
      useCommandPaletteSelection({
        commands: COMMANDS,
        onSelect,
      }),
    );

    act(() => {
      result.current.actions.selectActiveCommand();
    });

    expect(onSelect).toHaveBeenCalledWith(COMMANDS[0]);
  });

  it('resets selection to the first command', () => {
    const { result } = renderHook(() =>
      useCommandPaletteSelection({
        commands: COMMANDS,
        onSelect: vi.fn(),
      }),
    );

    act(() => {
      result.current.actions.setActiveIndex(2);
    });

    act(() => {
      result.current.actions.resetSelection();
    });

    expect(result.current.state.activeIndex).toBe(0);
  });
});
