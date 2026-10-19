import { useSearchBar } from './use-search-bar';
import { Search, SearchX } from 'lucide-react';
import styles from './search-bar.module.css';

export function SearchBar() {
  const { actions, refs, state } = useSearchBar();

  return (
    <div className={styles['search-bar']}>
      <Search className={styles['search-bar__icon']} size={18} aria-hidden="true" />

      <input
        className={styles['search-bar__input']}
        ref={refs.inputRef}
        value={state.query}
        onChange={actions.onQueryChange}
        onKeyDown={actions.onQueryKeyDown}
        placeholder="Search commands..."
        aria-label="Search commands"
      />

      {state.query !== '' && (
        <button
          className={styles['search-bar__clear-button']}
          type="button"
          onClick={actions.onClearQuery}
          aria-label="Clear search"
          title="Clear search"
        >
          <SearchX className={styles['search-bar__icon']} size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
