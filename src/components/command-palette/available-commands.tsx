import type { Command } from '../../constants/commands';
import styles from './available-commands.module.css';

type AvailableCommandsProps = {
  activeIndex: number;
  filteredCommands: Command[];
  groupedCommands: Record<string, Command[]>;
  onActiveIndexChange: (index: number) => void;
  onSelect: (command: Command) => void;
};

export function AvailableCommands({
  activeIndex,
  filteredCommands,
  groupedCommands,
  onActiveIndexChange,
  onSelect,
}: AvailableCommandsProps) {
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
              const selected = commandIndex === activeIndex;

              return (
                <button
                  className={styles['available-commands__item']}
                  data-selected={selected}
                  key={command.id}
                  role="option"
                  aria-selected={selected}
                  type="button"
                  onMouseEnter={() => onActiveIndexChange(commandIndex)}
                  onClick={() => onSelect(command)}
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
