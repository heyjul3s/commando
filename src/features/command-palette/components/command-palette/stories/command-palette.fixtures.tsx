import { createElement, useState } from 'react';
import styles from './command-stories.module.css';
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

export const commandPaletteFixtures = {
  closed: { activeIndex: 0, isOpen: false, query: '' },
  default: { activeIndex: 0, isOpen: true, query: '' },
  empty: { activeIndex: 0, isOpen: true, query: 'no matching command' },
  filtered: { activeIndex: 0, isOpen: true, query: 'documentation' },
};

type Fixture = typeof commandPaletteFixtures.default;

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
            name: 'command-palette-story',
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

function WorkspaceStatus() {
  const workspace = useWorkspacePreviewStore();
  const selected = workspace.use.selectedCommand();
  const recentIds = workspace.use.recentCommandIds();

  return (
    <dl className={styles['fixture__readout']}>
      <dt>Selected command</dt>
      <dd>
        <output aria-label="Selected command">{selected.label}</output>
      </dd>
      <dt>Recent command IDs</dt>
      <dd>
        <output aria-label="Recent command IDs">{recentIds.join(', ') || 'None yet'}</output>
      </dd>
    </dl>
  );
}

function PaletteStatus() {
  const palette = useCommandPaletteStore();
  const query = palette.use.query();
  const activeIndex = palette.use.activeIndex();
  const isOpen = palette.use.isOpen();

  return (
    <dl className={styles['fixture__readout']}>
      <dt>Query</dt>
      <dd>
        <output aria-label="Stored query">{query}</output>
      </dd>
      <dt>Highlighted index</dt>
      <dd>
        <output aria-label="Active index">{activeIndex}</output>
      </dd>
      <dt>Palette</dt>
      <dd>
        <output aria-label="Palette status">{isOpen ? 'Open' : 'Closed'}</output>
      </dd>
    </dl>
  );
}

function PaletteLauncher() {
  const palette = useCommandPaletteStore();

  return (
    <button
      className={styles['fixture__launcher']}
      onClick={() => palette.getState().actions.setIsOpen(true)}
      type="button"
    >
      Open command palette
    </button>
  );
}

export function withCommandPaletteFixture(
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext,
) {
  const fixture: Fixture =
    context.parameters.commandPaletteFixture ?? commandPaletteFixtures.default;
  const showStatus = context.parameters.showWorkspaceStatus || context.parameters.showPaletteStatus;

  return (
    <FixtureProviders
      key={`${context.id}:${fixture.isOpen}:${fixture.query}:${fixture.activeIndex}`}
      {...fixture}
    >
      <div className={styles.fixture}>
        <PaletteLauncher />
        {showStatus && (
          <aside className={styles['fixture__panel']} aria-label="Story fixture state">
            <strong>Story fixture state</strong>
            <p className={styles['fixture__hint']}>
              Test readout — not part of the command palette.
            </p>
            {context.parameters.showWorkspaceStatus && <WorkspaceStatus />}
            {context.parameters.showPaletteStatus && <PaletteStatus />}
          </aside>
        )}
        <Story />
      </div>
    </FixtureProviders>
  );
}
