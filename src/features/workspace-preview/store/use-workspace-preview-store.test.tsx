import { renderHook } from '@testing-library/react';
import { WorkspacePreviewProvider } from './workspace-preview-provider';
import { useWorkspacePreviewStore } from './use-workspace-preview-store';

describe('useWorkspacePreviewStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the store supplied by the provider', () => {
    const { result } = renderHook(() => useWorkspacePreviewStore(), {
      wrapper: ({ children }) => (
        <WorkspacePreviewProvider initialValues={{ recentCommandIds: [] }}>
          {children}
        </WorkspacePreviewProvider>
      ),
    });

    expect(result.current.getState().recentCommandIds).toEqual([]);
    expect(result.current.getState().actions).toBeDefined();
  });

  it('throws an error when used outside of a provider', () => {
    expect(() => renderHook(() => useWorkspacePreviewStore())).toThrow(
      'useWorkspacePreviewStore must be used within a WorkspacePreviewProvider',
    );
  });
});
