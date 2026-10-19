import { useEffect } from 'react';
import { useCommandPaletteStore } from '../../../store';

export function useCommandPaletteLifecycle() {
  const palette = useCommandPaletteStore();
  const open = palette.use.isOpen();
  const { setActiveIndex, setQuery } = palette.use.actions();

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open, setQuery, setActiveIndex]);
}
