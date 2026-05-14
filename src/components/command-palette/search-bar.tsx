import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import styles from './search-bar.module.css';

type SearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
};

export function SearchBar({ query, onQueryChange, onClose }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  return (
    <div className={styles['search-bar']}>
      <Search size={18} aria-hidden="true" />

      <input
        className={styles['search-bar__input']}
        ref={inputRef}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search commands..."
        aria-label="Search commands"
      />

      <button className={styles['search-bar__close-button']} type="button" onClick={onClose}>
        <X size={17} aria-hidden="true" />
        <span className={styles['search-bar__sr-only']}>Close command palette</span>
      </button>
    </div>
  );
}
