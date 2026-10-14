import { useCallback, useEffect, useState } from 'react';

import { COMMANDS, STORAGE_KEYS } from '../../../constants';
import { storage } from '../../../utils';

import type { Command } from '../../../constants';

const RECENT_COMMAND_LIMIT = 6;

export function useAppState() {
  const [open, setOpen] = useState(false);
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>(() =>
    storage.local.getJsonItem(STORAGE_KEYS.RecentCommandIds, []),
  );
  const [selectedCommand, setSelectedCommand] = useState<Command>(COMMANDS[0]);

  const openCommandPalette = useCallback(() => {
    setOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const selectCommand = useCallback((command: Command) => {
    setSelectedCommand(command);

    setRecentCommandIds((current) => {
      const dedupedRecentCommands = current.filter((id) => id !== command.id);
      return [command.id, ...dedupedRecentCommands].slice(0, RECENT_COMMAND_LIMIT);
    });
  }, []);

  const clearRecentCommands = useCallback(() => {
    setRecentCommandIds(() => {
      storage.local.setJsonItem(STORAGE_KEYS.RecentCommandIds, []);
      return [];
    });
  }, []);

  useEffect(() => {
    storage.local.setJsonItem(STORAGE_KEYS.RecentCommandIds, recentCommandIds);
  }, [recentCommandIds]);

  return {
    values: {
      open,
      selectedCommand,
      recentCommandIds,
    },
    actions: {
      closeCommandPalette,
      clearRecentCommands,
      openCommandPalette,
      selectCommand,
      setOpen,
      toggleCommandPalette,
    },
  };
}
