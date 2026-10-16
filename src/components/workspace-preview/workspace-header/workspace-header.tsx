import { useWorkspaceHeader } from './use-workspace-header';
import { Search } from 'lucide-react';
import styles from './workspace-header.module.css';

export function WorkspaceHeader() {
  const { actions } = useWorkspaceHeader();

  return (
    <header className={styles['workspace-header']}>
      <div>
        <p className={styles['workspace-header__eyebrow']}>Component Showcase</p>
        <h1>Commando</h1>
      </div>

      <button
        className={styles['workspace-header__trigger-button']}
        type="button"
        onClick={actions.onOpenCommandPalette}
      >
        <Search size={17} aria-hidden="true" />
        <span>Open command menu</span>
        <kbd>⌘K</kbd>
      </button>
    </header>
  );
}
