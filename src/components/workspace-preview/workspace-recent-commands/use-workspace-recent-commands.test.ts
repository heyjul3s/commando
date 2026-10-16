import { act, renderHook } from '@testing-library/react';
import { COMMANDS } from '../../../constants';
import {
  WorkspacePreviewProvider,
  useWorkspacePreviewStore,
} from '../../../store/workspace-preview';
import { useWorkspaceRecentCommands } from './use-workspace-recent-commands';

function setup() {
  return renderHook(
    () => ({
      recent: useWorkspaceRecentCommands(),
      store: useWorkspacePreviewStore(),
    }),
    { wrapper: WorkspacePreviewProvider },
  );
}

describe('use-workspace-recent-commands', () => {
  beforeEach(() => localStorage.clear());

  it('starts with empty history', () => {
    const { result } = setup();
    expect(result.current.recent.derived.recentCommands).toEqual([]);
    expect(result.current.recent.derived.isEmptyRecentCommands).toBe(true);
  });

  it('derives commands in most recent order from store updates', () => {
    const { result } = setup();
    act(() => {
      result.current.store.getState().actions.setSelectedCommand(COMMANDS[1]);
      result.current.store.getState().actions.setSelectedCommand(COMMANDS[2]);
    });
    expect(result.current.recent.derived.recentCommands).toEqual([COMMANDS[2], COMMANDS[1]]);
    expect(result.current.recent.derived.isEmptyRecentCommands).toBe(false);
  });

  it('ignores unknown IDs while preserving valid command order', () => {
    const { result } = setup();
    act(() => result.current.store.setState({ recentCommandIds: ['missing', COMMANDS[1].id] }));
    expect(result.current.recent.derived.recentCommands).toEqual([COMMANDS[1]]);
  });

  it('clears history without clearing the selected command', () => {
    const { result } = setup();
    act(() => result.current.store.getState().actions.setSelectedCommand(COMMANDS[1]));
    act(() => result.current.recent.actions.onClearRecentCommands());
    expect(result.current.recent.derived.recentCommands).toEqual([]);
    expect(result.current.recent.derived.isEmptyRecentCommands).toBe(true);
    expect(result.current.store.getState().selectedCommand).toBe(COMMANDS[1]);
  });
});
