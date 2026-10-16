import { CommandPalette } from '../features/command-palette';
import { useCommandPaletteShortcut } from './use-command-palette-shortcut';
import { WorkspacePreview } from '../features/workspace-preview';
import { AppProviders } from './providers';
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

  return (
    <main className={styles.app}>
      <WorkspacePreview />
      <CommandPalette />
    </main>
  );
}
