import { useCallback, useMemo, useState } from 'react';

import type { Command } from '../../../constants/commands';

type UseCommandPaletteSearchProps = {
  commands: Command[];
};

export function useCommandPaletteSearch({ commands }: UseCommandPaletteSearchProps) {
  const [query, setQuery] = useState('');

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commands;
    }

    return commands.filter((command) => {
      const searchableText = `${command.label} ${command.group}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [commands, query]);

  const groupedCommands = useMemo(() => {
    return filteredCommands.reduce<Record<string, Command[]>>((groups, command) => {
      groups[command.group] = groups[command.group] ?? [];
      groups[command.group].push(command);
      return groups;
    }, {});
  }, [filteredCommands]);

  const resetSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    actions: {
      resetSearch,
      setQuery,
    },
    derived: {
      filteredCommands,
      groupedCommands,
    },
    state: {
      query,
    },
  };
}
