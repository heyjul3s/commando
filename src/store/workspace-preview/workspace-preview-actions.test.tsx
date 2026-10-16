import { createStore } from 'zustand';
import { COMMANDS } from '../../constants';
import { workspacePreviewActions } from './workspace-preview-actions';
import { workspacePreviewDefaultValues } from './workspace-preview-default-values';
import { RECENT_COMMAND_LIMIT } from './workspace-preview-constants';

import type { WorkspacePreviewStore } from './workspace-preview-context';

function createTestStore() {
  return createStore<WorkspacePreviewStore>((set, get) => ({
    ...workspacePreviewDefaultValues,
    recentCommandIds: [],
    actions: workspacePreviewActions(set, get),
  }));
}

describe('workspacePreviewActions', () => {
  it('selects a command and adds it to the recent commands list', () => {
    const store = createTestStore();

    store.getState().actions.setSelectedCommand(COMMANDS[1]);

    expect(store.getState().selectedCommand).toEqual(COMMANDS[1]);
    expect(store.getState().recentCommandIds).toEqual([COMMANDS[1].id]);
  });

  it('moves and existing command to the front without duplicates', () => {
    const store = createTestStore();
    const { setSelectedCommand } = store.getState().actions;

    setSelectedCommand(COMMANDS[1]);
    setSelectedCommand(COMMANDS[2]);
    setSelectedCommand(COMMANDS[1]);

    expect(store.getState().recentCommandIds).toEqual([COMMANDS[1].id, COMMANDS[2].id]);
  });

  it('limits the recent commands list to the most recent 6 commands', () => {
    const store = createTestStore();
    const commands = COMMANDS.slice(0, RECENT_COMMAND_LIMIT + 1); // Get more than the limit

    commands.forEach((command) => {
      store.getState().actions.setSelectedCommand(command);
    });

    expect(store.getState().recentCommandIds).toEqual(
      commands
        .slice(1)
        .reverse()
        .map((command) => command.id),
    );
  });

  it('preserves state when the selected is already the most recent', () => {
    const store = createTestStore();
    store.getState().actions.setSelectedCommand(COMMANDS[1]);

    const previousState = store.getState();

    store.getState().actions.setSelectedCommand(COMMANDS[1]);

    expect(store.getState()).toEqual(previousState);
  });

  it('clears history while preserving the selected command', () => {
    const store = createTestStore();
    store.getState().actions.setSelectedCommand(COMMANDS[1]);
    store.getState().actions.clearRecentCommands();

    expect(store.getState().recentCommandIds).toEqual([]);
    expect(store.getState().selectedCommand).toEqual(COMMANDS[1]);
  });

  it('preserves state when history is already empty', () => {
    const store = createTestStore();
    const previousState = store.getState();

    store.getState().actions.clearRecentCommands();

    expect(store.getState()).toEqual(previousState);
  });
});
