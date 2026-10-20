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
      className={styles['available-commands__group']}
      key={group}
      role="group"
      aria-label={group}
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
            className={styles['available-commands__item']}
            id={`${listboxId}-${command.id}`}
            data-selected={selected}
            key={command.id}
            role="option"
            tabIndex={-1}
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
  ));

  return (
    <div
      className={styles['available-commands']}
      role="listbox"
      aria-label="Available commands"
      id={listboxId}
      tabIndex={tabIndex}
    >
      {commandGroups}
    </div>
  );
}
