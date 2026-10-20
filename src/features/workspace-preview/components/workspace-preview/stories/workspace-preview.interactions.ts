import { expect, within } from 'storybook/test';
import { COMMANDS } from '../../../../../shared/constants';
import { RECENT_COMMAND_LIMIT } from '../../../store/workspace-preview-constants';

import {
  fullHistory,
  notificationCommand,
  projectCommand,
  workspacePreviewFixtures,
} from './workspace-preview.fixtures';

import type { StoryContext } from '@storybook/react-vite';
import type { Command } from '../../../../../shared/constants';

const OPEN_BUTTON_NAME = /Open command menu/;
const DIALOG_NAME = 'Search Commands';
const SEARCH_INPUT_NAME = 'Search commands';
const SELECTION_REGION_NAME = 'Selected command';
const HISTORY_REGION_NAME = 'Recent commands';
const CLEAR_HISTORY_NAME = 'Clear recent commands';
const EMPTY_HISTORY_MESSAGE = 'No recent commands';

async function chooseCommand({ canvas, userEvent }: StoryContext, command: Command) {
  await userEvent.click(canvas.getByRole('button', { name: OPEN_BUTTON_NAME }));
  const dialog = within(canvas.getByRole('dialog', { name: DIALOG_NAME }));
  await userEvent.type(dialog.getByRole('textbox', { name: SEARCH_INPUT_NAME }), command.label);
  await userEvent.click(dialog.getByRole('option', { name: command.label }));
  await expect(canvas.queryByRole('dialog', { name: DIALOG_NAME })).not.toBeInTheDocument();
}

function historyLabels(canvas: StoryContext['canvas']) {
  const history = within(canvas.getByRole('region', { name: HISTORY_REGION_NAME }));
  return history.queryAllByRole('listitem').map((row) => row.textContent?.trim());
}

// -----------------------------------------------------------------------------
// Selection
// -----------------------------------------------------------------------------

export async function selectCommand(context: StoryContext) {
  const { canvas, step } = context;
  const selection = within(canvas.getByRole('region', { name: SELECTION_REGION_NAME }));

  await step('The workspace starts with its default selection and empty history', async () => {
    await expect(selection.getByRole('heading', { name: COMMANDS[0].label })).toBeVisible();
    await expect(canvas.getByText(EMPTY_HISTORY_MESSAGE)).toBeVisible();
    await expect(canvas.getByRole('button', { name: CLEAR_HISTORY_NAME })).toBeDisabled();
  });

  await step('Choosing a palette result updates both the selected panel and history', async () => {
    await chooseCommand(context, projectCommand);
    await expect(selection.getByRole('heading', { name: projectCommand.label })).toBeVisible();
    await expect(historyLabels(canvas)).toEqual([projectCommand.label]);
    await expect(canvas.getByRole('button', { name: CLEAR_HISTORY_NAME })).toBeEnabled();
    await expect(canvas.queryByText(EMPTY_HISTORY_MESSAGE)).not.toBeInTheDocument();
  });
}

// -----------------------------------------------------------------------------
// Recent history
// -----------------------------------------------------------------------------

export async function clearHistory({ canvas, step, userEvent }: StoryContext) {
  const selection = within(canvas.getByRole('region', { name: SELECTION_REGION_NAME }));
  const history = within(canvas.getByRole('region', { name: HISTORY_REGION_NAME }));

  await step('The workspace starts with a selected project and populated history', async () => {
    await expect(selection.getByRole('heading', { name: projectCommand.label })).toBeVisible();
    await expect(history.getAllByRole('listitem')).toHaveLength(
      workspacePreviewFixtures.withHistory.recentCommandIds.length,
    );
  });

  await step('Clearing history preserves the selected command', async () => {
    await userEvent.click(history.getByRole('button', { name: CLEAR_HISTORY_NAME }));
    await expect(history.getByText(EMPTY_HISTORY_MESSAGE)).toBeVisible();
    await expect(history.queryAllByRole('listitem')).toHaveLength(0);
    await expect(history.getByRole('button', { name: CLEAR_HISTORY_NAME })).toBeDisabled();
    await expect(selection.getByRole('heading', { name: projectCommand.label })).toBeVisible();
  });
}

export async function updateHistory(context: StoryContext) {
  const { canvas, step } = context;
  const expectedHistory = [notificationCommand, ...fullHistory].slice(0, RECENT_COMMAND_LIMIT);

  await step('The fixture starts with a full history', async () => {
    await expect(historyLabels(canvas)).toEqual(fullHistory.map((command) => command.label));
  });

  await step('A new selection becomes most recent and removes the oldest entry', async () => {
    await chooseCommand(context, notificationCommand);
    await expect(historyLabels(canvas)).toEqual(expectedHistory.map((command) => command.label));
  });

  await step('Selecting an existing entry moves it to the front without duplication', async () => {
    await chooseCommand(context, projectCommand);

    const reorderedHistory = [
      projectCommand,
      ...expectedHistory.filter((command) => command.id !== projectCommand.id),
    ];

    await expect(historyLabels(canvas)).toEqual(reorderedHistory.map((command) => command.label));
  });
}
