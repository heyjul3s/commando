import { expect } from 'storybook/test';

import type { StoryContext } from '@storybook/react-vite';

const OPEN_BUTTON_NAME = /Open command menu/;
const PALETTE_STATUS_NAME = 'Palette status';

// -----------------------------------------------------------------------------
// Opening the palette
// -----------------------------------------------------------------------------

export async function pointerOpen({ canvas, step, userEvent }: StoryContext) {
  const status = canvas.getByRole('status', { name: PALETTE_STATUS_NAME });

  await step('The palette starts closed', async () => {
    await expect(status).toHaveTextContent('Closed');
  });

  await step('Clicking the trigger opens the palette through the store', async () => {
    await userEvent.click(canvas.getByRole('button', { name: OPEN_BUTTON_NAME }));
    await expect(status).toHaveTextContent('Open');
  });
}

async function openWithKeyboard({ canvas, step, userEvent }: StoryContext, key: string) {
  const trigger = canvas.getByRole('button', { name: OPEN_BUTTON_NAME });
  const status = canvas.getByRole('status', { name: PALETTE_STATUS_NAME });

  await step('Tab reaches the header trigger while the palette is closed', async () => {
    await expect(status).toHaveTextContent('Closed');
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
  });

  await step('Keyboard activation opens the palette', async () => {
    await userEvent.keyboard(key);
    await expect(status).toHaveTextContent('Open');
    await expect(trigger).toHaveFocus();
  });
}

export async function enterOpen(context: StoryContext) {
  await openWithKeyboard(context, '{Enter}');
}

export async function spaceOpen(context: StoryContext) {
  await openWithKeyboard(context, ' ');
}

// -----------------------------------------------------------------------------
// Already-open state
// -----------------------------------------------------------------------------

export async function alreadyOpen({ canvas, step, userEvent }: StoryContext) {
  const status = canvas.getByRole('status', { name: PALETTE_STATUS_NAME });

  await step('The palette starts open', async () => {
    await expect(status).toHaveTextContent('Open');
  });

  await step('Repeated activation keeps the palette open rather than toggling it', async () => {
    const trigger = canvas.getByRole('button', { name: OPEN_BUTTON_NAME });
    await userEvent.click(trigger);
    await expect(status).toHaveTextContent('Open');
    await userEvent.click(trigger);
    await expect(status).toHaveTextContent('Open');
  });
}
