import { expect } from 'storybook/test';
import { searchBarFixtures } from './search-bar.fixtures';

import type { StoryContext } from '@storybook/react-vite';

const SEARCH_INPUT_NAME = 'Search commands';
const CLEAR_BUTTON_NAME = 'Clear search';

const NEW_QUERY = 'open dashboard';
const UPDATED_QUERY = 'projects';

export async function createNewQuery({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('textbox', { name: SEARCH_INPUT_NAME });

  await step('Query starts empty', async () => {
    await expect(input).toHaveValue('');
  });

  await step('Typing updates the query', async () => {
    await userEvent.type(input, NEW_QUERY);
    await expect(input).toHaveValue(NEW_QUERY);
  });
}

export async function clearQuery({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('textbox', { name: SEARCH_INPUT_NAME });

  await step('Create a query to clear', async () => {
    await expect(input).toHaveValue('');
    await userEvent.type(input, NEW_QUERY);
    await expect(input).toHaveValue(NEW_QUERY);
  });

  await step('Clearing empties the query', async () => {
    await userEvent.click(canvas.getByRole('button', { name: CLEAR_BUTTON_NAME }));
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: CLEAR_BUTTON_NAME })).not.toBeInTheDocument();
  });
}

export async function editExistingQuery({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('textbox', { name: SEARCH_INPUT_NAME });

  await step('Existing query is displayed', async () => {
    await expect(input).toHaveValue(searchBarFixtures.existingQuery.query);
  });

  await step('Editing replaces the query', async () => {
    await userEvent.clear(input);
    await userEvent.type(input, UPDATED_QUERY);
    await expect(input).toHaveValue(UPDATED_QUERY);
  });
}
