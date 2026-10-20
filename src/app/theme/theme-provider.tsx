import { createContext, useContext, useState } from 'react';
import { THEME, readThemePreference, THEME_STORAGE_KEY } from './theme';
import { useDocumentTheme, useSystemDarkMode, useThemePreferenceSync } from './hooks';

import type { PropsWithChildren } from 'react';
import type { ThemePreference } from './theme';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  preference?: ThemePreference;
  persist?: boolean;
}>;

export function ThemeProvider({ children, persist = true, preference }: ThemeProviderProps) {
  const [selectedPreference, setSelectedPreference] = useState(
    () => preference ?? (persist ? readThemePreference() : THEME.System),
  );

  const systemDark = useSystemDarkMode();
  useThemePreferenceSync(preference, setSelectedPreference);
  useDocumentTheme(selectedPreference, systemDark);

  const setPreference = (nextPreference: ThemePreference) => {
    setSelectedPreference(nextPreference);

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
      } catch {
        // Theme switching still works when browser storage is unavailable.
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ preference: selectedPreference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
