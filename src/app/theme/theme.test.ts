import {
  THEME,
  isThemePreference,
  readThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
} from './theme';

describe('theme preference', () => {
  beforeEach(() => localStorage.clear());

  it('uses the system appearance only for System', () => {
    expect(resolveTheme(THEME.System, true)).toBe(THEME.Dark);
    expect(resolveTheme(THEME.System, false)).toBe(THEME.Light);
    expect(resolveTheme(THEME.Light, true)).toBe(THEME.Light);
    expect(resolveTheme(THEME.Dark, false)).toBe(THEME.Dark);
  });

  it('falls back to System for missing or invalid stored values', () => {
    expect(readThemePreference()).toBe(THEME.System);
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
    expect(readThemePreference()).toBe(THEME.System);
    expect(isThemePreference('invalid')).toBe(false);
  });

  it('reads an explicit saved preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, THEME.Dark);
    expect(readThemePreference()).toBe(THEME.Dark);
  });
});
