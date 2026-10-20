import styles from './workspace-preview-sidebar-stories.module.css';

import type { ReactRenderer, StoryContext } from '@storybook/react-vite';
import type { PartialStoryFn } from 'storybook/internal/types';

export function withSidebarFixture(Story: PartialStoryFn<ReactRenderer>, context: StoryContext) {
  const theme = context.parameters.sidebarTheme ?? 'light';

  return (
    <div className={styles.fixture} data-theme={theme}>
      <div className={styles['fixture__surface']}>
        <Story />
      </div>
    </div>
  );
}
