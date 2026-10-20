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
      <Search aria-hidden="true" className={styles['search-bar__icon']} size={18} />

      <input
        aria-activedescendant={state.activeOptionId}
        aria-autocomplete="list"
        aria-controls={state.hasResults ? listboxId : undefined}
        aria-expanded={state.hasResults}
        aria-label="Search commands"
        className={styles['search-bar__input']}
        onChange={actions.onQueryChange}
        onKeyDown={actions.onQueryKeyDown}
        placeholder="Search commands..."
        ref={refs.inputRef}
        role="combobox"
        value={state.query}
      />

      {state.query !== '' && (
        <button
          aria-label="Clear search"
          className={styles['search-bar__clear-button']}
          onClick={actions.onClearQuery}
          title="Clear search"
          type="button"
        >
          <SearchX aria-hidden="true" className={styles['search-bar__icon']} size={20} />
        </button>
      )}
    </div>
  );
}
