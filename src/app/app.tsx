import { CommandPalette } from '../features/command-palette';
import { useCommandPaletteShortcut } from './use-command-palette-shortcut';
import { WorkspacePreview } from '../features/workspace-preview';
import { AppProviders } from './providers';
import { useCommandPaletteStore } from '../features/command-palette/store';
import styles from './app.module.css';

export function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

function AppContent() {
  useCommandPaletteShortcut();
  const palette = useCommandPaletteStore();
  const isOpen = palette.use.isOpen();

  return (
    <>
      <main className={styles.app} inert={isOpen}>
        <WorkspacePreview />
      </main>
      <CommandPalette />
    </>
  );
}
