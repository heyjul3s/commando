import { act } from 'react';
import { expect, waitFor } from 'storybook/test';
import { COMMANDS, KEYBOARD_KEY } from '../../../../../shared/constants';
import { externalQuery, searchBarFixtures } from './search-bar.fixtures';

import type { StoryContext } from '@storybook/react-vite';

const SEARCH_INPUT_NAME = 'Search commands';
const CLEAR_BUTTON_NAME = 'Clear search';

const ACTIVE_INDEX_NAME = 'Active index';
const EXTERNAL_QUERY_BUTTON_NAME = 'Update query from store';
const PALETTE_STATUS_NAME = 'Palette status';
const RECENT_COMMANDS_NAME = 'Recent command IDs';
const SELECTED_COMMAND_NAME = 'Selected command';
const STORED_QUERY_NAME = 'Stored query';
const SETTINGS_QUERY = 'settings';
const themeCommand = COMMANDS.find((command) => command.id === 'theme')!;

const NEW_QUERY = 'open dashboard';
const UPDATED_QUERY = 'projects';

const NAVIGATION_KEYS = [KEYBOARD_KEY.ArrowDown, KEYBOARD_KEY.ArrowUp, KEYBOARD_KEY.Enter];

function getStoreSnapshot(canvas: StoryContext['canvas']) {
  return {
    activeIndex: canvas.getByLabelText(ACTIVE_INDEX_NAME).textContent,
    paletteStatus: canvas.getByLabelText(PALETTE_STATUS_NAME).textContent,
    query: canvas.getByLabelText(STORED_QUERY_NAME).textContent,
    recentCommands: canvas.getByLabelText(RECENT_COMMANDS_NAME).textContent,
    selectedCommand: canvas.getByLabelText(SELECTED_COMMAND_NAME).textContent,
  };
}

async function dispatchKeyDown(input: HTMLElement, event: KeyboardEvent) {
  // Synthetic events let these stories exercise flags that userEvent does not expose.
  await act(async () => {
    input.dispatchEvent(event);
  });
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export async function createNewQuery({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });

  await step('Query starts empty', async () => {
    await expect(input).toHaveValue('');
    await expect(canvas.queryByRole('button', { name: CLEAR_BUTTON_NAME })).not.toBeInTheDocument();
  });

  await step('Typing updates the query', async () => {
    await userEvent.type(input, NEW_QUERY);
    await expect(input).toHaveValue(NEW_QUERY);
    await expect(canvas.getByLabelText(STORED_QUERY_NAME)).toHaveTextContent(NEW_QUERY);
  });
}

export async function editExistingQuery({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });

  await step('Existing query is displayed', async () => {
    await expect(input).toHaveValue(searchBarFixtures.existingQuery.query);
  });

  await step('Editing replaces the query', async () => {
    await userEvent.clear(input);
    await userEvent.type(input, UPDATED_QUERY);
    await expect(input).toHaveValue(UPDATED_QUERY);
  });
}

export async function clearQuery({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });

  await step('The fixture starts with a query and a nonzero highlight', async () => {
    await expect(input).toHaveValue(searchBarFixtures.highlighted.query);
    await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('2');
  });

  await step('Clearing empties the query', async () => {
    await userEvent.click(canvas.getByRole('button', { name: CLEAR_BUTTON_NAME }));
    await expect(input).toHaveValue('');
    await expect(canvas.getByLabelText(STORED_QUERY_NAME)).toBeEmptyDOMElement();
    await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('0');
    await expect(canvas.getByLabelText(PALETTE_STATUS_NAME)).toHaveTextContent('Open');
    await expect(input).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: CLEAR_BUTTON_NAME })).not.toBeInTheDocument();
  });
}

export async function externalStoreUpdate({ canvas, step, userEvent }: StoryContext) {
  await step('A store update is reflected in the input', async () => {
    await userEvent.click(canvas.getByRole('button', { name: EXTERNAL_QUERY_BUTTON_NAME }));
    await expect(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME })).toHaveValue(
      externalQuery,
    );
    await expect(canvas.getByLabelText(STORED_QUERY_NAME)).toHaveTextContent(externalQuery);
  });
}

// -----------------------------------------------------------------------------
// Keyboard and focus
// -----------------------------------------------------------------------------

export async function initialFocus({ canvas, step }: StoryContext) {
  await step('Mounting focuses the search input', async () => {
    await waitFor(async () => {
      await expect(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME })).toHaveFocus();
    });
  });
}

export async function keyboardNavigation({ canvas, step, userEvent }: StoryContext) {
  await step('Arrow keys wrap the highlighted index in both directions', async () => {
    const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });

    await userEvent.click(input);
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent(
      String(COMMANDS.length - 1),
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('0');
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('1');
    await expect(input).toHaveFocus();
  });
}

export async function keyboardSelection({ canvas, step, userEvent }: StoryContext) {
  await step('Navigate the filtered results', async () => {
    await userEvent.type(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }), SETTINGS_QUERY);
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('1');
  });

  await step('Enter selects the highlighted command and closes through the store', async () => {
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByLabelText(SELECTED_COMMAND_NAME)).toHaveTextContent(
      themeCommand.label,
    );
    await expect(canvas.getByLabelText(RECENT_COMMANDS_NAME)).toHaveTextContent(themeCommand.id);
    await expect(canvas.getByLabelText(PALETTE_STATUS_NAME)).toHaveTextContent('Closed');
  });
}

export async function emptyResultsKeyboard({ canvas, step, userEvent }: StoryContext) {
  await step(
    'Navigation and Enter with no results leave selection and open state unchanged',
    async () => {
      const selection = canvas.getByLabelText(SELECTED_COMMAND_NAME).textContent;
      await userEvent.click(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }));
      await userEvent.keyboard('{ArrowDown}{ArrowUp}{Enter}');
      await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('0');
      await expect(canvas.getByLabelText(PALETTE_STATUS_NAME)).toHaveTextContent('Open');
      await expect(canvas.getByLabelText(SELECTED_COMMAND_NAME)).toHaveTextContent(selection!);
      await expect(canvas.getByLabelText(RECENT_COMMANDS_NAME)).toBeEmptyDOMElement();
    },
  );
}

export async function clearWithKeyboard({ canvas, step, userEvent }: StoryContext) {
  await step('Enter on Clear search clears rather than selecting a command', async () => {
    await userEvent.click(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: CLEAR_BUTTON_NAME })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME })).toHaveValue('');
    await expect(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME })).toHaveFocus();
    await expect(canvas.getByLabelText(PALETTE_STATUS_NAME)).toHaveTextContent('Open');
    await expect(canvas.getByLabelText(RECENT_COMMANDS_NAME)).toBeEmptyDOMElement();
  });
}

// -----------------------------------------------------------------------------
// Event guards
// -----------------------------------------------------------------------------

export async function preventKeyboardDefaults({ canvas, step }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });

  await step(
    'Navigation and Enter prevent browser defaults, including with no results',
    async () => {
      for (const key of NAVIGATION_KEYS) {
        const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
        await dispatchKeyDown(input, event);
        await expect(event.defaultPrevented).toBe(true);
      }
    },
  );
}

export async function ignorePreventedEvents({ canvas, step }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });
  const initialState = getStoreSnapshot(canvas);

  await step(
    'Already-prevented events leave query, highlight, selection, and open state unchanged',
    async () => {
      for (const key of NAVIGATION_KEYS) {
        const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
        event.preventDefault();
        await dispatchKeyDown(input, event);
        await expect(getStoreSnapshot(canvas)).toEqual(initialState);
      }
    },
  );
}

export async function ignoreCompositionEvents({ canvas, step }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });
  const initialState = getStoreSnapshot(canvas);

  await step('IME composition keys stay unhandled and leave store state unchanged', async () => {
    for (const key of NAVIGATION_KEYS) {
      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        isComposing: true,
        key,
      });

      await dispatchKeyDown(input, event);
      await expect(event.defaultPrevented).toBe(false);
      await expect(getStoreSnapshot(canvas)).toEqual(initialState);
    }
  });
}

export async function ignoreClosedPaletteKeys({ canvas, step }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });
  const initialState = getStoreSnapshot(canvas);

  await step('A closed palette leaves navigation and Enter unhandled', async () => {
    await expect(canvas.getByLabelText(PALETTE_STATUS_NAME)).toHaveTextContent('Closed');
    for (const key of NAVIGATION_KEYS) {
      const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key });
      await dispatchKeyDown(input, event);
      await expect(event.defaultPrevented).toBe(false);
      await expect(getStoreSnapshot(canvas)).toEqual(initialState);
    }
  });
}

export async function ignoreUnrelatedKeys({ canvas, step }: StoryContext) {
  const initialState = getStoreSnapshot(canvas);

  await step('ArrowLeft is left to the browser without changing store state', async () => {
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'ArrowLeft',
    });
    await dispatchKeyDown(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }), event);
    await expect(event.defaultPrevented).toBe(false);
    await expect(getStoreSnapshot(canvas)).toEqual(initialState);
  });
}
