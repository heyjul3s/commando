import { WorkspacePreviewSidebar } from '../workspace-preview-sidebar/workspace-preview-sidebar';
import { WorkspaceRecentCommands } from '../workspace-recent-commands/workspace-recent-commands';
import { WorkspaceHeader } from '../workspace-header/workspace-header';

import styles from './workspace-preview.module.css';

import { useWorkspacePreview } from './use-workspace-preview';

export function WorkspacePreview() {
  const { state } = useWorkspacePreview();
  const { selectedCommand } = state;

  return (
    <section
      aria-label="Command palette component showcase"
      className={styles['workspace-preview']}
    >
      <WorkspacePreviewSidebar />

      <div className={styles['workspace-preview__workspace']}>
        <WorkspaceHeader />

        <div className={styles['workspace-preview__content-grid']}>
          <section
            aria-label="Selected command"
            className={styles['workspace-preview__primary-panel']}
          >
            <p className={styles['workspace-preview__panel-label']}>Last selected</p>

            <h2 className={styles['workspace-preview__command-heading']}>
              <span className={styles['workspace-preview__primary-panel-icon']}>
                <selectedCommand.icon aria-hidden="true" size={20} />
              </span>
              <span className={styles['workspace-preview__command-label']}>
                {selectedCommand.label}
              </span>
            </h2>

            <p>A single command palette UI component demo</p>
          </section>

          <WorkspaceRecentCommands />
        </div>
      </div>
    </section>
  );
}
