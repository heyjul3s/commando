import { COMMANDS } from '../../../../../shared/constants';
import { getAvailableCommands } from '../../../utils';
import { createElement, useId, useState } from 'react';
import { createStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStoreSelectors } from '../../../../../shared/store/create-selectors';
import { CommandPaletteProvider, useCommandPaletteStore } from '../../../store';
import { WorkspacePreviewContext } from '../../../../workspace-preview/store/workspace-preview-provider';
import { workspacePreviewActions } from '../../../../workspace-preview/store/workspace-preview-actions';
import { workspacePreviewDefaultValues } from '../../../../workspace-preview/store/workspace-preview-default-values';
import { useWorkspacePreviewStore } from '../../../../workspace-preview/store';

import type { PropsWithChildren } from 'react';
import type { ReactRenderer, StoryContext } from '@storybook/react-vite';
import type { PartialStoryFn } from 'storybook/internal/types';
import type { WorkspacePreviewStore } from '../../../../workspace-preview/store/workspace-preview-provider';

export const searchBarFixtures = {
  closed: {
    activeIndex: 0,
    isOpen: false,
    query: '',
  },
  default: {
    activeIndex: 0,
    isOpen: true,
    query: '',
  },
  empty: {
    activeIndex: 0,
    isOpen: true,
    query: 'no matching command',
  },
  existingQuery: {
    activeIndex: 0,
    isOpen: true,
    query: 'existing query',
  },
  highlighted: {
    activeIndex: 2,
    isOpen: true,
    query: 'documentation',
  },
  longQuery: {
    activeIndex: 0,
    isOpen: true,
    query: 'this is a very long query that exceeds the typical length of a search query',
  },
};

export const externalQuery = 'documentation';
type Fixture = typeof searchBarFixtures.default;

function FixtureProviders({ children, ...fixture }: PropsWithChildren<Fixture>) {
  // Keep persistence in memory so stories never modify saved browser history.
  const [workspace] = useState(() => {
    const memory = new Map<string, string>();
    return createStoreSelectors(
      createStore<WorkspacePreviewStore>()(
        persist(
          (set, get) => ({
            ...workspacePreviewDefaultValues,
            actions: workspacePreviewActions(set, get),
            recentCommandIds: [],
          }),
          {
            name: 'search-bar-story',
            partialize: (state) => ({ recentCommandIds: state.recentCommandIds }),
            storage: createJSONStorage<{ recentCommandIds: string[] }>(() => ({
              getItem: (name) => memory.get(name) ?? null,
              removeItem: (name) => {
                memory.delete(name);
              },
              setItem: (name, value) => {
                memory.set(name, value);
              },
            })),
          },
        ),
      ),
    );
  });

  return createElement(CommandPaletteProvider, {
    children: createElement(WorkspacePreviewContext.Provider, { value: workspace }, children),
    initialValues: fixture,
  });
}

function StoreStatus() {
  const palette = useCommandPaletteStore();
  const workspace = useWorkspacePreviewStore();
  const query = palette.use.query();
  const activeIndex = palette.use.activeIndex();
  const isOpen = palette.use.isOpen();
  const selected = workspace.use.selectedCommand();
  const recentIds = workspace.use.recentCommandIds();

  return (
    <aside
      aria-label="Story fixture state"
      style={{
        background: 'var(--color-surface-muted)',
        border: '1px dashed var(--color-border-strong)',
        borderRadius: 8,
        color: 'var(--color-text-secondary)',
        fontSize: '16px',
        lineHeight: 1.5,
        marginTop: '1rem',
        padding: '1rem',
      }}
    >
      <strong style={{ fontSize: '18px' }}>Story fixture state</strong>
      <p style={{ fontSize: '14px' }}>Test readout — not part of the SearchBar component.</p>
      <p>
        Query: <output aria-label="Stored query">{query}</output>
      </p>
      <p>
        Highlight: <output aria-label="Active index">{activeIndex}</output>
      </p>
      <p>
        Palette: <output aria-label="Palette status">{isOpen ? 'Open' : 'Closed'}</output>
      </p>
      <p>
        Selection: <output aria-label="Selected command">{selected.label}</output>
      </p>
      <p>
        History: <output aria-label="Recent command IDs">{recentIds.join(', ')}</output>
      </p>
    </aside>
  );
}

function ExternalQueryControl() {
  const palette = useCommandPaletteStore();
  const hintId = useId();

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        type="button"
        aria-describedby={hintId}
        onClick={() => palette.getState().actions.setQuery(externalQuery)}
        style={{
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 6,
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          font: 'inherit',
          fontSize: '16px',
          fontWeight: 600,
          padding: '0.5rem 0.75rem',
        }}
      >
        Update query from store
      </button>
      <p
        id={hintId}
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '14px',
          lineHeight: 1.5,
          margin: '0.5rem 0 0',
        }}
      >
        This test button changes the shared store query to “{externalQuery}” without typing in the
        search field. The story clicks it automatically, so that value may already be shown. To try
        it yourself, type a different query above, then click the button to replace it with “
        {externalQuery}”.
      </p>
    </div>
  );
}

export function withStoreStatus(Story: PartialStoryFn<ReactRenderer>) {
  return (
    <>
      <Story />
      <StoreStatus />
    </>
  );
}

export function withExternalQueryControl(
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext,
) {
  return (
    <>
      <Story />
      {context.parameters.showExternalQueryControl && <ExternalQueryControl />}
    </>
  );
}

function SearchSuggestionsFixture({ listboxId }: { listboxId: string }) {
  const palette = useCommandPaletteStore();
  const query = palette.use.query();
  const activeIndex = palette.use.activeIndex();
  const { filteredCommands } = getAvailableCommands(COMMANDS, query);

  if (filteredCommands.length === 0) {
    return null;
  }

  return (
    <div
      id={listboxId}
      role="listbox"
      aria-label="Search suggestions fixture"
      style={{
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        width: 1,
      }}
    >
      {filteredCommands.map((command, index) => (
        <span
          id={`${listboxId}-${command.id}`}
          key={command.id}
          role="option"
          aria-selected={index === activeIndex}
        >
          {command.label}
        </span>
      ))}
    </div>
  );
}

export function withSearchBarSurface(Story: PartialStoryFn<ReactRenderer>) {
  const listboxId = useId();

  return (
    <div
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 8,
        overflow: 'hidden',
        padding: '1rem',
      }}
    >
      <Story args={{ listboxId }} />
      <SearchSuggestionsFixture listboxId={listboxId} />
    </div>
  );
}

export function withCommandPaletteProvider(
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext,
) {
  const fixture: Fixture = context.parameters.searchBarFixture ?? searchBarFixtures.default;

  return (
    <FixtureProviders key={context.id} {...fixture}>
      <div style={{ maxWidth: '90vw', width: 360 }}>
        <Story />
      </div>
    </FixtureProviders>
  );
}
