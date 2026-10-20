import { AppProviders } from '../src/app/providers';
import '../src/styles.css';
import { THEME, isThemePreference } from '../src/app/theme/theme';

import type { Preview, ReactRenderer, StoryContext } from '@storybook/react-vite';
import type { PartialStoryFn } from 'storybook/internal/types';

function withAppProviders(Story: PartialStoryFn<ReactRenderer>, context: StoryContext) {
  const theme = context.globals.theme;

  return (
    <AppProviders
      persistTheme={false}
      themePreference={isThemePreference(theme) ? theme : THEME.Light}
    >
      <Story />
    </AppProviders>
  );
}

const preview: Preview = {
  decorators: [withAppProviders],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        dynamicTitle: true,
        icon: 'paintbrush',
        items: [
          { title: 'Light', value: THEME.Light },
          { title: 'Dark', value: THEME.Dark },
          { title: 'System', value: THEME.System },
        ],
      },
    },
  },
  initialGlobals: { theme: THEME.Light },
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
