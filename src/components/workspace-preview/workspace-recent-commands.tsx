import { ListX } from 'lucide-react';

import type { Command } from '../../constants';

import styles from './workspace-recent-commands.module.css';

type WorkspaceRecentCommandsProps = {
  onClearRecentCommands: () => void;
  recentCommands: Command[];
};

export function WorkspaceRecentCommands({
  onClearRecentCommands,
  recentCommands,
}: WorkspaceRecentCommandsProps) {
  const isEmptyRecentCommands = recentCommands.length === 0;

  return (
    <section className={styles['workspace-recent-commands']} aria-label="Recent commands">
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
                <Icon size={16} aria-hidden="true" />
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
          onClick={onClearRecentCommands}
          type="button"
        >
          <ListX size={18} aria-hidden="true" />
          Clear recent commands
        </button>
      </div>
    </section>
  );
}
