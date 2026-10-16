import { act, renderHook } from '@testing-library/react';
import { COMMANDS } from '../../../constants';
import { ContextProviders } from '../../../context-providers/context-providers';
import { useCommandPaletteStore } from '../../../store/command-palette';
import { useWorkspacePreviewStore } from '../../../store/workspace-preview';
import { useAvailableCommands } from './use-available-commands';

function setup() {
  return renderHook(
    () => ({
      list: useAvailableCommands(),
      palette: useCommandPaletteStore(),
      workspace: useWorkspacePreviewStore(),
    }),
    { wrapper: ContextProviders },
  );
}

describe('use-available-commands', () => {
  beforeEach(() => localStorage.clear());

  it('filters and groups commands from the shared query', () => {
    const { result } = setup();
    expect(result.current.list.derived.filteredCommands).toHaveLength(COMMANDS.length);
    act(() => result.current.palette.getState().actions.setQuery('  DOCUMENTATION  '));
    expect(result.current.list.derived.filteredCommands.map((command) => command.id)).toEqual([
      'docs',
    ]);
    expect(result.current.list.derived.groupedCommands.Navigation).toEqual([COMMANDS[2]]);
  });

  it('shares selection with the store and resets it when query changes', () => {
    const { result } = setup();
    const handlers = result.current.list.actions.getCommandHandlers(COMMANDS[2], 2);
    act(() => handlers.onMouseEnter());
    expect(result.current.palette.getState().activeIndex).toBe(2);
    act(() => result.current.palette.getState().actions.setQuery('settings'));
    expect(result.current.list.state.activeIndex).toBe(0);
  });

  it('selects a command, updates history, and closes the palette', () => {
    const { result } = setup();
    act(() => result.current.palette.getState().actions.setIsOpen(true));
    const handlers = result.current.list.actions.getCommandHandlers(COMMANDS[1], 1);
    act(() => handlers.onClick());
    expect(result.current.workspace.getState().selectedCommand).toBe(COMMANDS[1]);
    expect(result.current.workspace.getState().recentCommandIds).toEqual([COMMANDS[1].id]);
    expect(result.current.palette.getState().isOpen).toBe(false);
  });

  it('returns empty groups when nothing matches', () => {
    const { result } = setup();
    act(() => result.current.palette.getState().actions.setQuery('no matching commands'));
    expect(result.current.list.derived.filteredCommands).toEqual([]);
    expect(result.current.list.derived.groupedCommands).toEqual({});
  });
});
