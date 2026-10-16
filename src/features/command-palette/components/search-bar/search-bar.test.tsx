import { act, fireEvent, render, screen } from '@testing-library/react';
import { CommandPaletteProvider, useCommandPaletteStore } from '../../store';
import { SearchBar } from './search-bar';

describe('search-bar', () => {
  it('updates query, reflects store changes, and closes through the store', () => {
    let store: ReturnType<typeof useCommandPaletteStore>;
    function StoreProbe() {
      store = useCommandPaletteStore();
      return null;
    }

    render(
      <>
        <SearchBar />
        <StoreProbe />
      </>,
      { wrapper: CommandPaletteProvider },
    );
    act(() => store!.getState().actions.setIsOpen(true));

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'dashboard' } });
    expect(store!.getState().query).toBe('dashboard');

    act(() => store!.getState().actions.setQuery('documentation'));
    expect(screen.getByRole('textbox')).toHaveValue('documentation');

    fireEvent.click(screen.getByRole('button', { name: 'Close command palette' }));
    expect(store!.getState().isOpen).toBe(false);
  });
});
