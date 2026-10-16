import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { COMMANDS } from '../../../constants';
import {
  WorkspacePreviewProvider,
  useWorkspacePreviewStore,
} from '../../../store/workspace-preview';
import { WorkspaceRecentCommands } from './workspace-recent-commands';

describe('workspace-recent-commands', () => {
  beforeEach(() => localStorage.clear());

  it('renders store history and clears it through the button', () => {
    let store: ReturnType<typeof useWorkspacePreviewStore>;
    function StoreProbe() {
      store = useWorkspacePreviewStore();
      return null;
    }
    render(
      <>
        <WorkspaceRecentCommands />
        <StoreProbe />
      </>,
      { wrapper: WorkspacePreviewProvider },
    );

    const clearButton = screen.getByRole('button', { name: 'Clear recent commands' });
    expect(clearButton).toBeDisabled();
    expect(screen.getByText('No recent commands')).toBeInTheDocument();

    act(() => store!.getState().actions.setSelectedCommand(COMMANDS[1]));
    expect(
      within(screen.getByRole('list', { name: 'Recently triggered commands' })).getByText(
        COMMANDS[1].label,
      ),
    ).toBeInTheDocument();
    expect(clearButton).toBeEnabled();

    fireEvent.click(clearButton);
    expect(store!.getState().recentCommandIds).toEqual([]);
    expect(screen.getByText('No recent commands')).toBeInTheDocument();
    expect(clearButton).toBeDisabled();
  });
});
