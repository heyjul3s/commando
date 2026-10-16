import { renderHook } from '@testing-library/react';
import { CommandPaletteProvider } from './command-palette-context';
import { useCommandPaletteStore } from './use-command-palette-store';

describe('commandPaletteContext', () => {
  it('override the default state with initial values', () => {
    const { result } = renderHook(() => useCommandPaletteStore(), {
      wrapper: ({ children }) => (
        <CommandPaletteProvider initialValues={{ isOpen: true }}>{children}</CommandPaletteProvider>
      ),
    });

    expect(result.current.getState().isOpen).toBe(true);
  });

  it('preserves the same store across rerenders', () => {
    const { result, rerender } = renderHook(() => useCommandPaletteStore(), {
      wrapper: ({ children }) => (
        <CommandPaletteProvider initialValues={{ isOpen: true }}>{children}</CommandPaletteProvider>
      ),
    });

    const originalStore = result.current;

    rerender();

    expect(result.current).toBe(originalStore);
  });

  it('creates an independent store for each provider', () => {
    const { result: firstStore } = renderHook(() => useCommandPaletteStore(), {
      wrapper: ({ children }) => <CommandPaletteProvider>{children}</CommandPaletteProvider>,
    });

    const { result: secondStore } = renderHook(() => useCommandPaletteStore(), {
      wrapper: ({ children }) => <CommandPaletteProvider>{children}</CommandPaletteProvider>,
    });

    firstStore.current.setState({ isOpen: true });

    expect(firstStore.current.getState().isOpen).toBe(true);
    expect(secondStore.current.getState().isOpen).toBe(false);
  });
});
