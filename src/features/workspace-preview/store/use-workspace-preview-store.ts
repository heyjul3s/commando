import { useContext } from 'react';
import { WorkspacePreviewContext } from './workspace-preview-provider';

export function useWorkspacePreviewStore() {
  const store = useContext(WorkspacePreviewContext);

  if (!store) {
    throw new Error('useWorkspacePreviewStore must be used within a WorkspacePreviewProvider');
  }

  return store;
}
