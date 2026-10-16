import { useWorkspacePreviewStore } from '../../store';

export function useWorkspacePreview() {
  const store = useWorkspacePreviewStore();
  const selectedCommand = store.use.selectedCommand();

  return { state: { selectedCommand } };
}
