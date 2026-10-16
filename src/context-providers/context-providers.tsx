import { combineProviders } from './combine-providers';
import { CommandPaletteProvider } from '../store/command-palette/command-palette-context';
import { WorkspacePreviewProvider } from '../store/workspace-preview/workspace-preview-context';

import type { PropsWithChildren } from 'react';

const CombinedContextProviders = combineProviders([
  [CommandPaletteProvider, {}],
  [WorkspacePreviewProvider, {}],
]);

export function ContextProviders({ children }: PropsWithChildren) {
  return <CombinedContextProviders>{children}</CombinedContextProviders>;
}
