import { useSearchBar } from './use-search-bar';
import { Search, X } from 'lucide-react';
import styles from './search-bar.module.css';

export function SearchBar() {
  const { state, actions, refs } = useSearchBar();

  return (
    <div className={styles['search-bar']}>
      <Search size={18} aria-hidden="true" />

      <input
        className={styles['search-bar__input']}
        ref={refs.inputRef}
        value={state.query}
        onChange={actions.onQueryChange}
        placeholder="Search commands..."
        aria-label="Search commands"
      />

      <button
        className={styles['search-bar__close-button']}
        type="button"
        onClick={actions.onCloseCommandPalette}
      >
        <X size={17} aria-hidden="true" />
        <span className={styles['search-bar__sr-only']}>Close command palette</span>
      </button>
    </div>
  );
}
