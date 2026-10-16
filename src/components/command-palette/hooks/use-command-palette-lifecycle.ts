import { useEffect } from 'react';
import { useCommandPaletteStore } from '../../../store/command-palette';

export function useCommandPaletteLifecycle() {
  const palette = useCommandPaletteStore();
  const open = palette.use.isOpen();
  const { setQuery, setActiveIndex } = palette.use.actions();

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open, setQuery, setActiveIndex]);
}
