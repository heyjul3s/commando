import { expect, within } from 'storybook/test';
import {
  documentationCommand,
  fullHistory,
  projectCommand,
} from './workspace-recent-commands.fixtures';

import type { StoryContext } from '@storybook/react-vite';

const REGION_NAME = 'Recent commands';
const LIST_NAME = 'Recently triggered commands';
const CLEAR_BUTTON_NAME = 'Clear recent commands';
const EMPTY_MESSAGE = 'No recent commands';

function getHistory(canvas: StoryContext['canvas']) {
  return within(canvas.getByRole('region', { name: REGION_NAME }));
}

async function expectFullHistory(canvas: StoryContext['canvas']) {
  const history = getHistory(canvas);
  const list = within(history.getByRole('list', { name: LIST_NAME }));
  const labels = list.getAllByRole('listitem').map((row) => row.textContent?.trim());

  await expect(labels).toEqual(fullHistory.map((command) => command.label));
  await expect(history.getByRole('button', { name: CLEAR_BUTTON_NAME })).toBeEnabled();
}

async function expectEmptyHistory(canvas: StoryContext['canvas']) {
  const history = getHistory(canvas);

  await expect(history.getByText(EMPTY_MESSAGE)).toBeVisible();
  await expect(history.queryByRole('list')).not.toBeInTheDocument();
  await expect(history.queryAllByRole('listitem')).toHaveLength(0);
  await expect(history.getByRole('button', { name: CLEAR_BUTTON_NAME })).toBeDisabled();
}

async function clearWithKeyboard({ canvas, step, userEvent }: StoryContext, key: string) {
  const button = getHistory(canvas).getByRole('button', { name: CLEAR_BUTTON_NAME });

  await step('Tab focuses the enabled clear control', async () => {
    await expectFullHistory(canvas);
    await userEvent.tab();
    await expect(button).toHaveFocus();
  });

  await step('Keyboard activation clears the list and disables the control', async () => {
    await userEvent.keyboard(key);
    await expectEmptyHistory(canvas);
  });
}

// -----------------------------------------------------------------------------
// Clearing history
// -----------------------------------------------------------------------------

export async function clearHistory({ canvas, step, userEvent }: StoryContext) {
  await step('The six recent commands appear in fixture order', async () => {
    await expectFullHistory(canvas);
  });

  await step('Clearing removes every row and shows the disabled empty state', async () => {
    await userEvent.click(getHistory(canvas).getByRole('button', { name: CLEAR_BUTTON_NAME }));
    await expectEmptyHistory(canvas);
  });
}

export async function clearWithEnter(context: StoryContext) {
  await clearWithKeyboard(context, '{Enter}');
}

export async function clearWithSpace(context: StoryContext) {
  await clearWithKeyboard(context, ' ');
}

// -----------------------------------------------------------------------------
// Unknown IDs
// -----------------------------------------------------------------------------

export async function mixedUnknownIds({ canvas, step }: StoryContext) {
  await step('Unknown IDs are omitted while valid commands retain their order', async () => {
    const history = getHistory(canvas);
    const rows = history.getAllByRole('listitem');

    await expect(rows.map((row) => row.textContent?.trim())).toEqual([
      documentationCommand.label,
      projectCommand.label,
    ]);

    await expect(history.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
    await expect(history.getByRole('button', { name: CLEAR_BUTTON_NAME })).toBeEnabled();
  });
}

export async function unknownIdsOnly({ canvas, step }: StoryContext) {
  await step('History containing only unknown IDs displays the disabled empty state', async () => {
    await expectEmptyHistory(canvas);
  });
}
