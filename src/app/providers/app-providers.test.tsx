import { act, renderHook } from '@testing-library/react';
import { COMMANDS } from '../../shared/constants';
import { useCommandPaletteStore } from '../../features/command-palette/store';
import { useWorkspacePreviewStore } from '../../features/workspace-preview/store';
import { AppProviders } from './app-providers';

describe('app-providers', () => {
  beforeEach(() => localStorage.clear());

  it('preserves both stores and their state when the providers rerender', () => {
    const { result, rerender } = renderHook(
      () => ({
        palette: useCommandPaletteStore(),
        workspace: useWorkspacePreviewStore(),
      }),
      { wrapper: AppProviders },
    );
    const originalPalette = result.current.palette;
    const originalWorkspace = result.current.workspace;

    act(() => {
      originalPalette.getState().actions.setIsOpen(true);
      originalPalette.getState().actions.setQuery('projects');
      originalWorkspace.getState().actions.setSelectedCommand(COMMANDS[1]);
    });

    rerender();

    expect(result.current.palette).toBe(originalPalette);
    expect(result.current.workspace).toBe(originalWorkspace);
    expect(result.current.palette.getState().isOpen).toBe(true);
    expect(result.current.palette.getState().query).toBe('projects');
    expect(result.current.workspace.getState().selectedCommand).toBe(COMMANDS[1]);
    expect(result.current.workspace.getState().recentCommandIds).toEqual([COMMANDS[1].id]);
  });
});
