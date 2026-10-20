import { useSearchBar } from './use-search-bar';
import { Search, SearchX } from 'lucide-react';
import styles from './search-bar.module.css';

type SearchBarProps = {
  listboxId: string;
};

export function SearchBar({ listboxId }: SearchBarProps) {
  const { actions, refs, state } = useSearchBar(listboxId);

  return (
    <div className={styles['search-bar']}>
      <Search className={styles['search-bar__icon']} size={18} aria-hidden="true" />

      <input
        className={styles['search-bar__input']}
        ref={refs.inputRef}
        role="combobox"
        value={state.query}
        onChange={actions.onQueryChange}
        onKeyDown={actions.onQueryKeyDown}
        placeholder="Search commands..."
        aria-activedescendant={state.activeOptionId}
        aria-label="Search commands"
        aria-autocomplete="list"
        aria-expanded={state.hasResults}
        aria-controls={state.hasResults ? listboxId : undefined}
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
