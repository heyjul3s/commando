import { act, renderHook } from '@testing-library/react';
import { COMMANDS } from '../constants';
import { useCommandPaletteStore } from '../store/command-palette';
import { useWorkspacePreviewStore } from '../store/workspace-preview';
import { ContextProviders } from './context-providers';

describe('context-providers', () => {
  beforeEach(() => localStorage.clear());

  it('preserves both stores and their state when the providers rerender', () => {
    const { result, rerender } = renderHook(
      () => ({
        palette: useCommandPaletteStore(),
        workspace: useWorkspacePreviewStore(),
      }),
      { wrapper: ContextProviders },
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
