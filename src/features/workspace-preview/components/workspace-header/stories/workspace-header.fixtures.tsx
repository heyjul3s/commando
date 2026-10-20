import { CommandPaletteProvider, useCommandPaletteStore } from '../../../../command-palette/store';
import styles from './workspace-header-stories.module.css';

import type { ReactRenderer, StoryContext } from '@storybook/react-vite';
import type { PartialStoryFn } from 'storybook/internal/types';

export const workspaceHeaderFixtures = {
  closed: { isOpen: false },
  open: { isOpen: true },
};

function PaletteStatus() {
  const palette = useCommandPaletteStore();
  const isOpen = palette.use.isOpen();

  return (
    <aside aria-label="Story fixture state" className={styles['fixture__panel']}>
      <strong>Story fixture state</strong>
      <p className={styles['fixture__hint']}>
        This test readout is separate from the header. The dialog is not mounted here.
      </p>
      <p>
        Palette: <output aria-label="Palette status">{isOpen ? 'Open' : 'Closed'}</output>
      </p>
    </aside>
  );
}

export function withWorkspaceHeaderFixture(
  Story: PartialStoryFn<ReactRenderer>,
  context: StoryContext,
) {
  const fixture: typeof workspaceHeaderFixtures.closed =
    context.parameters.workspaceHeaderFixture ?? workspaceHeaderFixtures.closed;

  return (
    <CommandPaletteProvider initialValues={fixture} key={`${context.id}:${fixture.isOpen}`}>
      <div className={styles.fixture}>
        <div className={styles['fixture__surface']}>
          <Story />
        </div>
        {context.parameters.showPaletteStatus && <PaletteStatus />}
      </div>
    </CommandPaletteProvider>
  );
}
