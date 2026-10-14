import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { COMMANDS } from '../../../constants';
import { useCommandPaletteSearch } from './use-command-palette-search';

describe('use-command-palette-search', () => {
  it('returns all commands when query is empty', () => {
    const { result } = renderHook(() => useCommandPaletteSearch({ commands: COMMANDS }));

    expect(result.current.state.query).toBe('');
    expect(result.current.derived.filteredCommands).toEqual(COMMANDS);
  });

  it('filters commands by label or group', () => {
    const { result } = renderHook(() => useCommandPaletteSearch({ commands: COMMANDS }));

    act(() => {
      result.current.actions.setQuery('settings');
    });

    expect(result.current.derived.filteredCommands).toEqual(
      COMMANDS.filter((command) =>
        `${command.label} ${command.group}`.toLowerCase().includes('settings'),
      ),
    );
  });

  it('groups filtered commands by command group', () => {
    const { result } = renderHook(() => useCommandPaletteSearch({ commands: COMMANDS }));

    expect(result.current.derived.groupedCommands.Navigation).toEqual(
      COMMANDS.filter((command) => command.group === 'Navigation'),
    );
  });

  it('resets the search query', () => {
    const { result } = renderHook(() => useCommandPaletteSearch({ commands: COMMANDS }));

    act(() => {
      result.current.actions.setQuery('docs');
    });

    act(() => {
      result.current.actions.resetSearch();
    });

    expect(result.current.state.query).toBe('');
  });
});
