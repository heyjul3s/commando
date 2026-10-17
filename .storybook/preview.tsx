import { AppProviders } from '../src/app/providers';
import '../src/styles.css';

import type { Decorator, Preview } from '@storybook/react-vite';

const withAppProviders: Decorator = (Story) => (
  <AppProviders>
    <Story />
  </AppProviders>
);

const preview: Preview = {
  decorators: [withAppProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },
  },
};

export default preview;
