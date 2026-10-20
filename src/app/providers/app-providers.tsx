import { combineProviders } from './combine-providers';
import { CommandPaletteProvider } from '../../features/command-palette/store/command-palette-provider';
import { WorkspacePreviewProvider } from '../../features/workspace-preview/store/workspace-preview-provider';

import type { PropsWithChildren } from 'react';
import { ThemeProvider } from '../theme/theme-provider';
import type { ThemePreference } from '../theme/theme';

type AppProvidersProps = PropsWithChildren<{
  persistTheme?: boolean;
  themePreference?: ThemePreference;
}>;

const CombinedAppProviders = combineProviders([
  [CommandPaletteProvider, {}],
  [WorkspacePreviewProvider, {}],
]);

export function AppProviders({
  children,
  persistTheme = true,
  themePreference,
}: AppProvidersProps) {
  return (
    <ThemeProvider preference={themePreference} persist={persistTheme}>
      <CombinedAppProviders>{children}</CombinedAppProviders>
    </ThemeProvider>
  );
}
