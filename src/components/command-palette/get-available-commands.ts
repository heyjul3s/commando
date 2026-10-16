import type { Command } from '../../constants';

export function getAvailableCommands(commands: Command[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = normalizedQuery
    ? commands.filter((command) =>
        `${command.label} ${command.group}`.toLowerCase().includes(normalizedQuery),
      )
    : commands;
  const groupedCommands = matches.reduce<Record<string, Command[]>>((groups, command) => {
    groups[command.group] = groups[command.group] ?? [];
    groups[command.group].push(command);
    return groups;
  }, {});

  // Keyboard navigation must use the same group order as the rendered list.
  return { groupedCommands, filteredCommands: Object.values(groupedCommands).flat() };
}
