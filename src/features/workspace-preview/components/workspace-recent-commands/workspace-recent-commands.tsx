import { ListX } from 'lucide-react';

import { useWorkspaceRecentCommands } from './use-workspace-recent-commands';

import styles from './workspace-recent-commands.module.css';

export function WorkspaceRecentCommands() {
  const { actions, derived } = useWorkspaceRecentCommands();
  const { isEmptyRecentCommands, recentCommands } = derived;

  return (
    <section aria-label="Recent commands" className={styles['workspace-recent-commands']}>
      <h2 className={styles['workspace-recent-commands__heading']} id="recent-commands-heading">
        Recent commands
      </h2>

      {!isEmptyRecentCommands ? (
        <ul
          aria-label="Recently triggered commands"
          className={styles['workspace-recent-commands__list']}
        >
          {recentCommands.map((recentCommand) => {
            const Icon = recentCommand.icon;

            return (
              <li className={styles['workspace-recent-commands__row']} key={recentCommand.id}>
                <Icon aria-hidden="true" size={16} />
                <span>{recentCommand.label}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles['workspace-recent-commands__empty']}>
          <p>No recent commands</p>
        </div>
      )}

      <div className={styles['workspace-recent-commands__footer']}>
        <button
          className={styles['workspace-recent-commands__clear-button']}
          disabled={isEmptyRecentCommands}
          onClick={actions.onClearRecentCommands}
          type="button"
        >
          <ListX aria-hidden="true" size={18} />
          Clear recent commands
        </button>
      </div>
    </section>
  );
}
