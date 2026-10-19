import { createElement, useState } from 'react';
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
  closed: { activeIndex: 0, isOpen: false, query: '' },
  default: { activeIndex: 0, isOpen: true, query: '' },
  empty: { activeIndex: 0, isOpen: true, query: 'no matching command' },
  existingQuery: { activeIndex: 0, isOpen: true, query: 'existing query' },
  highlighted: { activeIndex: 2, isOpen: true, query: 'documentation' },
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
    <div>
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
    </div>
  );
}

function ExternalQueryControl() {
  const palette = useCommandPaletteStore();

  return (
    <button type="button" onClick={() => palette.getState().actions.setQuery(externalQuery)}>
      Update query from store
    </button>
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

export function withExternalQueryControl(Story: PartialStoryFn<ReactRenderer>) {
  return (
    <>
      <Story />
      <ExternalQueryControl />
    </>
  );
}

export function withCommandPaletteProvider(
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext,
) {
  const fixture: Fixture = context.parameters.searchBarFixture ?? searchBarFixtures.default;

  return (
    <FixtureProviders key={context.id} {...fixture}>
      <div style={{ width: 360 }}>
        <Story />
      </div>
    </FixtureProviders>
  );
}
