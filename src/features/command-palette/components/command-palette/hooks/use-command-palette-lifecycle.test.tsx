import { act, renderHook } from '@testing-library/react';
import { CommandPaletteProvider, useCommandPaletteStore } from '../../../store';
import { useCommandPaletteLifecycle } from './use-command-palette-lifecycle';

function setup(open: boolean) {
  return renderHook(
    () => {
      useCommandPaletteLifecycle();
      return useCommandPaletteStore();
    },
    {
      wrapper: ({ children }) => (
        <CommandPaletteProvider initialValues={{ activeIndex: 2, isOpen: open, query: 'docs' }}>
          {children}
        </CommandPaletteProvider>
      ),
    },
  );
}

describe('use-command-palette-lifecycle', () => {
  it('resets search and selection when initially closed', () => {
    const { result } = setup(false);
    expect(result.current.getState().query).toBe('');
    expect(result.current.getState().activeIndex).toBe(0);
  });

  it('preserves search and selection while open', () => {
    const { rerender, result } = setup(true);
    rerender();
    expect(result.current.getState().query).toBe('docs');
    expect(result.current.getState().activeIndex).toBe(2);
  });

  it('resets search and selection when the store closes the palette', () => {
    const { result } = setup(true);
    act(() => result.current.getState().actions.closeCommandPalette());
    expect(result.current.getState().query).toBe('');
    expect(result.current.getState().activeIndex).toBe(0);
  });
});
