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
    group: 'Navigation',
    icon: LayoutDashboard,
    id: 'dashboard',
    label: 'Open Dashboard',
  },
  {
    group: 'Navigation',
    icon: FolderOpen,
    id: 'projects',
    label: 'Browse Projects',
  },
  {
    group: 'Navigation',
    icon: Search,
    id: 'docs',
    label: 'Search Documentation',
  },
  {
    group: 'Actions',
    icon: FileText,
    id: 'brief',
    label: 'Create Weekly Brief',
  },
  {
    group: 'Actions',
    icon: Sparkles,
    id: 'ai',
    label: 'Ask Assistant',
  },
  {
    group: 'Actions',
    icon: Star,
    id: 'favourite',
    label: 'Save Current View',
  },
  {
    group: 'Workspace',
    icon: CalendarDays,
    id: 'calendar',
    label: 'Review Calendar',
  },
  {
    group: 'Workspace',
    icon: Bell,
    id: 'notifications',
    label: 'Manage Notifications',
  },
  {
    group: 'Settings',
    icon: UserRound,
    id: 'profile',
    label: 'Edit Profile',
  },
  {
    group: 'Settings',
    icon: Moon,
    id: 'theme',
    label: 'Toggle Dark Mode',
  },
  {
    group: 'Settings',
    icon: Keyboard,
    id: 'keyboard',
    label: 'Keyboard Shortcuts',
  },
  {
    group: 'Settings',
    icon: Settings,
    id: 'settings',
    label: 'Open Settings',
  },
];
