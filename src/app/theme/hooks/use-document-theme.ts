import { useEffect } from 'react';
import { resolveTheme } from '../theme';
import type { ThemePreference } from '../theme';

export function useDocumentTheme(preference: ThemePreference, systemDark: boolean) {
  useEffect(() => {
    document.documentElement.dataset.theme = resolveTheme(preference, systemDark);
  }, [preference, systemDark]);
}
