import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useCommandPaletteLifecycle } from './use-command-palette-lifecycle';

type SetupProps = {
  open?: boolean;
  query?: string;
};

function setup({ open = true, query = '' }: SetupProps = {}) {
  const resetSearch = vi.fn();
  const resetSelection = vi.fn();

  const props = {
    actions: {
      resetSearch,
      resetSelection,
    },
    state: {
      open,
      query,
    },
  };

  const hook = renderHook(({ actions, state }) => useCommandPaletteLifecycle({ actions, state }), {
    initialProps: props,
  });

  return {
    ...hook,
    mocks: {
      resetSearch,
      resetSelection,
    },
    props,
  };
}

describe('use-command-palette-lifecycle', () => {
  it('resets search and selection when not open', () => {
    const { mocks } = setup({ open: false, query: 'docs' });

    expect(mocks.resetSearch).toHaveBeenCalledTimes(1);
    expect(mocks.resetSelection).toHaveBeenCalledTimes(2);
  });

  it('does not reset search when open', () => {
    const { mocks } = setup({ open: true, query: 'docs' });

    expect(mocks.resetSearch).not.toHaveBeenCalled();
  });

  it('resets selection whenever the query changes', () => {
    const { mocks, props, rerender } = setup({ open: true, query: 'docs' });

    mocks.resetSelection.mockClear();

    rerender({
      ...props,
      state: {
        ...props.state,
        query: 'settings',
      },
    });

    expect(mocks.resetSelection).toHaveBeenCalledTimes(1);
  });
});
