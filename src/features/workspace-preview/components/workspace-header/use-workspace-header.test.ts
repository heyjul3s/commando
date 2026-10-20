import { act, renderHook } from '@testing-library/react';
import { useCommandPaletteStore } from '../../../command-palette/store';
import { AppProviders } from '../../../../app/providers/app-providers';
import { useWorkspaceHeader } from './use-workspace-header';

describe('use-workspace-header', () => {
  it('opens the palette and leaves it open on repeated activation', () => {
    const { result } = renderHook(
      () => ({
        header: useWorkspaceHeader(),
        palette: useCommandPaletteStore(),
      }),
      { wrapper: AppProviders },
    );

    expect(result.current.palette.getState().isOpen).toBe(false);
    act(() => result.current.header.actions.onOpenCommandPalette());
    expect(result.current.palette.getState().isOpen).toBe(true);
    act(() => result.current.header.actions.onOpenCommandPalette());
    expect(result.current.palette.getState().isOpen).toBe(true);
  });
});
