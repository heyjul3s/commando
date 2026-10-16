import { Command } from 'lucide-react';
import styles from './workspace-preview-sidebar.module.css';

export function WorkspacePreviewSidebar() {
  return (
    <nav className={styles['workspace-preview-sidebar']} aria-label="Workspace">
      <div className={styles['workspace-preview-sidebar__brand-mark']}>
        <Command size={18} aria-hidden="true" />
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
