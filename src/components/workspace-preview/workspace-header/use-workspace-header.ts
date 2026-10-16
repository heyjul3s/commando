import { useCommandPaletteStore } from '../../../store/command-palette';

export function useWorkspaceHeader() {
  const palette = useCommandPaletteStore();
  const { setIsOpen } = palette.use.actions();

  const handleOpenCommandPalette = () => {
    setIsOpen(true);
  };

  return { actions: { onOpenCommandPalette: handleOpenCommandPalette } };
}
