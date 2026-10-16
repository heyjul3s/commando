import { useWorkspacePreviewStore } from '../../store/workspace-preview';

export function useWorkspacePreview() {
  const store = useWorkspacePreviewStore();
  const selectedCommand = store.use.selectedCommand();

  return { state: { selectedCommand } };
}
