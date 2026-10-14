import { CommandPalette } from '../command-palette';
import { useApp } from './hooks/use-app';
import { WorkspacePreview } from '../workspace-preview';
import styles from './app.module.css';

export function App() {
  const app = useApp();

  return (
    <main className={styles.app}>
      <WorkspacePreview
        recentCommands={app.derived.recentCommands}
        selectedCommand={app.state.selectedCommand}
        onClearRecentCommands={app.actions.clearRecentCommands}
        onOpenCommandPalette={app.actions.onOpenCommandPalette}
      />

      <CommandPalette
        commands={app.derived.commands}
        open={app.state.commandPaletteOpen}
        onOpenChange={app.actions.setCommandPaletteOpen}
        onSelect={app.actions.onSelectCommand}
      />
    </main>
  );
}
