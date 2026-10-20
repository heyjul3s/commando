import { useEffect, useState } from 'react';
import { SYSTEM_THEME_QUERY } from '../theme';

export function useSystemDarkMode() {
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.(SYSTEM_THEME_QUERY).matches ?? false,
  );

  useEffect(() => {
    const media = window.matchMedia?.(SYSTEM_THEME_QUERY);

    if (!media) {
      return;
    }

    function handleChange(event: MediaQueryListEvent) {
      setSystemDark(event.matches);
    }

    setSystemDark(media.matches);
    media.addEventListener('change', handleChange);

    return () => media.removeEventListener('change', handleChange);
  }, []);

  return systemDark;
}
