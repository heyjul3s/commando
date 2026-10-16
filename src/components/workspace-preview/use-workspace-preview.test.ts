import { act, renderHook } from '@testing-library/react';
import { COMMANDS } from '../../constants';
import { WorkspacePreviewProvider, useWorkspacePreviewStore } from '../../store/workspace-preview';
import { useWorkspacePreview } from './use-workspace-preview';

describe('use-workspace-preview', () => {
  beforeEach(() => localStorage.clear());

  it('returns the selected command and responds to selection updates', () => {
    const { result } = renderHook(
      () => ({
        preview: useWorkspacePreview(),
        store: useWorkspacePreviewStore(),
      }),
      { wrapper: WorkspacePreviewProvider },
    );
    expect(result.current.preview.state.selectedCommand).toBe(COMMANDS[0]);

    act(() => result.current.store.getState().actions.setSelectedCommand(COMMANDS[1]));

    expect(result.current.preview.state.selectedCommand).toBe(COMMANDS[1]);
  });

  it('does not rerender for history-only updates', () => {
    const { result } = renderHook(
      () => ({
        preview: useWorkspacePreview(),
        store: useWorkspacePreviewStore(),
      }),
      { wrapper: WorkspacePreviewProvider },
    );
    const previous = result.current;

    act(() => result.current.store.setState({ recentCommandIds: [COMMANDS[1].id] }));

    expect(result.current).toBe(previous);
  });
});
