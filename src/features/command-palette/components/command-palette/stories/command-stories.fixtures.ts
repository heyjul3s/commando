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
import type { Decorator, StoryContext } from '@storybook/react-vite';
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

  return createElement(
    'div',
    null,
    createElement('output', { 'aria-label': 'Selected command' }, selected.label),
    createElement('output', { 'aria-label': 'Recent command IDs' }, recentIds.join(', ')),
  );
}

function PaletteLauncher() {
  const palette = useCommandPaletteStore();

  return createElement(
    'button',
    {
      onClick: () => palette.getState().actions.setIsOpen(true),
      type: 'button',
    },
    'Open command palette',
  );
}

export function withCommandPaletteFixture(Story: Parameters<Decorator>[0], context: StoryContext) {
  const fixture: Fixture =
    context.parameters.commandPaletteFixture ?? commandPaletteFixtures.default;

  return createElement(FixtureProviders, {
    ...fixture,
    children: createElement(
      'div',
      { style: { padding: 24 } },
      createElement(PaletteLauncher),
      context.parameters.showWorkspaceStatus ? createElement(WorkspaceStatus) : null,
      createElement(Story),
    ),
    key: `${context.id}:${fixture.isOpen}:${fixture.query}:${fixture.activeIndex}`,
  });
}
