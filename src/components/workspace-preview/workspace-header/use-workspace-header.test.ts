import { act, renderHook } from '@testing-library/react';
import { CommandPaletteProvider, useCommandPaletteStore } from '../../../store/command-palette';
import { useWorkspaceHeader } from './use-workspace-header';

describe('use-workspace-header', () => {
  it('opens the palette and leaves it open on repeated activation', () => {
    const { result } = renderHook(
      () => ({
        header: useWorkspaceHeader(),
        palette: useCommandPaletteStore(),
      }),
      { wrapper: CommandPaletteProvider },
    );

    expect(result.current.palette.getState().isOpen).toBe(false);
    act(() => result.current.header.actions.onOpenCommandPalette());
    expect(result.current.palette.getState().isOpen).toBe(true);
    act(() => result.current.header.actions.onOpenCommandPalette());
    expect(result.current.palette.getState().isOpen).toBe(true);
  });
});
