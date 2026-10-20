export const THEME = {
  Dark: 'dark',
  Light: 'light',
  System: 'system',
} as const;

export type ThemePreference = (typeof THEME)[keyof typeof THEME];
export type Theme = Exclude<ThemePreference, typeof THEME.System>;

export const THEME_STORAGE_KEY = 'cmd-palette-theme';
export const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === THEME.Light || value === THEME.Dark || value === THEME.System;
}

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    return isThemePreference(stored) ? stored : THEME.System;
  } catch {
    return THEME.System;
  }
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): Theme {
  if (preference === THEME.System) {
    return systemDark ? THEME.Dark : THEME.Light;
  }

  return preference;
}
