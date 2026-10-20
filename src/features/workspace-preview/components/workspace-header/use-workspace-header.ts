import { useCommandPaletteStore } from '../../../command-palette/store';
import { useTheme } from '../../../../app/theme/theme-provider';
import { isThemePreference } from '../../../../app/theme/theme';

import type { ChangeEvent } from 'react';

export function useWorkspaceHeader() {
  const palette = useCommandPaletteStore();

  const { setIsOpen } = palette.use.actions();
  const { preference, setPreference } = useTheme();

  function handleOpenCommandPalette() {
    setIsOpen(true);
  }

  function handleThemeChange(event: ChangeEvent<HTMLSelectElement>) {
    if (isThemePreference(event.target.value)) {
      setPreference(event.target.value);
    }
  }

  return {
    actions: {
      onOpenCommandPalette: handleOpenCommandPalette,
      onThemeChange: handleThemeChange,
    },
    state: {
      themePreference: preference,
    },
  };
}
