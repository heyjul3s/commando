import { expect, waitFor } from 'storybook/test';
import { projectCommand } from './available-commands.fixtures';

import type { StoryContext } from '@storybook/react-vite';

const DASHBOARD_COMMAND_NAME = 'Open Dashboard';
const SELECTED_COMMAND_NAME = 'Selected command';
const HIGHLIGHTED_COMMAND_NAME = 'Highlighted command';
const PALETTE_STATE_NAME = 'Palette state';
const SELECTED_ATTRIBUTE = 'aria-selected';

export async function hoverCommand({ canvas, step, userEvent }: StoryContext) {
  const command = canvas.getByRole('option', { name: projectCommand.label });

  await step('Hover highlights the command', async () => {
    await userEvent.hover(command);
    await expect(command).toHaveAttribute(SELECTED_ATTRIBUTE, 'true');
    await expect(canvas.getByRole('option', { name: DASHBOARD_COMMAND_NAME })).toHaveAttribute(
      SELECTED_ATTRIBUTE,
      'false',
    );
  });
}

export async function selectCommand(context: StoryContext) {
  const { canvas, step, userEvent } = context;

  await step('Palette starts open', async () => {
    await expect(canvas.getByLabelText(PALETTE_STATE_NAME)).toHaveTextContent('Open');
  });

  await hoverCommand(context);

  await step('Click selects the command and closes the palette', async () => {
    await userEvent.click(canvas.getByRole('option', { name: projectCommand.label }));

    await waitFor(async () => {
      await expect(canvas.getByLabelText(SELECTED_COMMAND_NAME)).toHaveTextContent(
        projectCommand.label,
      );

      await expect(canvas.getByLabelText(PALETTE_STATE_NAME)).toHaveTextContent('Closed');
    });
  });
}

export async function hoverHighlight(context: StoryContext) {
  await hoverCommand(context);

  const { canvas, step } = context;

  await step('Store reflects the highlighted command', async () => {
    await expect(canvas.getByLabelText(HIGHLIGHTED_COMMAND_NAME)).toHaveTextContent(
      projectCommand.label,
    );
  });

  await step('Hover story only displays highlight status', async () => {
    await expect(canvas.queryByLabelText(SELECTED_COMMAND_NAME)).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText(PALETTE_STATE_NAME)).not.toBeInTheDocument();
  });
}
