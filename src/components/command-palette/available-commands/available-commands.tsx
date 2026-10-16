import { useAvailableCommands } from './use-available-commands';
import styles from './available-commands.module.css';

export function AvailableCommands() {
  const { state, actions, derived } = useAvailableCommands();
  const { activeIndex } = state;
  const { filteredCommands, groupedCommands } = derived;
  let commandIndex = -1;

  return (
    <div className={styles['available-commands']} role="listbox" aria-label="Available commands">
      {filteredCommands.length === 0 ? (
        <div className={styles['available-commands__empty-state']}>No commands found</div>
      ) : (
        Object.entries(groupedCommands).map(([group, groupCommands]) => (
          <div className={styles['available-commands__group']} key={group}>
            <div className={styles['available-commands__group-label']}>{group}</div>
            {groupCommands.map((command) => {
              commandIndex += 1;
              const Icon = command.icon;
              const index = commandIndex;
              const selected = index === activeIndex;
              const handlers = actions.getCommandHandlers(command, index);

              return (
                <button
                  className={styles['available-commands__item']}
                  data-selected={selected}
                  key={command.id}
                  role="option"
                  aria-selected={selected}
                  type="button"
                  onMouseEnter={handlers.onMouseEnter}
                  onClick={handlers.onClick}
                >
                  <span className={styles['available-commands__item-icon']}>
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className={styles['available-commands__item-label']}>{command.label}</span>
                </button>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
