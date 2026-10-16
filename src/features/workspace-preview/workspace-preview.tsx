import { WorkspacePreviewSidebar } from './components/workspace-preview-sidebar/workspace-preview-sidebar';
import { WorkspaceRecentCommands } from './components/workspace-recent-commands/workspace-recent-commands';
import { WorkspaceHeader } from './components/workspace-header/workspace-header';

import styles from './workspace-preview.module.css';

import { useWorkspacePreview } from './components/workspace-preview/use-workspace-preview';

export function WorkspacePreview() {
  const { state } = useWorkspacePreview();
  const { selectedCommand } = state;

  return (
    <section
      className={styles['workspace-preview']}
      aria-label="Command palette component showcase"
    >
      <WorkspacePreviewSidebar />

      <div className={styles['workspace-preview__workspace']}>
        <WorkspaceHeader />

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

          <WorkspaceRecentCommands />
        </div>
      </div>
    </section>
  );
}
