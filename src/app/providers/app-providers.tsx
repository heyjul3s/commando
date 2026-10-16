import { combineProviders } from './combine-providers';
import { CommandPaletteProvider } from '../../features/command-palette/store/command-palette-provider';
import { WorkspacePreviewProvider } from '../../features/workspace-preview/store/workspace-preview-provider';

import type { PropsWithChildren } from 'react';

const CombinedAppProviders = combineProviders([
  [CommandPaletteProvider, {}],
  [WorkspacePreviewProvider, {}],
]);

export function AppProviders({ children }: PropsWithChildren) {
  return <CombinedAppProviders>{children}</CombinedAppProviders>;
}
