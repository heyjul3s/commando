import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ThemePreference } from '../theme';

export function useThemePreferenceSync(
  preference: ThemePreference | undefined,
  setSelectedPreference: Dispatch<SetStateAction<ThemePreference>>,
) {
  useEffect(() => {
    if (preference !== undefined) {
      setSelectedPreference(preference);
    }
  }, [preference, setSelectedPreference]);
}
