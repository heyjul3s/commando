import { Command } from 'lucide-react';
import styles from './workspace-preview-sidebar.module.css';

export function WorkspacePreviewSidebar() {
  return (
    <nav aria-label="Workspace" className={styles['workspace-preview-sidebar']}>
      <div className={styles['workspace-preview-sidebar__brand-mark']}>
        <Command aria-hidden="true" size={18} />
      </div>

      <div
        className={`${styles['workspace-preview-sidebar__pill']} ${styles['workspace-preview-sidebar__pill--active']}`}
      />

      <div className={styles['workspace-preview-sidebar__pill']} />

      <div
        className={`${styles['workspace-preview-sidebar__pill']} ${styles['workspace-preview-sidebar__pill--short']}`}
      />
    </nav>
  );
}
