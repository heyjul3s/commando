import { useWorkspaceHeader } from './use-workspace-header';
import { ChevronDown, Search } from 'lucide-react';
import styles from './workspace-header.module.css';
import { THEME } from '../../../../app/theme/theme';

export function WorkspaceHeader() {
  const { actions, state } = useWorkspaceHeader();

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

      <label className={styles['workspace-header__theme']}>
        Theme
        <span className={styles['workspace-header__theme-control']}>
          <select value={state.themePreference} onChange={actions.onThemeChange}>
            <option value={THEME.System}>System</option>
            <option value={THEME.Light}>Light</option>
            <option value={THEME.Dark}>Dark</option>
          </select>

          <ChevronDown aria-hidden="true" size={16} />
        </span>
      </label>
    </header>
  );
}
