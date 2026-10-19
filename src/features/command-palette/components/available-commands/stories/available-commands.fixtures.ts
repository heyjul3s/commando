import { createElement, useState } from 'react';
import { createStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { COMMANDS } from '../../../../../shared/constants';
import { createStoreSelectors } from '../../../../../shared/store/create-selectors';
import { CommandPaletteProvider } from '../../../store/command-palette-provider';
import { WorkspacePreviewContext } from '../../../../workspace-preview/store/workspace-preview-provider';
import { workspacePreviewActions } from '../../../../workspace-preview/store/workspace-preview-actions';
import { workspacePreviewDefaultValues } from '../../../../workspace-preview/store/workspace-preview-default-values';
import { useCommandPaletteStore } from '../../../store';
import { useWorkspacePreviewStore } from '../../../../workspace-preview/store';
import { getAvailableCommands } from '../../../utils';

import type { PropsWithChildren } from 'react';
import type { Decorator } from '@storybook/react-vite';
import type { WorkspacePreviewStore } from '../../../../workspace-preview/store/workspace-preview-provider';

export const availableCommandsFixtures = {
  all: { activeIndex: 0, query: '' },
  empty: { activeIndex: 0, query: 'no matching command' },
  filtered: { activeIndex: 0, query: 'documentation' },
  highlighted: { activeIndex: 1, query: '' },
};

type Fixture = typeof availableCommandsFixtures.all;

// Keep persistence in memory so stories cannot change saved browser history.
function FixtureProviders({ activeIndex, children, query }: PropsWithChildren<Fixture>) {
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
            name: 'available-commands-story',
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
    initialValues: { activeIndex, isOpen: true, query },
  });
}

function HighlightStatus() {
  const palette = useCommandPaletteStore();
  const query = palette.use.query();
  const activeIndex = palette.use.activeIndex();
  const highlightedCommand = getAvailableCommands(COMMANDS, query).filteredCommands[activeIndex];

  return createElement(
    'div',
    { style: { marginTop: 16 } },
    createElement(
      'p',
      null,
      'Highlighted command: ',
      createElement(
        'output',
        { 'aria-label': 'Highlighted command' },
        highlightedCommand?.label ?? 'None',
      ),
    ),
    createElement('p', null, 'Hover changes the highlight; it does not execute the command.'),
  );
}

function SelectionStatus() {
  const palette = useCommandPaletteStore();
  const workspace = useWorkspacePreviewStore();
  const isOpen = palette.use.isOpen();
  const selectedCommand = workspace.use.selectedCommand();

  return createElement(
    'div',
    { style: { marginTop: 16 } },
    createElement('output', { 'aria-label': 'Palette state' }, isOpen ? 'Open' : 'Closed'),
    createElement(
      'p',
      null,
      'Selected command: ',
      createElement('output', { 'aria-label': 'Selected command' }, selectedCommand.label),
    ),
  );
}

export const withAvailableCommandsFixture: Decorator = (Story, context) => {
  const fixture: Fixture =
    context.parameters.availableCommandsFixture ?? availableCommandsFixtures.all;

  return createElement(FixtureProviders, {
    ...fixture,
    children: createElement(
      'div',
      { style: { width: 'min(560px, 90vw)' } },
      createElement(Story),
      context.parameters.showHighlightStatus ? createElement(HighlightStatus) : null,
      context.parameters.showSelectionStatus ? createElement(SelectionStatus) : null,
    ),
    key: `${context.id}:${fixture.query}:${fixture.activeIndex}`,
  });
};

export const projectCommand = COMMANDS.find((command) => command.id === 'projects')!;
