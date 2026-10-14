import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import { COMMANDS, DOM_EVENT, KEYBOARD_KEY } from '../../../constants';
import { useCommandPalette } from './use-command-palette';

import type { Command } from '../../../constants';

type UseCommandPaletteProps = {
  commands: Command[];
  onOpenChange: (open: boolean) => void;
  onSelect: (command: Command) => void;
  open: boolean;
};

function setup(overrides: Partial<UseCommandPaletteProps> = {}) {
  const props = {
    commands: COMMANDS,
    onOpenChange: vi.fn(),
    onSelect: vi.fn(),
    open: true,
    ...overrides,
  };

  const hook = renderHook((hookProps: UseCommandPaletteProps) => useCommandPalette(hookProps), {
    initialProps: props,
  });

  return {
    ...hook,
    props,
  };
}

function dispatchKeyDown(key: string) {
  window.dispatchEvent(
    new KeyboardEvent(DOM_EVENT.KeyDown, {
      cancelable: true,
      key,
    }),
  );
}

describe('use-command-palette', () => {
  it('returns the initial command palette view model', () => {
    const { result } = setup();

    expect(result.current.state.query).toBe('');
    expect(result.current.state.activeIndex).toBe(0);
    expect(result.current.derived.filteredCommands).toBe(COMMANDS);
    expect(result.current.derived.groupedCommands.Navigation).toEqual(
      COMMANDS.filter((command) => command.group === 'Navigation'),
    );
    expect(result.current.actions.closeCommandPalette).toEqual(expect.any(Function));
    expect(result.current.actions.selectCommand).toEqual(expect.any(Function));
    expect(result.current.actions.setActiveIndex).toEqual(expect.any(Function));
    expect(result.current.actions.setQuery).toEqual(expect.any(Function));
  });

  it('filters commands when the query changes', () => {
    const { result } = setup();

    act(() => {
      result.current.actions.setQuery('dashboard');
    });

    expect(result.current.state.query).toBe('dashboard');
    expect(result.current.derived.filteredCommands).toEqual([
      expect.objectContaining({
        id: 'dashboard',
      }),
    ]);
  });

  it('selects a command and closes the palette', () => {
    const { props, result } = setup();

    act(() => {
      result.current.actions.selectCommand(COMMANDS[1]);
    });

    expect(props.onSelect).toHaveBeenCalledWith(COMMANDS[1]);
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes the palette', () => {
    const { props, result } = setup();

    act(() => {
      result.current.actions.closeCommandPalette();
    });

    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('selects the active command from the keyboard', () => {
    const { props } = setup();

    act(() => {
      dispatchKeyDown(KEYBOARD_KEY.ArrowDown);
    });

    act(() => {
      dispatchKeyDown(KEYBOARD_KEY.Enter);
    });

    expect(props.onSelect).toHaveBeenCalledWith(COMMANDS[1]);
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('resets search and selection when the palette closes', () => {
    const { props, rerender, result } = setup();

    act(() => {
      result.current.actions.setQuery('dashboard');
      result.current.actions.setActiveIndex(1);
    });

    rerender({
      ...props,
      open: false,
    });

    expect(result.current.state.query).toBe('');
    expect(result.current.state.activeIndex).toBe(0);
  });
});
