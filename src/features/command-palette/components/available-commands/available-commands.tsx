import { useAvailableCommands } from './use-available-commands';
import styles from './available-commands.module.css';

type AvailableCommandsProps = {
  listboxId: string;
  tabIndex?: 0 | -1;
};

export function AvailableCommands({ listboxId, tabIndex }: AvailableCommandsProps) {
  const { actions, derived, state } = useAvailableCommands();
  const { activeIndex } = state;
  const { filteredCommands, groupedCommands } = derived;
  let commandIndex = -1;

  if (filteredCommands.length === 0) {
    return (
      <div className={styles['available-commands']}>
        <div className={styles['available-commands__empty-state']} role="status">
          No commands found
        </div>
      </div>
    );
  }

  const commandGroups = Object.entries(groupedCommands).map(([group, groupCommands]) => (
    <div
      aria-label={group}
      className={styles['available-commands__group']}
      key={group}
      role="group"
    >
      <div className={styles['available-commands__group-label']}>{group}</div>
      {groupCommands.map((command) => {
        commandIndex += 1;
        const Icon = command.icon;
        const index = commandIndex;
        const selected = index === activeIndex;
        const handlers = actions.getCommandHandlers(command, index);

        return (
          <button
            aria-selected={selected}
            className={styles['available-commands__item']}
            data-selected={selected}
            id={`${listboxId}-${command.id}`}
            key={command.id}
            onClick={handlers.onClick}
            onMouseEnter={handlers.onMouseEnter}
            role="option"
            tabIndex={-1}
            type="button"
          >
            <span className={styles['available-commands__item-icon']}>
              <Icon aria-hidden="true" size={17} />
            </span>
            <span className={styles['available-commands__item-label']}>{command.label}</span>
          </button>
        );
      })}
    </div>
  ));

  return (
    <div
      aria-label="Available commands"
      className={styles['available-commands']}
      id={listboxId}
      role="listbox"
      tabIndex={tabIndex}
    >
      {commandGroups}
    </div>
  );
}
