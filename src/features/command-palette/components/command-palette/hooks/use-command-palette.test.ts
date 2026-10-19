import { useCommandPaletteStore } from '../../../store';
import { useWorkspacePreviewStore } from '../../../../workspace-preview/store';
import { AppProviders } from '../../../../../app/providers/app-providers';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useCommandPalette } from './use-command-palette';

function setup() {
  const hook = renderHook(
    () => ({
      ...useCommandPalette(),
      paletteStore: useCommandPaletteStore(),
      workspaceStore: useWorkspacePreviewStore(),
    }),
    { wrapper: AppProviders },
  );

  act(() => hook.result.current.paletteStore.getState().actions.setIsOpen(true));
  return hook;
}

describe('use-command-palette', () => {
  beforeEach(() => localStorage.clear());
  it('does not subscribe to query or selection changes', () => {
    const { result } = setup();
    const previous = result.current;
    act(() => {
      result.current.paletteStore.getState().actions.setQuery('dashboard');
      result.current.paletteStore.getState().actions.setActiveIndex(1);
    });
    expect(result.current).toBe(previous);
  });

  it('closes the palette', () => {
    const { result } = setup();

    act(() => {
      result.current.actions.onCloseCommandPalette();
    });

    expect(result.current.paletteStore.getState().isOpen).toBe(false);
  });

  it('resets search and selection when the palette closes', () => {
    const { result } = setup();

    act(() => {
      result.current.paletteStore.getState().actions.setQuery('dashboard');
      result.current.paletteStore.getState().actions.setActiveIndex(1);
    });

    act(() => result.current.paletteStore.getState().actions.closeCommandPalette());

    expect(result.current.paletteStore.getState().query).toBe('');
    expect(result.current.paletteStore.getState().activeIndex).toBe(0);
  });
});
