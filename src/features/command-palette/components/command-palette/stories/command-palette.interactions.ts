import { expect, waitFor } from 'storybook/test';
import { COMMANDS } from '../../../../../shared/constants';
import { getAvailableCommands } from '../../../utils';

import type { StoryContext } from '@storybook/react-vite';

const DIALOG_NAME = 'Search Commands';
const SEARCH_INPUT_NAME = 'Search commands';
const CLOSE_BUTTON_NAME = 'Close command palette';
const CLEAR_BUTTON_NAME = 'Clear search';
const OPEN_BUTTON_NAME = 'Open command palette';
const SELECTED_COMMAND_NAME = 'Selected command';
const RECENT_COMMANDS_NAME = 'Recent command IDs';
const EMPTY_MESSAGE = 'No commands found';
const UNMATCHED_QUERY = 'no matching command';
const PROJECT_QUERY = 'projects';
const SELECTED_ATTRIBUTE = 'aria-selected';
const ACTIVE_DESCENDANT_ATTRIBUTE = 'aria-activedescendant';
const STORED_QUERY_NAME = 'Stored query';
const ACTIVE_INDEX_NAME = 'Active index';
const PALETTE_STATUS_NAME = 'Palette status';
const NAVIGATION_QUERY = 'navigation';
const projectCommand = COMMANDS.find((command) => command.id === 'projects')!;
const firstCommand = COMMANDS[0];

async function expectActiveOption(input: HTMLElement, option: HTMLElement) {
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(option.id).not.toBe('');
  await expect(input).toHaveAttribute(ACTIVE_DESCENDANT_ATTRIBUTE, option.id);
  await expect(option).toHaveAttribute(SELECTED_ATTRIBUTE, 'true');

  const listboxId = input.getAttribute('aria-controls');
  const listbox = listboxId ? input.ownerDocument.getElementById(listboxId) : null;
  await expect(listbox).toHaveAttribute('role', 'listbox');
  await expect(listbox).toContainElement(option);
}

async function expectDismissed(canvas: StoryContext['canvas']) {
  await waitFor(async () => {
    await expect(canvas.queryByRole('dialog', { name: DIALOG_NAME })).not.toBeInTheDocument();
  });
}

export async function closePalette({ canvas, step, userEvent }: StoryContext) {
  await step('Palette starts open', async () => {
    await expect(canvas.getByRole('dialog', { name: DIALOG_NAME })).toBeVisible();
  });

  await step('Close button dismisses the dialog', async () => {
    await userEvent.click(canvas.getByRole('button', { name: CLOSE_BUTTON_NAME }));
    await expectDismissed(canvas);
  });
}

export async function searchAndSelect({ canvas, step, userEvent }: StoryContext) {
  await step('Open the palette', async () => {
    await expectDismissed(canvas);
    await userEvent.click(canvas.getByRole('button', { name: OPEN_BUTTON_NAME }));
    await expect(canvas.getByRole('dialog', { name: DIALOG_NAME })).toBeVisible();
  });

  await step('Search filters the available commands', async () => {
    const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });
    const initialOption = canvas.getByRole('option', { name: firstCommand.label });
    await expectActiveOption(input, initialOption);
    await userEvent.type(input, PROJECT_QUERY);
    await expect(canvas.getAllByRole('option')).toHaveLength(1);
    await expect(canvas.getByRole('option', { name: projectCommand.label })).toBeVisible();
    await expectActiveOption(input, canvas.getByRole('option', { name: projectCommand.label }));
    await expect(initialOption).not.toBeInTheDocument();
  });

  await step('Selecting updates the workspace and recent history, then dismisses', async () => {
    await userEvent.click(canvas.getByRole('option', { name: projectCommand.label }));
    await expectDismissed(canvas);
    await expect(canvas.getByLabelText(SELECTED_COMMAND_NAME)).toHaveTextContent(
      projectCommand.label,
    );
    await expect(canvas.getByLabelText(RECENT_COMMANDS_NAME)).toHaveTextContent(projectCommand.id);
  });
}

export async function clearSearch({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });
  const dialog = canvas.getByRole('dialog', { name: DIALOG_NAME });
  const initialHeight = dialog.getBoundingClientRect().height;

  await step('An unmatched query shows the empty state without resizing', async () => {
    await userEvent.type(input, UNMATCHED_QUERY);
    await expect(canvas.getByText(EMPTY_MESSAGE)).toBeVisible();
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
    await expect(input).not.toHaveAttribute(ACTIVE_DESCENDANT_ATTRIBUTE);
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).not.toHaveAttribute('aria-controls');
    await expect(dialog.getBoundingClientRect().height).toBeCloseTo(initialHeight, 0);
  });

  await step('Clear search restores results and focus while the dialog stays open', async () => {
    await userEvent.click(canvas.getByRole('button', { name: CLEAR_BUTTON_NAME }));

    await expect(input).toHaveValue('');
    await expectActiveOption(input, canvas.getByRole('option', { name: firstCommand.label }));
    await expect(input).toHaveFocus();
    await expect(canvas.getAllByRole('option')).toHaveLength(COMMANDS.length);
    await expect(canvas.getByRole('option', { name: firstCommand.label })).toBeVisible();
    await expect(canvas.queryByText(EMPTY_MESSAGE)).not.toBeInTheDocument();
    await expect(dialog).toBeVisible();
    await expect(dialog.getBoundingClientRect().height).toBeCloseTo(initialHeight, 0);
  });
}

export async function closeAndReopen(context: StoryContext) {
  const { canvas, step, userEvent } = context;

  await step('Enter a query and highlight another command', async () => {
    await userEvent.type(
      canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }),
      NAVIGATION_QUERY,
    );
    const command = canvas.getByRole('option', { name: projectCommand.label });
    await userEvent.hover(command);
    await expect(command).toHaveAttribute(SELECTED_ATTRIBUTE, 'true');
    await expectActiveOption(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }), command);
    await expect(canvas.getByLabelText(STORED_QUERY_NAME)).toHaveTextContent(NAVIGATION_QUERY);
    await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('1');
  });

  await closePalette(context);

  await step('Closing resets store state before reopening', async () => {
    await waitFor(async () => {
      await expect(canvas.getByLabelText(PALETTE_STATUS_NAME)).toHaveTextContent('Closed');
      await expect(canvas.getByLabelText(STORED_QUERY_NAME)).toBeEmptyDOMElement();
      await expect(canvas.getByLabelText(ACTIVE_INDEX_NAME)).toHaveTextContent('0');
    });
  });

  await step('Reopening resets the query and highlight', async () => {
    await userEvent.click(canvas.getByRole('button', { name: OPEN_BUTTON_NAME }));

    const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });

    await expect(input).toHaveValue('');
    await waitFor(async () => {
      await expect(input).toHaveFocus();
    });

    await expect(canvas.getAllByRole('option')).toHaveLength(COMMANDS.length);
    await expect(canvas.getByRole('option', { name: firstCommand.label })).toHaveAttribute(
      SELECTED_ATTRIBUTE,
      'true',
    );

    await expect(canvas.getByRole('option', { name: projectCommand.label })).toHaveAttribute(
      SELECTED_ATTRIBUTE,
      'false',
    );
  });
}

export async function escapeDismiss({ canvas, step, userEvent }: StoryContext) {
  await step('Escape from the search field dismisses the dialog', async () => {
    await userEvent.click(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }));
    await userEvent.keyboard('{Escape}');
    await expectDismissed(canvas);
  });
}

export async function backdropDismiss({ canvas, step, userEvent }: StoryContext) {
  const dialog = canvas.getByRole('dialog', { name: DIALOG_NAME });

  await step('Interacting inside the dialog keeps it open', async () => {
    await userEvent.click(canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME }));
    await expect(dialog).toBeVisible();
  });

  await step('Clicking the backdrop dismisses the dialog', async () => {
    // The presentation element is the backdrop; target it directly, outside its dialog child.
    await userEvent.click(canvas.getByRole('presentation'));
    await expectDismissed(canvas);
  });
}

export async function keyboardSelection({ canvas, step, userEvent }: StoryContext) {
  const input = canvas.getByRole('combobox', { name: SEARCH_INPUT_NAME });
  const navigationCommands = getAvailableCommands(COMMANDS, 'navigation').filteredCommands;

  await step('Arrow keys wrap through filtered results', async () => {
    await userEvent.type(input, 'navigation');
    await expect(canvas.getAllByRole('option')).toHaveLength(navigationCommands.length);

    await expectActiveOption(input, canvas.getByRole('option', { name: firstCommand.label }));

    await userEvent.keyboard('{ArrowUp}');
    await expect(
      canvas.getByRole('option', { name: navigationCommands[navigationCommands.length - 1].label }),
    ).toHaveAttribute(SELECTED_ATTRIBUTE, 'true');
    await expectActiveOption(
      input,
      canvas.getByRole('option', { name: navigationCommands[navigationCommands.length - 1].label }),
    );

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: firstCommand.label })).toHaveAttribute(
      SELECTED_ATTRIBUTE,
      'true',
    );
    await expectActiveOption(input, canvas.getByRole('option', { name: firstCommand.label }));

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: projectCommand.label })).toHaveAttribute(
      SELECTED_ATTRIBUTE,
      'true',
    );

    await expectActiveOption(input, canvas.getByRole('option', { name: projectCommand.label }));

    await expect(input).toHaveFocus();
  });

  await step('Enter selects the highlighted result and dismisses the dialog', async () => {
    await userEvent.keyboard('{Enter}');
    await expectDismissed(canvas);
    await expect(canvas.getByLabelText(SELECTED_COMMAND_NAME)).toHaveTextContent(
      projectCommand.label,
    );
    await expect(canvas.getByLabelText(RECENT_COMMANDS_NAME)).toHaveTextContent(projectCommand.id);
  });
}
