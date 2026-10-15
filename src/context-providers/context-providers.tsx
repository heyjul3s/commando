import { combineProviders } from './combine-providers';

type ContextProvidersArgs = {
  children: React.ReactNode;
};

import { CommandPaletteProvider } from '../store/command-palette/command-palette-context';
import { WorkspacePreviewProvider } from '../store/workspace-preview/workspace-preview-context';

export function ContextProviders({ children }: ContextProvidersArgs) {
  const CombinedContextProviders = combineProviders([
    [CommandPaletteProvider, {}],
    [WorkspacePreviewProvider, {}],
  ]);

  return <CombinedContextProviders>{children}</CombinedContextProviders>;
}
