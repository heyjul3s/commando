import { Search } from 'lucide-react';
import { getAvailableCommands } from './get-available-commands';
import type { Command } from '../../../shared/constants';

const dashboard: Command = {
  id: 'dashboard',
  label: 'Open Dashboard',
  group: 'Navigation',
  icon: Search,
};
const theme: Command = {
  id: 'theme',
  label: 'Toggle Theme',
  group: 'Settings',
  icon: Search,
};
const docs: Command = {
  id: 'docs',
  label: 'Search Documentation',
  group: 'Navigation',
  icon: Search,
};
const profile: Command = {
  id: 'profile',
  label: 'Open Profile',
  group: 'Settings',
  icon: Search,
};

// Interleave groups to distinguish source order from display order.
const commands = [dashboard, theme, docs, profile];

describe('get-available-commands', () => {
  it.each(['', '   '])('returns all commands grouped for an empty query (%j)', (query) => {
    expect(getAvailableCommands(commands, query)).toEqual({
      groupedCommands: { Navigation: [dashboard, docs], Settings: [theme, profile] },
      filteredCommands: [dashboard, docs, theme, profile],
    });
  });

  it('matches partial labels without case or surrounding whitespace sensitivity', () => {
    expect(getAvailableCommands(commands, '  DOCUMENT  ')).toEqual({
      groupedCommands: { Navigation: [docs] },
      filteredCommands: [docs],
    });
  });

  it('matches group names', () => {
    expect(getAvailableCommands(commands, 'settings')).toEqual({
      groupedCommands: { Settings: [theme, profile] },
      filteredCommands: [theme, profile],
    });
  });

  it('preserves group and within-group order after filtering', () => {
    expect(getAvailableCommands(commands, 'open')).toEqual({
      groupedCommands: { Navigation: [dashboard], Settings: [profile] },
      filteredCommands: [dashboard, profile],
    });
  });

  it('returns empty results when nothing matches', () => {
    expect(getAvailableCommands(commands, 'missing')).toEqual({
      groupedCommands: {},
      filteredCommands: [],
    });
  });

  it('handles an empty catalog', () => {
    expect(getAvailableCommands([], '')).toEqual({ groupedCommands: {}, filteredCommands: [] });
  });

  it('does not mutate the input commands', () => {
    const input = commands.map((command) => Object.freeze({ ...command }));
    const originalOrder = [...input];
    Object.freeze(input);

    getAvailableCommands(input, 'open');

    expect(input).toEqual(originalOrder);
  });
});
