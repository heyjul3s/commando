import { useEffect, useRef } from 'react';

import { useCommandPaletteStore } from '../../store';

import type { ChangeEvent } from 'react';

export function useSearchBar() {
  const store = useCommandPaletteStore();
  const query = store.use.query();
  const { setQuery, closeCommandPalette } = store.use.actions();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return {
    state: { query },
    actions: { onQueryChange: handleQueryChange, onCloseCommandPalette: closeCommandPalette },
    refs: { inputRef },
  };
}
