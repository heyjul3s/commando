import {
  Bell,
  CalendarDays,
  FileText,
  FolderOpen,
  Keyboard,
  LayoutDashboard,
  Moon,
  Search,
  Settings,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export type Command = {
  id: string;
  label: string;
  group: string;
  shortcut?: string;
  icon: LucideIcon;
};

export type Commands = Command[];

export const COMMANDS: Commands = [
  {
    id: 'dashboard',
    label: 'Open Dashboard',
    group: 'Navigation',
    icon: LayoutDashboard,
  },
  {
    id: 'projects',
    label: 'Browse Projects',
    group: 'Navigation',
    icon: FolderOpen,
  },
  {
    id: 'docs',
    label: 'Search Documentation',
    group: 'Navigation',
    icon: Search,
  },
  {
    id: 'brief',
    label: 'Create Weekly Brief',
    group: 'Actions',
    icon: FileText,
  },
  {
    id: 'ai',
    label: 'Ask Assistant',
    group: 'Actions',
    icon: Sparkles,
  },
  {
    id: 'favourite',
    label: 'Save Current View',
    group: 'Actions',
    icon: Star,
  },
  {
    id: 'calendar',
    label: 'Review Calendar',
    group: 'Workspace',
    icon: CalendarDays,
  },
  {
    id: 'notifications',
    label: 'Manage Notifications',
    group: 'Workspace',
    icon: Bell,
  },
  {
    id: 'profile',
    label: 'Edit Profile',
    group: 'Settings',
    icon: UserRound,
  },
  {
    id: 'theme',
    label: 'Toggle Dark Mode',
    group: 'Settings',
    icon: Moon,
  },
  {
    id: 'keyboard',
    label: 'Keyboard Shortcuts',
    group: 'Settings',
    icon: Keyboard,
  },
  {
    id: 'settings',
    label: 'Open Settings',
    group: 'Settings',
    icon: Settings,
  },
];
