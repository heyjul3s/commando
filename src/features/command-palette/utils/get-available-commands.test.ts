import { Search } from 'lucide-react';
import { getAvailableCommands } from './get-available-commands';
import type { Command } from '../../../shared/constants';

const dashboard: Command = {
  group: 'Navigation',
  icon: Search,
  id: 'dashboard',
  label: 'Open Dashboard',
};
const theme: Command = {
  group: 'Settings',
  icon: Search,
  id: 'theme',
  label: 'Toggle Theme',
};
const docs: Command = {
  group: 'Navigation',
  icon: Search,
  id: 'docs',
  label: 'Search Documentation',
};
const profile: Command = {
  group: 'Settings',
  icon: Search,
  id: 'profile',
  label: 'Open Profile',
};

// Interleave groups to distinguish source order from display order.
const commands = [dashboard, theme, docs, profile];

describe('get-available-commands', () => {
  it.each(['', '   '])('returns all commands grouped for an empty query (%j)', (query) => {
    expect(getAvailableCommands(commands, query)).toEqual({
      filteredCommands: [dashboard, docs, theme, profile],
      groupedCommands: { Navigation: [dashboard, docs], Settings: [theme, profile] },
    });
  });

  it('matches partial labels without case or surrounding whitespace sensitivity', () => {
    expect(getAvailableCommands(commands, '  DOCUMENT  ')).toEqual({
      filteredCommands: [docs],
      groupedCommands: { Navigation: [docs] },
    });
  });

  it('matches group names', () => {
    expect(getAvailableCommands(commands, 'settings')).toEqual({
      filteredCommands: [theme, profile],
      groupedCommands: { Settings: [theme, profile] },
    });
  });

  it('preserves group and within-group order after filtering', () => {
    expect(getAvailableCommands(commands, 'open')).toEqual({
      filteredCommands: [dashboard, profile],
      groupedCommands: { Navigation: [dashboard], Settings: [profile] },
    });
  });

  it('returns empty results when nothing matches', () => {
    expect(getAvailableCommands(commands, 'missing')).toEqual({
      filteredCommands: [],
      groupedCommands: {},
    });
  });

  it('handles an empty catalogue', () => {
    expect(getAvailableCommands([], '')).toEqual({ filteredCommands: [], groupedCommands: {} });
  });

  it('does not mutate the input commands', () => {
    const input = commands.map((command) => Object.freeze({ ...command }));
    const originalOrder = [...input];
    Object.freeze(input);

    getAvailableCommands(input, 'open');

    expect(input).toEqual(originalOrder);
  });
});
