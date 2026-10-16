import { renderHook } from '@testing-library/react';
import { CommandPaletteProvider } from './command-palette-provider';
import { useCommandPaletteStore } from './use-command-palette-store';

describe('useCommandPaletteStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the store supplied by the provider', () => {
    const { result } = renderHook(() => useCommandPaletteStore(), {
      wrapper: ({ children }) => (
        <CommandPaletteProvider initialValues={{ isOpen: false }}>
          {children}
        </CommandPaletteProvider>
      ),
    });

    expect(result.current.getState().isOpen).toBe(false);
    expect(result.current.getState().actions).toBeDefined();
  });

  it('throws an error when used outside of a provider', () => {
    expect(() => renderHook(() => useCommandPaletteStore())).toThrow(
      'useCommandPaletteStore must be used within a CommandPaletteProvider',
    );
  });
});
