import { act, renderHook } from '@testing-library/react';
import { COMMANDS, STORAGE_KEYS } from '../../constants';
import { WorkspacePreviewProvider } from './workspace-preview-context';
import { useWorkspacePreviewStore } from './use-workspace-preview-store';

describe('workspacePreviewContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists recent IDs without serialising commands or actions', () => {
    const { result } = renderHook(() => useWorkspacePreviewStore(), {
      wrapper: WorkspacePreviewProvider,
    });

    act(() => {
      result.current.getState().actions.setSelectedCommand(COMMANDS[1]);
    });

    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.WorkspacePreview)!)).toEqual({
      state: { recentCommandIds: [COMMANDS[1].id] },
      version: 0,
    });
  });

  it('restores history in a new provider while preserving defaults and actions', () => {
    localStorage.setItem(
      STORAGE_KEYS.WorkspacePreview,
      JSON.stringify({ state: { recentCommandIds: [COMMANDS[1].id] }, version: 0 }),
    );

    const { result } = renderHook(() => useWorkspacePreviewStore(), {
      wrapper: WorkspacePreviewProvider,
    });

    expect(result.current.getState().recentCommandIds).toEqual([COMMANDS[1].id]);
    expect(result.current.getState().selectedCommand).toBe(COMMANDS[0]);
    expect(result.current.getState().actions.clearRecentCommands).toEqual(expect.any(Function));
  });

  it('clears history in memory and storage without clearing the selected command', () => {
    const { result } = renderHook(() => useWorkspacePreviewStore(), {
      wrapper: WorkspacePreviewProvider,
    });

    act(() => {
      result.current.getState().actions.setSelectedCommand(COMMANDS[1]);
      result.current.getState().actions.clearRecentCommands();
    });

    expect(result.current.getState().recentCommandIds).toEqual([]);
    expect(result.current.getState().selectedCommand).toBe(COMMANDS[1]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.WorkspacePreview)!)).toEqual({
      state: { recentCommandIds: [] },
      version: 0,
    });
  });
});
