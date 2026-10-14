import { WorkspacePreviewSidebar } from './workspace-preview-sidebar';
import { WorkspaceRecentCommands } from './workspace-recent-commands';
import { WorkspaceHeader } from './workspace-header';

import styles from './workspace-preview.module.css';

import type { Command, Commands } from '../../constants';

type WorkspacePreviewProps = {
  recentCommands: Commands;
  selectedCommand: Command;
  onClearRecentCommands: () => void;
  onOpenCommandPalette: () => void;
};

export function WorkspacePreview({
  recentCommands,
  selectedCommand,
  onClearRecentCommands,
  onOpenCommandPalette,
}: WorkspacePreviewProps) {
  return (
    <section
      className={styles['workspace-preview']}
      aria-label="Command palette component showcase"
    >
      <WorkspacePreviewSidebar />

      <div className={styles['workspace-preview__workspace']}>
        <WorkspaceHeader onOpenCommandPalette={onOpenCommandPalette} />

        <div className={styles['workspace-preview__content-grid']}>
          <section
            className={styles['workspace-preview__primary-panel']}
            aria-label="Selected command"
          >
            <p className={styles['workspace-preview__panel-label']}>Last selected</p>

            <h2 className={styles['workspace-preview__command-heading']}>
              <span className={styles['workspace-preview__primary-panel-icon']}>
                <selectedCommand.icon size={20} aria-hidden="true" />
              </span>
              <span>{selectedCommand.label}</span>
            </h2>
            <p>A single command palette UI component demo</p>
          </section>

          <WorkspaceRecentCommands
            onClearRecentCommands={onClearRecentCommands}
            recentCommands={recentCommands}
          />
        </div>
      </div>
    </section>
  );
}
