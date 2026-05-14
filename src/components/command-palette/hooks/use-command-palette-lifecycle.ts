import { useEffect } from 'react';

type UseCommandPaletteLifecycleProps = {
  actions: {
    resetSearch: () => void;
    resetSelection: () => void;
  };
  state: {
    open: boolean;
    query: string;
  };
};

export function useCommandPaletteLifecycle({ actions, state }: UseCommandPaletteLifecycleProps) {
  const { resetSearch, resetSelection } = actions;
  const { open, query } = state;

  useEffect(() => {
    if (!open) {
      resetSearch();
      resetSelection();
    }
  }, [open, resetSearch, resetSelection]);

  useEffect(() => {
    resetSelection();
  }, [query, resetSelection]);
}
